import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'recetas_mexicanas',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para inicializar las tablas
export const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Tabla principal de recetas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS recetas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        region ENUM('NORTE', 'CENTRO', 'SUR', 'GOLFO', 'PENINSULA_YUCATAN') NOT NULL,
        categoria ENUM('POSTRES', 'SOPAS', 'GUISOS', 'BEBIDAS', 'ENTRADAS', 'PLATOS_FUERTES', 'DESAYUNOS', 'ANTOJITOS') NOT NULL,
        tiempo_preparacion INT,
        porciones INT,
        es_favorita BOOLEAN DEFAULT FALSE,
        es_tradicional BOOLEAN DEFAULT FALSE,
        notas_personales TEXT,
        foto_url VARCHAR(500),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_region (region),
        INDEX idx_categoria (categoria),
        INDEX idx_favorita (es_favorita),
        INDEX idx_tradicional (es_tradicional),
        FULLTEXT INDEX idx_nombre (nombre)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de ingredientes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ingredientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        receta_id INT NOT NULL,
        ingrediente VARCHAR(500) NOT NULL,
        orden INT DEFAULT 0,
        FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE,
        INDEX idx_receta (receta_id),
        FULLTEXT INDEX idx_ingrediente (ingrediente)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de pasos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS pasos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        receta_id INT NOT NULL,
        paso TEXT NOT NULL,
        orden INT NOT NULL,
        FOREIGN KEY (receta_id) REFERENCES recetas(id) ON DELETE CASCADE,
        INDEX idx_receta (receta_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    connection.release();
    console.log('✅ Tablas de base de datos inicializadas correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
    throw error;
  }
};

export default pool;
