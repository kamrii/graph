#!/bin/sh
docker-compose up -d;
nohup node node/server.js > /dev/null 2>&1 &
