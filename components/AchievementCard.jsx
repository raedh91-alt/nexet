export default function AchievementCard({ achievement }) {
  // الحصول على أول وسيط (صورة أو فيديو)
  const firstMedia = achievement.media && achievement.media.length > 0 ? achievement.media[0] : null
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border-r-4 border-blue-600">
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
              alt={achievement.title} 
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          )}
        </div>
      ) : achievement.image_path && (
        <div className="w-full h-48 overflow-hidden bg-gray-200">
          <img 
            src={achievement.image_path} 
            alt={achievement.title} 
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start mb-3">
          <span className="text-3xl text-blue-600 ml-3">⭐</span>
          <h3 className="text-lg font-bold text-right flex-1">{achievement.title}</h3>
        </div>
        <p className="text-gray-700 text-sm text-right line-clamp-3 mb-4">
          {achievement.content}
        </p>
        <div className="text-xs text-gray-500 text-left">
          {new Date(achievement.created_at).toLocaleDateString('ar-IQ')}
        </div>
      </div>
    </div>
  )
}