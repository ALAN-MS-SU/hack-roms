import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();
const DB = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10
});
export default DB;
