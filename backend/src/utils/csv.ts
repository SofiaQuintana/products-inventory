import fs from 'fs';
import csvParser from 'csv-parser';
import { Product } from '../types';
import { logger, logError } from './logger';

export interface CSVRow {
  [key: string]: string;
}

export async function parseCSV(
  filePath: string,
  onBatch: (batch: Product[]) => Promise<void>,
  batchSize: number = 10000
): Promise<{ totalRows: number; errors: number }> {
  return new Promise((resolve, reject) => {
    let batch: Product[] = [];
    let totalRows = 0;
    let errors = 0;

    if (!fs.existsSync(filePath)) {
      reject(new Error(`Archivo CSV no encontrado: ${filePath}`));
      return;
    }

    const stream = fs.createReadStream(filePath)
      .pipe(csvParser());

    stream.on('data', async (row: CSVRow) => {
      try {
        // Pausar el stream mientras procesamos el batch
        stream.pause();

        const product: Product = {
          title: row.title || row.Title || '',
          category: row.category || row.Category || '',
          brand: row.brand || row.Brand || '',
          product_type: row.product_type || row['Product Type'] || row.type || '',
          sku: row.sku || row.SKU || row.Sku || '',
          price: row.price ? parseFloat(row.price) : undefined,
          description: row.description || row.Description || '',
          updatedAt: new Date()
        };

        // Validar campos obligatorios
        if (!product.sku) {
          errors++;
          stream.resume();
          return;
        }

        batch.push(product);
        totalRows++;

        // Procesar batch cuando alcance el tamaño
        if (batch.length >= batchSize) {
          const currentBatch = [...batch];
          batch = [];
          
          try {
            await onBatch(currentBatch);
          } catch (error) {
            logError('Error procesando batch', error);
            errors += currentBatch.length;
          }
        }

        stream.resume();
      } catch (error) {
        errors++;
        stream.resume();
      }
    });

    stream.on('end', async () => {
      // Procesar el último batch si queda alguno
      if (batch.length > 0) {
        try {
          await onBatch(batch);
        } catch (error) {
          logError('Error procesando último batch', error);
          errors += batch.length;
        }
      }

      resolve({ totalRows, errors });
    });

    stream.on('error', (error) => {
      logError('Error leyendo CSV', error);
      reject(error);
    });
  });
}
