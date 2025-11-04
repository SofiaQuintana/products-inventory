import { Router, Request, Response } from 'express';
import { loadProductsFromCSV } from '../services/load.service';
import { logError } from '../utils/logger';
import path from 'path';

const router = Router();

/**
 * @swagger
 * /index/load:
 *   post:
 *     summary: Carga productos desde un archivo CSV
 *     tags: [Index]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               path:
 *                 type: string
 *                 description: Ruta al archivo CSV (opcional, usa CSV_PATH del .env si se omite)
 *     responses:
 *       200:
 *         description: Carga completada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 inserted:
 *                   type: number
 *                 updated:
 *                   type: number
 *                 errors:
 *                   type: number
 *                 totalProcessed:
 *                   type: number
 *                 durationMs:
 *                   type: number
 *                 docsPerSecond:
 *                   type: number
 *       500:
 *         description: Error en la carga
 */
router.post('/load', async (req: Request, res: Response) => {
  try {
    // Aumentar timeout para archivos grandes (30 minutos)
    req.setTimeout(30 * 60 * 1000);
    res.setTimeout(30 * 60 * 1000);
    
    const customPath = req.body?.path;
    const csvPath = customPath || process.env.CSV_PATH || './data/products.csv';
    
    // Resolver ruta absoluta
    const absolutePath = path.isAbsolute(csvPath) 
      ? csvPath 
      : path.resolve(process.cwd(), csvPath);

    const result = await loadProductsFromCSV(absolutePath);
    
    res.json(result);
  } catch (error: any) {
    logError('Error en POST /index/load', error);
    res.status(500).json({
      ok: false,
      error: error.message || 'Error cargando productos'
    });
  }
});

export default router;
