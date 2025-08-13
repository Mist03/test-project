import { Pool, PoolConfig } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

interface CustomPoolConfig extends PoolConfig {
  options?: string;
}
const poolConfig: CustomPoolConfig = {
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'moroz111',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  client_encoding: 'UTF8',
  options: `-c search_path=test`,
};
const pool = new Pool(poolConfig);
export { pool };
