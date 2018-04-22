#!/bin/bash
sleep 5 &&
chmod 775 runtime/  &&
chown www-data:www-data runtime/ &&

chmod 775 web/assets/ &&
chown www-data:www-data web/assets/ &&

php-fpm -RF
