# 📖 دليل التثبيت والتشغيل

## خطوات التثبيت بالتفصيل

### الخطوة 1: تثبيت المتطلبات
تأكد من تثبيت:
- [Node.js 16+](https://nodejs.org/)
- [MySQL Server](https://www.mysql.com/downloads/)

### الخطوة 2: استنساخ المشروع
```bash
cd c:\Users\raeds\OneDrive\Desktop\nexet
```

### الخطوة 3: تثبيت المكتبات
```bash
npm install
```
قد تستغرق هذه العملية عدة دقائق.

### الخطوة 4: إعداد قاعدة البيانات

#### الخيار أ: استخدام سطر الأوامر MySQL
```bash
mysql -u root -p < database-schema.sql
```

#### الخيار ب: استخدام MySQL Workbench
1. افتح MySQL Workbench
2. اتصل بـ MySQL
3. افتح ملف الاستعلام: File → Open SQL Script → اختر `database-schema.sql`
4. اضغط: Execute (أو Ctrl+Shift+Enter)

### الخطوة 5: تكوين المتغيرات البيئية
1. افتح الملف `.env.local` (موجود في المشروع)
2. تأكد من تطابق البيانات مع إعدادات MySQL لديك:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=كلمة_مرور_mysql_الخاصة_بك
DB_NAME=south_electricity_maysan
```

### الخطوة 6: التشغيل
```bash
npm run dev
```

أنت سترى رسالة مشابهة لـ:
```
> dev
> next dev

  ▲ Next.js 14.0.0
  - ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### الخطوة 7: الوصول للموقع
افتح متصفحك على:
- **الصفحة الرئيسية**: http://localhost:3000
- **لوحة التحكم**: http://localhost:3000/admin/login

## بيانات الدخول الافتراضية
```
اسم المستخدم: admin
كلمة المرور: 12345
```

## التشغيل على الشبكة الداخلية (192.168.85.86)

لتشغيل الموقع على عنوان IP محلي:

### Windows (PowerShell):
```powershell
$env:NEXTAUTH_URL="http://192.168.85.86:3000"
npm run dev -- -H 192.168.85.86
```

### Linux/Mac:
```bash
export NEXTAUTH_URL="http://192.168.85.86:3000"
npm run dev -- -H 192.168.85.86
```

ثم الوصول عبر: `http://192.168.85.86:3000`

## الأوامر الأساسية

| الأمر | الوصف |
|------|--------|
| `npm run dev` | تشغيل بيئة التطوير |
| `npm run build` | بناء الموقع للإنتاج |
| `npm start` | تشغيل الموقع بعد البناء |
| `npm run lint` | فحص الأخطاء في الكود |

## استكشاف الأخطاء

### ❌ خطأ: "Error: connect ECONNREFUSED 127.0.0.1:3306"
**الحل**: MySQL غير مشغل
```bash
# Windows
net start MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### ❌ خطأ: "Unknown database 'south_electricity_maysan'"
**الحل**: لم يتم إنشاء قاعدة البيانات
```bash
mysql -u root -p < database-schema.sql
```

### ❌ خطأ: "Port 3000 is already in use"
**الحل**: الموقع مشغل بالفعل أو رقم المنفذ مستخدم
```bash
# تشغيل على منفذ مختلف
npm run dev -- -p 3001
```

### ❌ الصفحة تحتاج وقت طويل للتحميل
**الحل**: 
1. تأكد من تشغيل MySQL
2. افتح DevTools (F12) وتحقق من Network
3. أعد تحميل الصفحة (Ctrl+R)

## الخطوات التالية

### إضافة صورة المقر الرئيسي
1. ضع صورة JPG للمقر في: `public/images/myssan.jpg`
2. الحجم الموصى به: 1920x600 بكسل

### تخصيص البيانات
عدّل الألوان والمحتوى في:
- `tailwind.config.js` - الألوان والخطوط
- `components/Footer.jsx` - بيانات التواصل
- `database-schema.sql` - البيانات الأولية

### نشر الموقع
1. استضف على Vercel, Heroku, أو AWS
2. أضف متغيرات البيئة
3. ربط قاعدة البيانات البعيدة
4. فعّل HTTPS وشهادات SSL

## الدعم والمساعدة
إذا واجهت مشاكل:
1. تحقق من الأخطاء في Console (F12)
2. اقرأ رسائل الخطأ بعناية
3. ابحث في [Next.js Documentation](https://nextjs.org/docs)
4. اسأل في مجتمعات التطوير العربية

---

**مبروك! 🎉 تم تثبيت الموقع بنجاح**