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
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'الطريقة غير مدعومة' })
  }

  const { userId, newPassword } = req.body

  try {
    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'معرف المستخدم وكلمة المرور الجديدة مطلوبان' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const connection = await pool.getConnection()
    const [result] = await connection.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    )
    connection.release()

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' })
    }

    return res.status(200).json({ message: 'تم تغيير كلمة المرور بنجاح' })
  } catch (error) {
    console.error('خطأ في تغيير كلمة المرور:', error)
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message })
  }
}