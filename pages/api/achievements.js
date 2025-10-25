import pool from '../../config/db'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'GET') {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(
        'SELECT * FROM achievements ORDER BY created_at DESC LIMIT 10'
      )
      
      // Get media for each achievement
      for (let i = 0; i < rows.length; i++) {
        const [media] = await connection.query(
          'SELECT * FROM achievements_media WHERE achievement_id = ?',
          [rows[i].id]
        )
        rows[i].media = media
      }
      
      connection.release()
      res.status(200).json(rows)
    } catch (error) {
      console.error('Error fetching achievements:', error)
      res.status(500).json({ message: 'خطأ في جلب الإنجازات' })
    }
  } else if (req.method === 'POST') {
    const { title, content, media } = req.body
    console.log('📨 POST /api/achievements received:', { title, content, media: media?.length })

    if (!title || !content) {
      console.log('❌ Validation failed - missing title or content')
      return res.status(400).json({ message: 'العنوان والمحتوى مطلوبان' })
    }

    try {
      console.log('🔌 Getting database connection...')
      const connection = await pool.getConnection()
      console.log('✅ Connection established')
      
      // Insert achievement
      const result = await connection.query(
        'INSERT INTO achievements (title, content, created_at) VALUES (?, ?, NOW())',
        [title, content]
      )
      const achievementId = result[0].insertId
      console.log('✅ Achievement inserted with ID:', achievementId)
      
      // Insert media files
      if (media && Array.isArray(media) && media.length > 0) {
        for (const item of media) {
          await connection.query(
            'INSERT INTO achievements_media (achievement_id, file_path, file_type) VALUES (?, ?, ?)',
            [achievementId, item.filePath, item.fileType]
          )
        }
        console.log('✅ Media files inserted:', media.length)
      }
      
      connection.release()
      res.status(201).json({ message: 'تم إضافة الإنجاز بنجاح', achievementId })
    } catch (error) {
      console.error('🔴 Database error:', error)
      res.status(500).json({ message: 'خطأ في إضافة الإنجاز: ' + error.message })
    }
  } else {
    res.status(405).json({ message: 'الطريقة غير مدعومة' })
  }
}