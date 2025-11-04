# Products Search API - Backend

Sistema de indexación y búsqueda de productos con MongoDB, Redis y Express.

## 🚀 Características

- ✅ **Carga masiva de productos** desde CSV con streaming y `bulkWrite`
- ✅ **Búsqueda con precedencia** (title > category > brand > sku > product_type)
- ✅ **Paginación** eficiente
- ✅ **Sugerencias** por prefijo
- ✅ **Cache con Redis** (opcional)
- ✅ **Documentación Swagger** interactiva
- ✅ **Índices optimizados** en MongoDB

## 📋 Requisitos

- Node.js 20+
- Docker y Docker Compose (para MongoDB y Redis)

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
cd backend
npm install
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

Editar `.env` (los valores por defecto ya funcionan con Docker):
```env
MONGODB_URI=mongodb://localhost:27017/products_db
PORT=3000
CSV_PATH=./data/products.csv

# Opcional - Redis para cache
REDIS_URL=redis://localhost:6379
ENABLE_REDIS=false  # Cambia a true para habilitar cache
```

3. **Iniciar MongoDB y Redis con Docker:**
```bash
# Opción 1: Usar el script helper
npm run docker:start

# Opción 2: Usar docker-compose directamente
docker-compose up -d

# Verificar que los contenedores están corriendo
docker-compose ps
```

Los servicios estarán disponibles en:
- **MongoDB:** `mongodb://localhost:27017/products_db`
- **Redis:** `redis://localhost:6379`

## 🔧 Configuración Inicial

### 1. Crear índices en MongoDB

**IMPORTANTE:** Ejecutar este script DESPUÉS de iniciar Docker:

```bash
npm run create-indexes
```

Este script crea:
- Índice único en `sku` (evita duplicados)
- Índice de texto con pesos para relevancia
- Índice en `title` para sugerencias

### 2. Cargar datos de prueba

```bash
npm run seed
```

Este script carga el archivo CSV especificado en `CSV_PATH` (.env).

### 🚀 Setup Completo (Todo en uno)

Para configurar todo automáticamente:

```bash
npm run setup
```

Este comando:
1. Inicia Docker (MongoDB + Redis)
2. Espera a que los servicios estén listos
3. Crea los índices en MongoDB
4. Carga los datos del CSV

## 🚀 Ejecución

### Modo desarrollo (con hot-reload)
```bash
npm run dev
```

### Modo producción
```bash
npm run build
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Documentación API (Swagger)

Una vez iniciado el servidor, accede a:

**http://localhost:3000/api-docs**

Desde Swagger puedes probar todos los endpoints interactivamente.

## 🔌 Endpoints

### 1. Health Check
```http
GET /
```

### 2. Cargar productos desde CSV
```http
POST /index/load
Content-Type: application/json

{
  "path": "./data/products.csv"  // Opcional, usa CSV_PATH si se omite
}
```

**Respuesta:**
```json
{
  "ok": true,
  "inserted": 1500,
  "updated": 50,
  "errors": 0,
  "totalProcessed": 1550,
  "durationMs": 2345,
  "docsPerSecond": 661
}
```

### 3. Buscar productos
```http
GET /search?q=nike&page=0&limit=20
```

**Parámetros:**
- `q` (required): término de búsqueda
- `page` (optional): número de página, base 0 (default: 0)
- `limit` (optional): resultados por página, max 100 (default: 20)

**Respuesta:**
```json
{
  "q": "nike",
  "page": 0,
  "limit": 20,
  "total": 156,
  "hasNext": true,
  "results": [
    {
      "_id": "...",
      "title": "Nike Air Max 90",
      "category": "Shoes",
      "brand": "Nike",
      "product_type": "Sneakers",
      "sku": "NIKE-AM90-001",
      "score": 12.5
    }
  ],
  "latency_ms": 42
}
```

### 4. Obtener sugerencias
```http
GET /suggest?q=nike
```

**Respuesta:**
```json
{
  "q": "nike",
  "suggestions": [
    "Nike Air Max 90",
    "Nike Air Force 1",
    "Nike Revolution 5"
  ],
  "latency_ms": 15
}
```

## 🎯 Precedencia de Búsqueda

La búsqueda utiliza un índice de texto con pesos en MongoDB:

1. **title** (peso: 10) - Mayor prioridad
2. **category** (peso: 7)
3. **brand** (peso: 5)
4. **sku** (peso: 3)
5. **product_type** (peso: 1) - Menor prioridad

Esto significa que coincidencias en el título aparecerán primero en los resultados.

## 📊 Índices de MongoDB

```javascript
// 1. Índice único por SKU (evita duplicados)
{ sku: 1 } // unique

// 2. Índice de texto con pesos (relevancia)
{
  title: "text",
  category: "text",
  brand: "text",
  sku: "text",
  product_type: "text"
}
// weights: { title: 10, category: 7, brand: 5, sku: 3, product_type: 1 }

