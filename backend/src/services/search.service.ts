import { getDb } from '../db/mongo';
import { getRedis } from '../db/redis';
import { SearchResult, ProductWithScore } from '../types';
import { logger, logError } from '../utils/logger';

const COLLECTION_NAME = 'products';
const CACHE_TTL = 300; // 5 minutos

export async function searchProducts(
  query: string,
  page: number = 0,
  limit: number = 20
): Promise<SearchResult> {
  const startTime = Date.now();

  try {
    // Validaciones
    if (!query || query.trim().length === 0) {
      throw new Error('Query parameter "q" is required');
    }

    if (limit > 100) {
      limit = 100;
    }

    if (page < 0) {
      page = 0;
    }

    // Intentar obtener desde cache (Redis)
    const cacheKey = `search:${query}:${page}:${limit}`;
    const redis = await getRedis();
    
    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          logger('Cache hit para búsqueda:', query);
          const result = JSON.parse(cached);
          result.latency_ms = Date.now() - startTime;
          return result;
        }
      } catch (error) {
        logError('Error accediendo a cache Redis', error);
      }
    }

    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);

    // Búsqueda con texto y score
    const skip = page * limit;

    const results = await collection
      .find(
        { $text: { $search: query } },
        { projection: { score: { $meta: 'textScore' } } }
      )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Contar total de resultados
    const total = await collection.countDocuments({ $text: { $search: query } });

    const hasNext = skip + limit < total;

    const searchResult: SearchResult = {
      q: query,
      page,
      limit,
      total,
      hasNext,
      results: results as any as ProductWithScore[],
      latency_ms: Date.now() - startTime
    };

    // Guardar en cache
    if (redis) {
      try {
        await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(searchResult));
      } catch (error) {
        logError('Error guardando en cache Redis', error);
      }
    }

    logger(`Búsqueda completada: "${query}" - ${results.length} resultados (${searchResult.latency_ms}ms)`);

    return searchResult;
  } catch (error) {
    logError('Error en searchProducts', error);
    throw error;
  }
}
