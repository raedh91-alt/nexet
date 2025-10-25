import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition">
            <Image
              src="/logo.jpg"
              alt="شعار الشركة"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h1 className="text-xl font-bold">
              شركة توزيع كهرباء الجنوب – فرع ميسان
            </h1>
          </div>
        </Link>
        <ul className="hidden md:flex space-x-6 space-x-reverse items-center">
          <li>
            <a href="/" className="hover:text-gray-200 transition font-semibold">الرئيسية</a>
          </li>
          <li>
            <a href="#news" className="hover:text-gray-200 transition font-semibold">الأخبار</a>
          </li>
          <li>
            <a href="#achievements" className="hover:text-gray-200 transition font-semibold">الإنجازات</a>
          </li>
          <li>
            <Link href="/admin/login">
              <button className="bg-white text-blue-700 px-4 py-2 rounded font-bold hover:bg-gray-200 transition">
                لوحة التحكم
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}