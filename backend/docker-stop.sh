#!/bin/bash

echo "Deteniendo servicios de Docker..."

docker-compose down

echo "**Servicios detenidos**"
echo ""
echo "Nota: Los datos se mantienen en volúmenes de Docker."
echo "Para eliminar también los datos, se debe ejecutar: docker-clean.sh"
