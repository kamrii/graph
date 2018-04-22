#!/bin/sh
docker-compose up -d;
php yii migrate --interactive=0;
nohup node node/server.js > /dev/null 2>&1 &

