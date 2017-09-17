#!/bin/sh

env

if [ -d /var/www/html/scripts ]; then

  echo "Replacing variables UBIRCH_OIDC_CONTEXT in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@UBIRCH_OIDC_CONTEXT@@%${UBIRCH_OIDC_CONTEXT}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables UBIRCH_API_HOST in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@UBIRCH_API_HOST@@%${UBIRCH_API_HOST}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables UBIRCH_AUTH_SERVICE_API_HOST in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@UBIRCH_AUTH_SERVICE_API_HOST@@%${UBIRCH_AUTH_SERVICE_API_HOST}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables MQTT_HOST in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@MQTT_HOST@@%${MQTT_HOST}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables MQTT_PORT in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@MQTT_PORT@@%${MQTT_PORT}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables ENVID in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@ENVID@@%${ENVID}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables ENVID in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@UBIRCH_KEY_SERVICE_API_HOST@@%${UBIRCH_KEY_SERVICE_API_HOST}%" /var/www/html/scripts/scripts.*.js
fi

/usr/sbin/apache2ctl -D FOREGROUND
