import { getDb } from '../db/mongo';
import { parseCSV } from '../utils/csv';
import { LoadResult, Product } from '../types';
import { logger, logError, logSuccess } from '../utils/logger';

const COLLECTION_NAME = 'products';
const BATCH_SIZE = 10000; // Aumentado para mejor rendimiento con archivos grandes

export async function loadProductsFromCSV(filePath: string): Promise<LoadResult> {
  const startTime = Date.now();
  let inserted = 0;
  let updated = 0;
  let errors = 0;
  let batchCount = 0;

  try {
    const db = await getDb();
    const collection = db.collection<Product>(COLLECTION_NAME);

    logger(`Iniciando carga desde: ${filePath}`);

    const onBatch = async (batch: Product[]) => {
      try {
        batchCount++;
        const bulkOps = batch.map(product => {
          const { updatedAt, createdAt, ...productData } = product;
          return {
            updateOne: {
              filter: { sku: product.sku },
              update: {
                $setOnInsert: {
                  createdAt: new Date()
                },
                $set: {
                  ...productData,
                  updatedAt: new Date()
                }
              },
              upsert: true
            }
          };
        });

        const result = await collection.bulkWrite(bulkOps, { ordered: false });
        
        inserted += result.upsertedCount;
        updated += result.modifiedCount;

        const totalProcessed = inserted + updated;
        const elapsed = Date.now() - startTime;
        const rate = Math.round((totalProcessed / elapsed) * 1000);
        
        logger(`Batch ${batchCount}: +${result.upsertedCount} nuevos, +${result.modifiedCount} actualizados | Total: ${totalProcessed.toLocaleString()} (${rate} docs/seg)`);
      } catch (error) {
        logError('Error en bulkWrite', error);
        throw error;
      }
    };

    const { totalRows, errors: parseErrors } = await parseCSV(filePath, onBatch, BATCH_SIZE);
    errors = parseErrors;

    const durationMs = Date.now() - startTime;
    const docsPerSecond = Math.round((totalRows / durationMs) * 1000);

    logSuccess('Carga completada', {
      totalProcessed: totalRows,
      inserted,
      updated,
      errors,
      durationMs,
      docsPerSecond
    });

    return {
      ok: true,
      inserted,
      updated,
      errors,
      totalProcessed: totalRows,
      durationMs,
      docsPerSecond
    };
  } catch (error) {
    logError('Error en loadProductsFromCSV', error);
    throw error;
  }
}
