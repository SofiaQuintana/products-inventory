import { Router, Request, Response } from 'express';
import { suggestProducts } from '../services/suggest.service';
import { logError } from '../utils/logger';

const router = Router();

/**
 * @swagger
 * /suggest:
 *   get:
 *     summary: Obtiene sugerencias de productos por prefijo
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Prefijo para sugerencias
 *     responses:
 *       200:
 *         description: Sugerencias encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 q:
 *                   type: string
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 latency_ms:
 *                   type: number
 *       400:
 *         description: Parámetro de búsqueda faltante
 *       500:
 *         description: Error obteniendo sugerencias
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({
        error: 'Query parameter "q" is required'
      });
    }

    const result = await suggestProducts(query);
    
    res.json(result);
  } catch (error: any) {
    logError('Error en GET /suggest', error);
    res.status(500).json({
      error: error.message || 'Error obteniendo sugerencias'
    });
  }
});

export default router;
