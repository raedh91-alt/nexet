import mysql from 'mysql2/promise'

let poolConfig

if (process.env.MYSQL_URL) {
  // Railway format: mysql://user:password@host:port/database
  const url = new URL(process.env.MYSQL_URL)
  poolConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading /
    port: url.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
} else {
  // Local development configuration
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'south_electricity_maysan',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
}

const pool = mysql.createPool(poolConfig)

export default pool