// 3. Índice para sugerencias
{ title: 1 }
```

## 🔍 Verificar Índices

Conectarse a MongoDB:
```bash
mongosh mongodb://localhost:27017/products_db
```

Ver índices:
```javascript
db.products.getIndexes()
```

Ver estadísticas de la colección:
```javascript
db.products.stats()
db.products.countDocuments()
```

## 🧪 Pruebas desde la Terminal

### 1. Cargar productos
```bash
curl -X POST http://localhost:3000/index/load \
  -H "Content-Type: application/json" \
  -d '{"path": "./data/products.csv"}'
```

### 2. Buscar productos
```bash
curl "http://localhost:3000/search?q=nike&page=0&limit=5"
```

### 3. Obtener sugerencias
```bash
curl "http://localhost:3000/suggest?q=nike"
```

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── app.ts                 # Aplicación principal
│   ├── swagger.yaml           # Documentación OpenAPI
│   ├── db/
│   │   ├── mongo.ts          # Conexión MongoDB
│   │   └── redis.ts          # Conexión Redis
│   ├── routes/
│   │   ├── index.route.ts    # Ruta /index/load
│   │   ├── search.route.ts   # Ruta /search
│   │   └── suggest.route.ts  # Ruta /suggest
│   ├── services/
│   │   ├── load.service.ts   # Lógica de carga CSV
│   │   ├── search.service.ts # Lógica de búsqueda
│   │   └── suggest.service.ts# Lógica de sugerencias
│   ├── utils/
│   │   ├── csv.ts            # Parser CSV con streaming
│   │   └── logger.ts         # Utilidad de logging
│   ├── types/
│   │   └── index.ts          # Definiciones TypeScript
│   └── scripts/
│       ├── createIndexes.ts  # Script para crear índices
│       └── seed.ts           # Script para cargar datos
├── data/
│   └── products.csv          # Datos de ejemplo
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## 🐛 Troubleshooting

### Docker no está corriendo
```bash
# Verificar que Docker Desktop está abierto
docker info

# Si no está corriendo, abre Docker Desktop y espera a que inicie
```

### Ver logs de los contenedores
```bash
# Todos los servicios
npm run docker:logs

# O individualmente
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Reiniciar servicios de Docker
```bash
# Detener servicios
npm run docker:stop

# Iniciar servicios
npm run docker:start
```

### Limpiar todo y empezar de cero
```bash
# Esto eliminará todos los datos
npm run docker:clean

# Luego volver a iniciar
npm run setup
```

### MongoDB no conecta
```bash
# Verificar que el contenedor está corriendo
docker-compose ps

# Ver logs de MongoDB
docker-compose logs mongodb

# Conectarse manualmente a MongoDB
docker exec -it products_mongodb mongosh products_db
```

### Redis no conecta (si está habilitado)
```bash
# Verificar que el contenedor está corriendo
docker-compose ps

# Probar conexión
docker exec -it products_redis redis-cli ping
# Debería responder: PONG
```

### Errores al crear índices
```bash
# Conectarse a MongoDB
docker exec -it products_mongodb mongosh products_db

# Eliminar índices existentes
> db.products.dropIndexes()
> exit

# Luego ejecutar
npm run create-indexes
```

## 📈 Métricas y Rendimiento

### Carga de datos
- Dataset de ejemplo: ~50 productos
- Velocidad esperada: 500-1000 docs/seg (depende del hardware)
- Memoria: Procesamiento por lotes de 5000 productos

### Búsqueda
- Latencia típica: < 50ms (sin cache)
- Con Redis: < 10ms (cache hit)
- Escalable hasta millones de productos con índices apropiados

## 🐳 Comandos Docker Útiles

```bash
# Iniciar servicios
npm run docker:start
# o
docker-compose up -d

# Detener servicios (mantiene datos)
npm run docker:stop
# o
docker-compose down

# Ver logs en tiempo real
npm run docker:logs
# o
docker-compose logs -f

# Ver estado de contenedores
docker-compose ps

# Acceder a MongoDB shell
docker exec -it products_mongodb mongosh products_db

# Acceder a Redis CLI
docker exec -it products_redis redis-cli

# Limpiar todo (elimina datos)
npm run docker:clean
# o
docker-compose down -v

# Ver volúmenes de datos
docker volume ls | grep backend
```

## 🔒 Producción

Para producción, considera:

1. **Variables de entorno:** No usar valores por defecto
2. **CORS:** Configurar dominios permitidos específicos
3. **Rate Limiting:** Implementar límite de requests
4. **Logs:** Usar winston o bunyan para logs estructurados
5. **Monitoring:** Integrar con Prometheus/Grafana
6. **Redis:** Habilitar cache para mejor rendimiento

## 📝 Licencia

ISC

## 👤 Autor

Proyecto 2 - Sistema de Indexación de Productos
