import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();
const DB = new pg.Pool({
    connectionString:process.env.uri,
    waitForConnections: true,
    connectionLimit: 10
});
export default DB;
