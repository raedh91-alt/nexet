import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  try {
    if (req.method === 'GET') {
      // جلب جميع المستخدمين
      const connection = await pool.getConnection()
      const [users] = await connection.query('SELECT id, username, full_name, email, role, is_active, created_at FROM users ORDER BY created_at DESC')
      connection.release()
      return res.status(200).json(users)
    }

    if (req.method === 'POST') {
      // إضافة مستخدم جديد
      const { username, password, full_name, email, role } = req.body

      if (!username || !password || !full_name) {
        return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور والاسم الكامل مطلوبان' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const connection = await pool.getConnection()
      try {
        await connection.query(
          'INSERT INTO users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
          [username, hashedPassword, full_name, email || null, role || 'viewer']
        )
        const [newUser] = await connection.query('SELECT id, username, full_name, email, role, is_active FROM users WHERE username = ?', [username])
        connection.release()
        return res.status(201).json({ message: 'تم إضافة المستخدم بنجاح', user: newUser[0] })
      } catch (error) {
        connection.release()
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' })
        }
        throw error
      }
    }

    res.status(405).json({ message: 'الطريقة غير مدعومة' })
  } catch (error) {
    console.error('خطأ في API المستخدمين:', error)
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message })
  }
}