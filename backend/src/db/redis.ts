import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const ENABLE_REDIS = process.env.ENABLE_REDIS === 'true';

let redisClient: RedisClientType | null = null;

export async function connectRedis(): Promise<RedisClientType | null> {
  if (!ENABLE_REDIS) {
    console.log('- Redis deshabilitado (ENABLE_REDIS=false)');
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = createClient({ url: REDIS_URL });
    
    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    await redisClient.connect();
    console.log('- Conectado a Redis');
    return redisClient;
  } catch (error) {
    console.error('-> Error conectando a Redis (continuando sin cache):', error);
    return null;
  }
}

export async function getRedis(): Promise<RedisClientType | null> {
  if (!ENABLE_REDIS) {
    return null;
  }
  
  if (!redisClient) {
    return await connectRedis();
  }
  
  return redisClient;
}

export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('- Desconectado de Redis');
  }
}
