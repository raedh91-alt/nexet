import pool from '../../config/db'

export default async function handler(req, res) {
  // Allow CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'GET') {
    try {
      const connection = await pool.getConnection()
      const [rows] = await connection.query(
        'SELECT * FROM news ORDER BY created_at DESC LIMIT 10'
      )
      
      // Get media for each news
      for (let i = 0; i < rows.length; i++) {
        const [media] = await connection.query(
          'SELECT * FROM news_media WHERE news_id = ?',
          [rows[i].id]
        )
        rows[i].media = media
      }
      
      connection.release()
      res.status(200).json(rows)
    } catch (error) {
      console.error('Error fetching news:', error)
      res.status(500).json({ message: 'خطأ في جلب الأخبار' })
    }
  } else if (req.method === 'POST') {
    const { title, content, media } = req.body
    console.log('📨 POST /api/news received:', { title, content, media: media?.length })

    if (!title || !content) {
      console.log('❌ Validation failed - missing title or content')
      return res.status(400).json({ message: 'العنوان والمحتوى مطلوبان' })
    }

    try {
      console.log('🔌 Getting database connection...')
      const connection = await pool.getConnection()
      console.log('✅ Connection established')
      
      // Insert news
      const result = await connection.query(
        'INSERT INTO news (title, content, created_at) VALUES (?, ?, NOW())',
        [title, content]
      )
      const newsId = result[0].insertId
      console.log('✅ News inserted with ID:', newsId)
      
      // Insert media files
      if (media && Array.isArray(media) && media.length > 0) {
        for (const item of media) {
          await connection.query(
            'INSERT INTO news_media (news_id, file_path, file_type) VALUES (?, ?, ?)',
            [newsId, item.filePath, item.fileType]
          )
        }
        console.log('✅ Media files inserted:', media.length)
      }
      
      connection.release()
      res.status(201).json({ message: 'تم إضافة الخبر بنجاح', newsId })
    } catch (error) {
      console.error('🔴 Database error:', error)
      res.status(500).json({ message: 'خطأ في إضافة الخبر: ' + error.message })
    }
  } else if (req.method === 'DELETE') {
    res.status(405).json({ message: 'استخدم /api/news/[id] للحذف' })
  } else {
    res.status(405).json({ message: 'الطريقة غير مدعومة' })
  }
}