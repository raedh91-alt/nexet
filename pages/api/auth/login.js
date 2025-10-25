import jwt from 'jsonwebtoken'

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || '12345',
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'POST') {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'اسم المستخدم وكلمة المرور مطلوبان' })
    }

    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' })
      return res.status(200).json({
        message: 'تم تسجيل الدخول بنجاح',
        token,
      })
    }

    res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' })
  } else {
    res.status(405).json({ message: 'الطريقة غير مدعومة' })
  }
}