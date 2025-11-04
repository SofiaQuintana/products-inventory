#!/bin/bash

echo "Iniciando servicios de MongoDB y Redis con Docker..."

# Verificar si Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "-> Error: Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Iniciar servicios
echo "Levantando contenedores..."
docker-compose up -d

# Esperar a que MongoDB esté listo
echo "Esperando a que MongoDB esté listo..."
until docker exec products_mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    printf '.'
    sleep 2
done
echo ""
echo "-> MongoDB está listo"

# Esperar a que Redis esté listo
echo "Esperando a que Redis esté listo..."
until docker exec products_redis redis-cli ping > /dev/null 2>&1; do
    printf '.'
    sleep 1
done
echo ""
echo "-> Redis está listo"

echo ""
echo "-> Todos los servicios están corriendo:"
echo "   - MongoDB: mongodb://localhost:27017/products_db"
echo "   - Redis: redis://localhost:6379"
echo ""
echo "Para ver los logs: docker-compose logs -f"
echo "Para detener: docker-stop.sh"
echo "Para detener y eliminar datos: docker-clean.sh"
