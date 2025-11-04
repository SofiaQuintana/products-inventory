import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/products_db';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectMongo(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const dbName = MONGODB_URI.split('/').pop()?.split('?')[0] || 'products_db';
    db = client.db(dbName);
    
    console.log(`- Conectado a MongoDB: ${dbName}`);
    return db;
  } catch (error) {
    console.error('-> Error conectando a MongoDB:', error);
    throw error;
  }
}

export async function getDb(): Promise<Db> {
  if (!db) {
    return await connectMongo();
  }
  return db;
}

export async function closeMongo(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('- Desconectado de MongoDB');
  }
}

export { Db };
