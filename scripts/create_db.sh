#!/bin/bash

docker-compose exec postgres psql -U postgres -c "CREATE DATABASE database;"
docker-compose exec postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE database TO postgres;"
