export default function NewsCard({ news }) {
  // الحصول على أول وسيط (صورة أو فيديو)
  const firstMedia = news.media && news.media.length > 0 ? news.media[0] : null
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      {/* عرض الصورة أو الفيديو */}
      {firstMedia ? (
        <div className="w-full h-48 overflow-hidden bg-gray-200">
          {firstMedia.file_type === 'video' ? (
            <video 
              src={firstMedia.file_path} 
              className="w-full h-full object-cover"
              controls
              controlsList="nodownload"
            />
          ) : (
            <img 
              src={firstMedia.file_path} 
              alt={news.title} 
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          )}
        </div>
      ) : news.image_path && (
        <div className="w-full h-48 overflow-hidden bg-gray-200">
          <img 
            src={news.image_path} 
            alt={news.title} 
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
      )}
      
      <div className="bg-blue-600 text-white p-4">
        <h3 className="text-lg font-bold text-right">{news.title}</h3>
      </div>
      <div className="p-4">
        <p className="text-gray-700 text-sm text-right line-clamp-4 mb-4">
          {news.content}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(news.created_at).toLocaleDateString('ar-IQ')}
          </span>
          <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 text-sm">
            اقرأ المزيد →
          </a>
        </div>
      </div>
    </div>
  )
}