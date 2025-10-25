import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.jpg"
            alt="شعار الشركة"
            width={80}
            height={80}
            className="rounded-full border-2 border-blue-700"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center md:text-right">
            <h3 className="text-lg font-bold mb-3">عن الشركة</h3>
            <p className="text-gray-400 text-sm">
              شركة توزيع كهرباء الجنوب فرع ميسان، تقدم خدمات توزيع الكهرباء بجودة عالية
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold mb-3">التواصل</h3>
            <p className="text-gray-400 text-sm">البريد الإلكتروني: missan.sed@moelc.gov.iq</p>
            <p className="text-gray-400 text-sm">الهاتف: 159</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold mb-3">الموقع</h3>
            <p className="text-gray-400 text-sm">جمهورية العراق، ميسان، العمارة، الشبانة</p>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} الشركة العامة لتوزيع كهرباء الجنوب – فرع ميسان</p>
          <p className="text-gray-500 text-sm mt-2">جميع الحقوق محفوظة | وزارة الكهرباء العراقية</p>
        </div>
      </div>
    </footer>
  )
}