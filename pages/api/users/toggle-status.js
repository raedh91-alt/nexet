import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'south_electricity_maysan',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'الطريقة غير مدعومة' })
  }

  const { userId } = req.body

  try {
    if (!userId) {
      return res.status(400).json({ message: 'معرف المستخدم مطلوب' })
    }

    const connection = await pool.getConnection()
    
    // جلب الحالة الحالية
    const [user] = await connection.query('SELECT is_active FROM users WHERE id = ?', [userId])
    
    if (user.length === 0) {
      connection.release()
      return res.status(404).json({ message: 'المستخدم غير موجود' })
    }

    // تبديل الحالة
    const newStatus = !user[0].is_active
    await connection.query('UPDATE users SET is_active = ? WHERE id = ?', [newStatus, userId])
    
    const [updated] = await connection.query('SELECT id, username, full_name, email, role, is_active FROM users WHERE id = ?', [userId])
    connection.release()

    return res.status(200).json({ 
      message: newStatus ? 'تم تفعيل المستخدم' : 'تم تعطيل المستخدم',
      user: updated[0] 
    })
  } catch (error) {
    console.error('خطأ في تبديل حالة المستخدم:', error)
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message })
  }
}