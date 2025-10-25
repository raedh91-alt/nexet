import pool from '../../../config/db'

export default async function handler(req, res) {
  const { id } = req.query

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'DELETE') {
    try {
      const connection = await pool.getConnection()
      await connection.query('DELETE FROM news WHERE id = ?', [id])
      connection.release()
      res.status(200).json({ message: 'تم حذف الخبر بنجاح' })
    } catch (error) {
      console.error('Error deleting news:', error)
      res.status(500).json({ message: 'خطأ في حذف الخبر' })
    }
  } else {
    res.status(405).json({ message: 'الطريقة غير مدعومة' })
  }
}