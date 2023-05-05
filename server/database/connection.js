import mysql from "mysql2/promise";
import dotenv from "dotenv/config";

let connection;

try {
    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });
} catch (error) {
    console.error("Error connecting to the database:", error);
}

export default connection;