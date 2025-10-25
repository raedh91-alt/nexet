export default function DashboardHeader({ onLogout }) {
  return (
    <header className="bg-blue-700 text-white p-6 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">لوحة تحكم فرع ميسان</h1>
        <button 
          onClick={onLogout}
          className="bg-white text-blue-700 px-6 py-2 rounded font-bold hover:bg-gray-200 transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </header>
  )
}