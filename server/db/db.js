import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const DB = mysql.createPool({
    host: process.env.host_db,
    user: process.env.user,
    port: process.env.port_db,
    database: process.env.database,
    password: process.env.password,
    uri:process.env.uri,
    waitForConnections: true,
    connectionLimit: 1
});
export default DB;
