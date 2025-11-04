import { connectMongo, closeMongo } from '../db/mongo';
import { logSuccess, logError, logger } from '../utils/logger';

const COLLECTION_NAME = 'products';

async function createIndexes() {
  try {
    logger('Conectando a MongoDB...');
    const db = await connectMongo();
    const collection = db.collection(COLLECTION_NAME);

    // Verificar si la colección existe
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray();
    
    if (collections.length > 0) {
      logger('Eliminando índices existentes (excepto _id)...');
      const existingIndexes = await collection.indexes();
      for (const index of existingIndexes) {
        if (index.name && index.name !== '_id_') {
          await collection.dropIndex(index.name);
          logger(`  - Eliminado: ${index.name}`);
        }
      }
    } else {
      logger('Colección no existe aún, se creará con los índices...');
    }

    // 1. Índice único por SKU
    logger('Creando índice único en "sku"...');
    await collection.createIndex(
      { sku: 1 },
      { unique: true, name: 'sku_unique' }
    );
    logSuccess('✓ Índice único creado: sku_unique');

    // 2. Índice de texto con pesos (precedencia)
    logger('Creando índice de texto con pesos...');
    await collection.createIndex(
      {
        title: 'text',
        category: 'text',
        brand: 'text',
        sku: 'text',
        product_type: 'text'
      },
      {
        name: 'text_search_weighted',
        weights: {
          title: 10,
          category: 7,
          brand: 5,
          sku: 3,
          product_type: 1
        },
        default_language: 'english'
      }
    );
    logSuccess('-> Indice de texto creado con pesos:');
    logSuccess('  - title: 10 (mayor precedencia)');
    logSuccess('  - category: 7');
    logSuccess('  - brand: 5');
    logSuccess('  - sku: 3');
    logSuccess('  - product_type: 1 (menor precedencia)');

    // 3. Índice para sugerencias (prefijo en title)
    logger('Creando índice para sugerencias en "title"...');
    await collection.createIndex(
      { title: 1 },
      { name: 'title_prefix' }
    );
    logSuccess('-> Indice creado: title_prefix');

    // Mostrar todos los índices creados
    logger('\nIndices actuales en la colección:');
    const indexes = await collection.indexes();
    indexes.forEach((index, i) => {
      logger(`  ${i + 1}. ${index.name}:`, index.key);
    });

    logSuccess('\n¡Todos los índices creados exitosamente!');
    
    await closeMongo();
  } catch (error) {
    logError('Error creando índices', error);
    await closeMongo();
    process.exit(1);
  }
}

createIndexes();
