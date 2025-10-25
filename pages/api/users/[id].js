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
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  const { id } = req.query

  try {
    if (req.method === 'GET') {
      // جلب مستخدم واحد
      const connection = await pool.getConnection()
      const [users] = await connection.query('SELECT id, username, full_name, email, role, is_active FROM users WHERE id = ?', [id])
      connection.release()

      if (users.length === 0) {
        return res.status(404).json({ message: 'المستخدم غير موجود' })
      }

      return res.status(200).json(users[0])
    }

    if (req.method === 'PUT') {
      // تعديل بيانات المستخدم
      const { full_name, email, role, is_active } = req.body

      const connection = await pool.getConnection()
      await connection.query(
        'UPDATE users SET full_name = ?, email = ?, role = ?, is_active = ? WHERE id = ?',
        [full_name, email || null, role, is_active !== undefined ? is_active : 1, id]
      )

      const [updated] = await connection.query('SELECT id, username, full_name, email, role, is_active FROM users WHERE id = ?', [id])
      connection.release()

      return res.status(200).json({ message: 'تم تحديث المستخدم بنجاح', user: updated[0] })
    }

    if (req.method === 'DELETE') {
      // حذف مستخدم
      const connection = await pool.getConnection()
      const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id])
      connection.release()

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'المستخدم غير موجود' })
      }

      return res.status(200).json({ message: 'تم حذف المستخدم بنجاح' })
    }

    res.status(405).json({ message: 'الطريقة غير مدعومة' })
  } catch (error) {
    console.error('خطأ في API المستخدم:', error)
    res.status(500).json({ message: 'خطأ في الخادم', error: error.message })
  }
}