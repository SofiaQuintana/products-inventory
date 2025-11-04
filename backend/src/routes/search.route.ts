import { Router, Request, Response } from 'express';
import { searchProducts } from '../services/search.service';
import { logError } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Busca productos con precedencia y paginación
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de página (base 0)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Cantidad de resultados por página
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 q:
 *                   type: string
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 total:
 *                   type: number
 *                 hasNext:
 *                   type: boolean
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                 latency_ms:
 *                   type: number
 *       400:
 *         description: Parámetro de búsqueda faltante
 *       500:
 *         description: Error en la búsqueda
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 0;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query) {
      return res.status(400).json({
        error: 'Query parameter "q" is required'
      });
    }

    const result = await searchProducts(query, page, limit);
    
    res.json(result);
  } catch (error: any) {
    logError('Error en GET /search', error);
    res.status(500).json({
      error: error.message || 'Error en la búsqueda'
    });
  }
});

export default router;
