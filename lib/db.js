import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema.js'

const sql = neon(process.env.DARABASE_URL,{schema});
export const db = drizzle(sql);
