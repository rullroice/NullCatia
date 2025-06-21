const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true, // Espera conexiones disponibles
    connectionLimit: 10,      // Numero máximo de conexiones en el pool
    queueLimit: 0             // No hay límite en la cola de espera
});

// Prueba de conexión al pool
pool.getConnection()
    .then(connection => {
        console.log('Conexión a base de datos correcta!');
        connection.release(); // Libera la conexión de vuelta al pool
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err.message);
    });

module.exports = pool;