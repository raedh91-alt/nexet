import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('admin_token', data.token)
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'اسم المستخدم أو كلمة المرور غير صحيحة')
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-700 to-blue-900">
      <form onSubmit={handleLogin} className="bg-white shadow-2xl rounded-xl p-8 w-96">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">تسجيل الدخول</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">اسم المستخدم</label>
          <input 
            type="text" 
            placeholder="أدخل اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">كلمة المرور</label>
          <input 
            type="password" 
            placeholder="أدخل كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-700 text-white w-full py-3 rounded font-bold hover:bg-blue-800 disabled:bg-gray-400 transition duration-200"
        >
          {loading ? 'جاري التحقق...' : 'دخول'}
        </button>
      </form>
    </div>
  )
}