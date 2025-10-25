-- Create Database
CREATE DATABASE IF NOT EXISTS south_electricity_maysan;
USE south_electricity_maysan;

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- News Media Table (صور وفيديوهات الأخبار)
CREATE TABLE IF NOT EXISTS news_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  news_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type ENUM('image', 'video') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE,
  INDEX idx_news_id (news_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Achievements Media Table (صور وفيديوهات الإنجازات)
CREATE TABLE IF NOT EXISTS achievements_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  achievement_id INT NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type ENUM('image', 'video') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  INDEX idx_achievement_id (achievement_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users Table (جدول المستخدمين)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data
INSERT INTO news (title, content) VALUES 
  ('إنطلاق مشروع تطوير البنية التحتية', 'تم انطلاق المشروع الجديد لتطوير البنية التحتية للشبكة الكهربائية بفرع ميسان بهدف تحسين كفاءة الخدمة.'),
  ('جهود في مكافحة الفقد والهدر', 'استمرار الجهود المكثفة من قبل فريق الصيانة في مكافحة الفقد والهدر في الشبكة الكهربائية.'),
  ('تدريب موظفين جدد', 'تم تدريب عدد من الموظفين الجدد على أحدث المعايير والمواصفات الفنية للعمل في الشركة.');

INSERT INTO achievements (title, content) VALUES 
  ('تحسين أداء الخدمة بنسبة 15%', 'تحقيق تحسن ملحوظ في جودة الخدمة المقدمة للمستهلكين بنسبة 15% خلال الربع الأول.'),
  ('إصلاح 120 عطل شهري', 'تمكن فريق الصيانة من إصلاح 120 عطل شهري بكفاءة عالية وسرعة استجابة متميزة.'),
  ('توسيع شبكة التوزيع', 'تم توسيع شبكة التوزيع الكهربائية لتغطية مناطق جديدة في الفرع.');