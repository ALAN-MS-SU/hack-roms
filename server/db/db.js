import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();
const DB = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
export default DB;
