import { getDb } from '../db/mongo';
import { getRedis } from '../db/redis';
import { SuggestResult } from '../types';
import { logger, logError } from '../utils/logger';

const COLLECTION_NAME = 'products';
const CACHE_TTL = 600; // 10 minutos
const SUGGEST_LIMIT = 10;

export async function suggestProducts(query: string): Promise<SuggestResult> {
  const startTime = Date.now();

  try {
    if (!query || query.trim().length === 0) {
      return {
        q: query,
        suggestions: [],
        latency_ms: Date.now() - startTime
      };
    }

    // Intentar obtener desde cache (Redis)
    const cacheKey = `suggest:${query}`;
    const redis = await getRedis();
    
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          logger('Cache hit para sugerencias:', query);
          const suggestions = JSON.parse(cached);
          return {
            q: query,
            suggestions,
            latency_ms: Date.now() - startTime
          };
        }
      } catch (error) {
        logError('Error accediendo a cache Redis', error);
      }
    }

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    // Búsqueda por prefijo en título
    const regex = new RegExp(`^${query}`, 'i');
    
    const results = await collection
      .find({ title: { $regex: regex } })
      .limit(SUGGEST_LIMIT)
      .project({ title: 1, _id: 0 })
      .toArray();

    const suggestions = results.map((r: any) => r.title as string);

    // Guardar en cache
    if (redis) {
      try {
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(suggestions));
      } catch (error) {
        logError('Error guardando en cache Redis', error);
      }
    }

    logger(`Sugerencias completadas: "${query}" - ${suggestions.length} resultados`);

    return {
      q: query,
      suggestions,
      latency_ms: Date.now() - startTime
    };
  } catch (error) {
    logError('Error en suggestProducts', error);
    throw error;
  }
}
