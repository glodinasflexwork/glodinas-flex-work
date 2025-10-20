import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create postgres connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });

export { schema };

