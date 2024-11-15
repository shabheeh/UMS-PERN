
import { Pool } from "pg";

export type User = {
    id: string;
    name: string | null; 
    email: string; 
    password: string;
    image: string | null;
    isBlocked: boolean;
  };


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT), 
});

pool.connect()
    .then(() => console.log('Database connected successfully!'))
    .catch((error) => console.error('Error connecting to the database', error));

export default pool;
