import { loadProductsFromCSV } from '../services/load.service';
import { connectMongo, closeMongo } from '../db/mongo';
import { logSuccess, logError, logger } from '../utils/logger';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    logger('Conectando a MongoDB...');
    await connectMongo();

    const csvPath = process.env.CSV_PATH || './data/products.csv';
    const absolutePath = path.isAbsolute(csvPath) 
      ? csvPath 
      : path.resolve(process.cwd(), csvPath);

    logger(`Cargando productos desde: ${absolutePath}`);
    
    const result = await loadProductsFromCSV(absolutePath);

    logSuccess('\n=== Resumen de Carga ===');
    logSuccess(`Total procesado: ${result.totalProcessed}`);
    logSuccess(`Insertados: ${result.inserted}`);
    logSuccess(`Actualizados: ${result.updated}`);
    logSuccess(`Errores: ${result.errors}`);
    logSuccess(`Duración: ${result.durationMs}ms`);
    logSuccess(`Velocidad: ${result.docsPerSecond} docs/seg`);
    
    await closeMongo();
  } catch (error) {
    logError('Error en seed', error);
    await closeMongo();
    process.exit(1);
  }
}

seed();
