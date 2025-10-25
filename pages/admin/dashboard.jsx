import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import DashboardHeader from '../../components/DashboardHeader'

export default function Dashboard() {
  const [tab, setTab] = useState('news')
  const [newsTitle, setNewsTitle] = useState('')
  const [newsContent, setNewsContent] = useState('')
  const [newsMedia, setNewsMedia] = useState([])
  const [newsMediaPreviews, setNewsMediaPreviews] = useState([])
  
  const [achievementTitle, setAchievementTitle] = useState('')
  const [achievementContent, setAchievementContent] = useState('')
  const [achievementMedia, setAchievementMedia] = useState([])
  const [achievementMediaPreviews, setAchievementMediaPreviews] = useState([])
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [newsList, setNewsList] = useState([])
  const [achievementsList, setAchievementsList] = useState([])

  // Users Management State
  const [usersList, setUsersList] = useState([])
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState(null)
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'editor'
  })
  const [changePasswordUserId, setChangePasswordUserId] = useState(null)
  const [newPassword, setNewPassword] = useState('')

  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchNews()
    fetchAchievements()
    fetchUsers()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
    }
  }

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setNewsList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('خطأ في جلب الأخبار:', error)
      setNewsList([])
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      const data = await response.json()
      setAchievementsList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('خطأ في جلب الإنجازات:', error)
      setAchievementsList([])
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsersList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error)
      setUsersList([])
    }
  }

  const uploadFile = async (file) => {
    if (!file) return null

    try {
      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onload = async (e) => {
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: e.target.result, filename: file.name }),
          })

          if (response.ok) {
            const data = await response.json()
            resolve(data)
          } else {
            resolve(null)
          }
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('خطأ في تحميل الملف:', error)
      return null
    }
  }

  // News Media Handlers
  const handleNewsMediaChange = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach((file) => {
      setNewsMedia((prev) => [...prev, file])
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const isVideo = file.type.startsWith('video')
        setNewsMediaPreviews((prev) => [...prev, {
          preview: e.target.result,
          type: isVideo ? 'video' : 'image',
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeNewsMedia = (index) => {
    setNewsMedia((prev) => prev.filter((_, i) => i !== index))
    setNewsMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Achievement Media Handlers
  const handleAchievementMediaChange = (e) => {
    const files = Array.from(e.target.files)
    
    files.forEach((file) => {
      setAchievementMedia((prev) => [...prev, file])
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const isVideo = file.type.startsWith('video')
        setAchievementMediaPreviews((prev) => [...prev, {
          preview: e.target.result,
          type: isVideo ? 'video' : 'image',
          name: file.name
        }])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeAchievementMedia = (index) => {
    setAchievementMedia((prev) => prev.filter((_, i) => i !== index))
    setAchievementMediaPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Upload and add news
  const handleAddNews = async (e) => {
    e.preventDefault()
    console.log('🔵 handleAddNews triggered')
    setLoading(true)
    setMessage('')

    try {
      console.log('📝 newsTitle:', newsTitle, 'newsContent:', newsContent)
      
      // Upload all media files
      const uploadedMedia = []
      for (const file of newsMedia) {
        console.log('🖼️ Uploading media file:', file.name)
        const result = await uploadFile(file)
        if (result) {
          uploadedMedia.push({
            filePath: result.filePath,
            fileType: result.fileType
          })
        }
      }

      console.log('📤 Sending to API with', uploadedMedia.length, 'media files')
      
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newsTitle, 
          content: newsContent, 
          media: uploadedMedia 
        }),
      })

      console.log('📥 Response status:', response.status)
      
      if (response.ok) {
        console.log('✅ Success!')
        setMessage('تم إضافة الخبر بنجاح')
        setNewsTitle('')
        setNewsContent('')
        setNewsMedia([])
        setNewsMediaPreviews([])
        fetchNews()
        setTimeout(() => setMessage(''), 3000)
      } else {
        console.log('❌ Response not ok, status:', response.status)
        const errorData = await response.json()
        console.log('❌ Error:', errorData)
        setMessage('❌ خطأ (' + response.status + '): ' + (errorData.message || 'خطأ غير معروف'))
      }
    } catch (error) {
      console.error('🔴 Exception:', error)
      setMessage('خطأ في الاتصال: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Upload and add achievement
  const handleAddAchievement = async (e) => {
    e.preventDefault()
    console.log('🔵 handleAddAchievement triggered')
    setLoading(true)
    setMessage('')

    try {
      console.log('📝 achievementTitle:', achievementTitle, 'achievementContent:', achievementContent)
      
      // Upload all media files
      const uploadedMedia = []
      for (const file of achievementMedia) {
        console.log('🖼️ Uploading media file:', file.name)
        const result = await uploadFile(file)
        if (result) {
          uploadedMedia.push({
            filePath: result.filePath,
            fileType: result.fileType
          })
        }
      }

      console.log('📤 Sending to API with', uploadedMedia.length, 'media files')
      
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: achievementTitle, 
          content: achievementContent, 
          media: uploadedMedia 
        }),
      })

      console.log('📥 Response status:', response.status)
      
      if (response.ok) {
        console.log('✅ Success!')
        setMessage('تم إضافة الإنجاز بنجاح')
        setAchievementTitle('')
        setAchievementContent('')
        setAchievementMedia([])
        setAchievementMediaPreviews([])
        fetchAchievements()
        setTimeout(() => setMessage(''), 3000)
      } else {
        console.log('❌ Response not ok, status:', response.status)
        const errorData = await response.json()
        console.log('❌ Error:', errorData)
        setMessage('❌ خطأ (' + response.status + '): ' + (errorData.message || 'خطأ غير معروف'))
      }
    } catch (error) {
      console.error('🔴 Exception:', error)
      setMessage('خطأ في الاتصال: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const handleDeleteNews = async (id) => {
    if (confirm('هل تريد حذف هذا الخبر؟')) {
      try {
        await fetch(`/api/news/${id}`, { method: 'DELETE' })
        fetchNews()
      } catch (error) {
        console.error('خطأ في حذف الخبر:', error)
      }
    }
  }

  const handleDeleteAchievement = async (id) => {
    if (confirm('هل تريد حذف هذا الإنجاز؟')) {
      try {
        await fetch(`/api/achievements/${id}`, { method: 'DELETE' })
        fetchAchievements()
      } catch (error) {
        console.error('خطأ في حذف الإنجاز:', error)
      }
    }
  }

  // User Management Functions
  const handleAddUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const url = editingUserId ? `/api/users/${editingUserId}` : '/api/users'
      const method = editingUserId ? 'PUT' : 'POST'
      const body = editingUserId 
        ? {
            full_name: userFormData.full_name,
            email: userFormData.email,
            role: userFormData.role
          }
        : userFormData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        setMessage(editingUserId ? 'تم تحديث المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح')
        resetUserForm()
        fetchUsers()
        setTimeout(() => setMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setMessage('❌ ' + (errorData.message || 'خطأ غير معروف'))
      }
    } catch (error) {
      setMessage('خطأ في الاتصال: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetUserForm = () => {
    setUserFormData({
      username: '',
      password: '',
      full_name: '',
      email: '',
      role: 'editor'
    })
    setShowAddUserForm(false)
    setEditingUserId(null)
  }

  const handleEditUser = (user) => {
    setUserFormData({
      username: user.username,
      password: '',
      full_name: user.full_name,
      email: user.email || '',
      role: user.role
    })
    setEditingUserId(user.id)
    setShowAddUserForm(true)
  }

  const handleDeleteUser = async (id) => {
    if (confirm('هل تريد حذف هذا المستخدم؟')) {
      try {
        const response = await fetch(`/api/users/${id}`, { method: 'DELETE' })
        if (response.ok) {
          setMessage('تم حذف المستخدم بنجاح')
          fetchUsers()
        }
      } catch (error) {
        setMessage('خطأ في حذف المستخدم: ' + error.message)
      }
    }
  }

  const handleToggleUserStatus = async (id) => {
    try {
      const response = await fetch('/api/users/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        fetchUsers()
      }
    } catch (error) {
      setMessage('خطأ في تبديل حالة المستخدم: ' + error.message)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: changePasswordUserId, newPassword })
      })

      if (response.ok) {
        setMessage('تم تغيير كلمة المرور بنجاح')
        setChangePasswordUserId(null)
        setNewPassword('')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setMessage('❌ ' + (errorData.message || 'خطأ غير معروف'))
      }
    } catch (error) {
      setMessage('خطأ في الاتصال: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <DashboardHeader onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex space-x-4 space-x-reverse mb-6 border-b border-gray-300 overflow-x-auto">
          <button 
            onClick={() => setTab('news')} 
            className={`px-6 py-3 font-bold transition whitespace-nowrap ${
              tab === 'news' 
                ? 'border-b-4 border-blue-700 text-blue-700' 
                : 'text-gray-600 hover:text-blue-700'
            }`}
          >
            إدارة الأخبار
          </button>
          <button 
            onClick={() => setTab('achievements')} 
            className={`px-6 py-3 font-bold transition whitespace-nowrap ${
              tab === 'achievements' 
                ? 'border-b-4 border-blue-700 text-blue-700' 
                : 'text-gray-600 hover:text-blue-700'
            }`}
          >
            إدارة الإنجازات
          </button>
          <button 
            onClick={() => setTab('users')} 
            className={`px-6 py-3 font-bold transition whitespace-nowrap ${
              tab === 'users' 
                ? 'border-b-4 border-blue-700 text-blue-700' 
                : 'text-gray-600 hover:text-blue-700'
            }`}
          >
            إدارة المستخدمين
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.includes('نجاح') 
              ? 'bg-green-100 text-green-700 border border-green-400' 
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* News Tab */}
        {tab === 'news' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">إضافة خبر جديد</h2>
              <form onSubmit={handleAddNews} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">عنوان الخبر</label>
                  <input 
                    type="text" 
                    placeholder="أدخل عنوان الخبر"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">نص الخبر</label>
                  <textarea 
                    placeholder="أدخل نص الخبر"
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right h-32"
                    required
                  ></textarea>
                </div>

                {/* Multiple Media Upload */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">صور وفيديوهات</label>
                  <p className="text-sm text-gray-600 mb-2">يمكنك تحميل صور وفيديوهات متعددة</p>
                  <input 
                    type="file" 
                    multiple
                    accept="image/*,video/*"
                    onChange={handleNewsMediaChange}
                    className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700"
                  />
                </div>

                {/* Media Previews */}
                {newsMediaPreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-3 font-bold">المعاينات ({newsMediaPreviews.length}):</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {newsMediaPreviews.map((item, idx) => (
                        <div key={idx} className="relative">
                          {item.type === 'video' ? (
                            <video 
                              src={item.preview}
                              className="w-full h-32 object-cover rounded border-2 border-blue-300"
                              controls
                            />
                          ) : (
                            <img 
                              src={item.preview}
                              alt={`معاينة ${idx}`}
                              className="w-full h-32 object-cover rounded border-2 border-blue-300"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeNewsMedia(idx)}
                            className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-sm"
                          >
                            ✕
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-700 text-white px-8 py-3 rounded font-bold hover:bg-blue-800 disabled:bg-gray-400 transition"
                >
                  {loading ? 'جاري الإضافة...' : 'حفظ الخبر'}
                </button>
              </form>
            </div>

            {/* News List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-700">الأخبار المنشورة</h3>
              <div className="space-y-3">
                {newsList.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 p-4 rounded border">
                    <div className="flex-1">
                      <h4 className="font-bold text-right mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 text-right line-clamp-2 mb-3">{item.content}</p>
                      
                      {/* Display Media */}
                      {item.media && item.media.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                          {item.media.map((media) => (
                            <div key={media.id}>
                              {media.file_type === 'video' ? (
                                <video 
                                  src={media.file_path}
                                  className="w-full h-24 object-cover rounded border border-gray-300"
                                  controls
                                />
                              ) : (
                                <img 
                                  src={media.file_path}
                                  alt="media"
                                  className="w-full h-24 object-cover rounded border border-gray-300"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteNews(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {tab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">إضافة إنجاز جديد</h2>
              <form onSubmit={handleAddAchievement} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">عنوان الإنجاز</label>
                  <input 
                    type="text" 
                    placeholder="أدخل عنوان الإنجاز"
                    value={achievementTitle}
                    onChange={(e) => setAchievementTitle(e.target.value)}
                    className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">تفاصيل الإنجاز</label>
                  <textarea 
                    placeholder="أدخل تفاصيل الإنجاز"
                    value={achievementContent}
                    onChange={(e) => setAchievementContent(e.target.value)}
                    className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right h-32"
                    required
                  ></textarea>
                </div>

                {/* Multiple Media Upload */}
                <div>
                  <label className="block text-gray-700 font-bold mb-2">صور وفيديوهات</label>
                  <p className="text-sm text-gray-600 mb-2">يمكنك تحميل صور وفيديوهات متعددة</p>
                  <input 
                    type="file" 
                    multiple
                    accept="image/*,video/*"
                    onChange={handleAchievementMediaChange}
                    className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700"
                  />
                </div>

                {/* Media Previews */}
                {achievementMediaPreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-3 font-bold">المعاينات ({achievementMediaPreviews.length}):</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {achievementMediaPreviews.map((item, idx) => (
                        <div key={idx} className="relative">
                          {item.type === 'video' ? (
                            <video 
                              src={item.preview}
                              className="w-full h-32 object-cover rounded border-2 border-blue-300"
                              controls
                            />
                          ) : (
                            <img 
                              src={item.preview}
                              alt={`معاينة ${idx}`}
                              className="w-full h-32 object-cover rounded border-2 border-blue-300"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeAchievementMedia(idx)}
                            className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-sm"
                          >
                            ✕
                          </button>
                          <p className="text-xs text-gray-600 mt-1 truncate">{item.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-blue-700 text-white px-8 py-3 rounded font-bold hover:bg-blue-800 disabled:bg-gray-400 transition"
                >
                  {loading ? 'جاري الإضافة...' : 'حفظ الإنجاز'}
                </button>
              </form>
            </div>

            {/* Achievements List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-700">الإنجازات المنشورة</h3>
              <div className="space-y-3">
                {achievementsList.map((item) => (
                  <div key={item.id} className="flex justify-between items-start bg-gray-50 p-4 rounded border">
                    <div className="flex-1">
                      <h4 className="font-bold text-right mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600 text-right line-clamp-2 mb-3">{item.content}</p>
                      
                      {/* Display Media */}
                      {item.media && item.media.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                          {item.media.map((media) => (
                            <div key={media.id}>
                              {media.file_type === 'video' ? (
                                <video 
                                  src={media.file_path}
                                  className="w-full h-24 object-cover rounded border border-gray-300"
                                  controls
                                />
                              ) : (
                                <img 
                                  src={media.file_path}
                                  alt="media"
                                  className="w-full h-24 object-cover rounded border border-gray-300"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleDeleteAchievement(item.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ml-4"
                    >
                      حذف
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-6">
            {/* Add User Button */}
            {!showAddUserForm && (
              <button
                onClick={() => {
                  resetUserForm()
                  setShowAddUserForm(true)
                }}
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-bold"
              >
                ➕ إضافة مستخدم جديد
              </button>
            )}

            {/* Add/Edit User Form */}
            {showAddUserForm && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-blue-700">
                  {editingUserId ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
                </h2>
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">اسم المستخدم</label>
                      <input
                        type="text"
                        placeholder="أدخل اسم المستخدم"
                        value={userFormData.username}
                        onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                        disabled={editingUserId ? true : false}
                        className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right disabled:bg-gray-100"
                        required
                      />
                    </div>

                    {!editingUserId && (
                      <div>
                        <label className="block text-gray-700 font-bold mb-2">كلمة المرور</label>
                        <input
                          type="password"
                          placeholder="أدخل كلمة المرور"
                          value={userFormData.password}
                          onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                          className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">الاسم الكامل</label>
                      <input
                        type="text"
                        placeholder="أدخل الاسم الكامل"
                        value={userFormData.full_name}
                        onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                        className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        placeholder="أدخل البريد الإلكتروني"
                        value={userFormData.email}
                        onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                        className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">الصلاحيات</label>
                      <select
                        value={userFormData.role}
                        onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                        className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
                      >
                        <option value="viewer">مشاهد فقط (Viewer)</option>
                        <option value="editor">محرر (Editor)</option>
                        <option value="admin">مسؤول (Admin)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex space-x-4 space-x-reverse">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-bold disabled:bg-gray-400"
                    >
                      {loading ? 'جاري المعالجة...' : (editingUserId ? 'تحديث' : 'إضافة')}
                    </button>
                    <button
                      type="button"
                      onClick={resetUserForm}
                      className="bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500 font-bold"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">المستخدمين ({usersList.length})</h2>
              {usersList.length === 0 ? (
                <p className="text-gray-600 text-center">لا توجد مستخدمين</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="p-3 text-right">اسم المستخدم</th>
                        <th className="p-3 text-right">الاسم الكامل</th>
                        <th className="p-3 text-right">البريد الإلكتروني</th>
                        <th className="p-3 text-right">الصلاحيات</th>
                        <th className="p-3 text-right">الحالة</th>
                        <th className="p-3 text-right">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((user) => (
                        <tr key={user.id} className="border-b border-gray-300 hover:bg-gray-50">
                          <td className="p-3">{user.username}</td>
                          <td className="p-3">{user.full_name}</td>
                          <td className="p-3">{user.email || '-'}</td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded text-white text-sm font-bold ${
                              user.role === 'admin' ? 'bg-red-600' :
                              user.role === 'editor' ? 'bg-yellow-600' :
                              'bg-blue-600'
                            }`}>
                              {user.role === 'admin' ? 'مسؤول' : user.role === 'editor' ? 'محرر' : 'مشاهد'}
                            </span>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={`px-3 py-1 rounded text-white text-sm font-bold ${
                                user.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                              }`}
                            >
                              {user.is_active ? '✓ فعال' : '✗ معطل'}
                            </button>
                          </td>
                          <td className="p-3 space-x-2 space-x-reverse flex">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => setChangePasswordUserId(user.id)}
                              className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
                            >
                              تغيير كلمة المرور
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Change Password Modal */}
            {changePasswordUserId && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full" dir="rtl">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">تغيير كلمة المرور</h3>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-bold mb-2">كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        placeholder="أدخل كلمة المرور الجديدة"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-2 border-gray-300 p-3 w-full rounded focus:outline-none focus:border-blue-700 text-right"
                        required
                      />
                    </div>
                    <div className="flex space-x-4 space-x-reverse">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-bold disabled:bg-gray-400 flex-1"
                      >
                        {loading ? 'جاري المعالجة...' : 'تغيير'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setChangePasswordUserId(null)
                          setNewPassword('')
                        }}
                        className="bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500 font-bold flex-1"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}