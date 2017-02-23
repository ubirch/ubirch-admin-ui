#!/bin/sh


if [ -d /var/www/html/scripts ]; then
  echo "Replacing variables UBIRCH_API_HOST in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%localhost:8080%${UBIRCH_API_HOST:-localhost:8080}%" /var/www/html/scripts/scripts.*.js
  if [ $? -ne 0 ]; then
    echo "Search string localhost:8080 not found in /var/www/html/scripts/scripts.*.js"
  fi
fi

/usr/sbin/apache2ctl -D FOREGROUND
