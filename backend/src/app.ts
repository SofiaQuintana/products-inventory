import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

import { connectMongo, closeMongo } from './db/mongo';
import { connectRedis, closeRedis } from './db/redis';
import indexRoute from './routes/index.route';
import searchRoute from './routes/search.route';
import suggestRoute from './routes/suggest.route';
import { logSuccess, logError } from './utils/logger';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Products Search API - Running',
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      load: 'POST /index/load',
      search: 'GET /search?q=<query>&page=<page>&limit=<limit>',
      suggest: 'GET /suggest?q=<query>'
    }
  });
});

// Rutas
app.use('/index', indexRoute);
app.use('/search', searchRoute);
app.use('/suggest', suggestRoute);

// Manejador de errores 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Conectar a MongoDB
    await connectMongo();
    
    // Conectar a Redis (opcional)
    await connectRedis();

    app.listen(PORT, () => {
      logSuccess(`Servidor iniciado en http://localhost:${PORT}`);
      logSuccess(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logError('Error iniciando servidor', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\nCerrando servidor...');
  await closeMongo();
  await closeRedis();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nCerrando servidor...');
  await closeMongo();
  await closeRedis();
  process.exit(0);
});

// Iniciar
startServer();
