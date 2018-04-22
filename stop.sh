#!/bin/bash
docker-compose stop;
kill $(ps aux | grep "node node/server" | grep -v grep| awk '{print $2}');