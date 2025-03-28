//import mysql from 'mysql2/promise';

const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

async function inicializarConexion() {
    if (!connection) {
        connection = await mysql.createConnection(process.env.MYSQL_URI);
    }
    return connection;
}

async function inicializarBaseDatos() {
    try {
        const conn = await inicializarConexion();
        const query = `
        CREATE TABLE IF NOT EXISTS players (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL,
            points INT NOT NULL,
            seconds INT NOT NULL
        );`;
        await conn.query(query);
        console.log('Tabla creada con éxito');
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { inicializarBaseDatos, inicializarConexion };