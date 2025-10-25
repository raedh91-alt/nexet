import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100mb',
    },
  },
}

// Check if file is video or image
const isVideo = (filename) => {
  const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv']
  const ext = filename.split('.').pop().toLowerCase()
  return videoExts.includes(ext)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'الطريقة غير مدعومة' })
  }

  try {
    const { file, filename } = req.body

    if (!file || !filename) {
      return res.status(400).json({ message: 'الملف والاسم مطلوبان' })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file.split(',')[1] || file, 'base64')
    
    // Generate unique filename
    const timestamp = Date.now()
    const ext = filename.split('.').pop()
    const uniqueFilename = `${timestamp}-${Math.random().toString(36).substr(2, 9)}.${ext}`
    const filePath = path.join(uploadsDir, uniqueFilename)

    // Save file
    fs.writeFileSync(filePath, buffer)

    const fileUrl = `/uploads/${uniqueFilename}`
    const fileType = isVideo(filename) ? 'video' : 'image'
    
    res.status(200).json({ 
      filePath: fileUrl,
      fileType: fileType,
      filename: uniqueFilename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    res.status(500).json({ message: 'خطأ في تحميل الملف' })
  }
}