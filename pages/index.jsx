import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NewsCard from '../components/NewsCard'
import AchievementCard from '../components/AchievementCard'

export default function Home() {
  const [news, setNews] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
    fetchAchievements()
    
    // تحديث البيانات تلقائياً كل 5 ثوانٍ
    const interval = setInterval(() => {
      fetchNews()
      fetchAchievements()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error('خطأ في جلب الأخبار:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      const data = await response.json()
      setAchievements(data)
    } catch (error) {
      console.error('خطأ في جلب الإنجازات:', error)
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative w-full h-96 bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">شركة توزيع كهرباء الجنوب</h1>
          <p className="text-2xl">فرع ميسان</p>
        </div>
      </div>

      <main className="p-6 max-w-6xl mx-auto">
        {/* News Section */}
        <section id="news" className="my-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-4 border-blue-700 pb-2 inline-block">
            آخر الأخبار
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-gray-500">جاري التحميل...</p>
            ) : news.length > 0 ? (
              news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))
            ) : (
              <p className="text-gray-500">لا توجد أخبار حالياً</p>
            )}
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="my-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 border-b-4 border-blue-700 pb-2 inline-block">
            الإنجازات اليومية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.length > 0 ? (
              achievements.map((item) => (
                <AchievementCard key={item.id} achievement={item} />
              ))
            ) : (
              <p className="text-gray-500">لا توجد إنجازات حالياً</p>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}