#!/bin/bash

echo "Eliminando servicios y datos de Docker..."

docker-compose down -v

echo "** Servicios y volúmenes eliminados **"
