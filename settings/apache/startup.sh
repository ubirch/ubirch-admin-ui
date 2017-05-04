#!/bin/sh

env

if [ -d /var/www/html/scripts ]; then

  echo "Replacing variables UBIRCH_OIDC_CONTEXT in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@UBIRCH_OIDC_CONTEXT@@%${UBIRCH_OIDC_CONTEXT}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables UBIRCH_API_HOST in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@UBIRCH_API_HOST@@%${UBIRCH_API_HOST}%" /var/www/html/scripts/scripts.*.js

  echo "Replacing variables UBIRCH_AUTH_SERVICE_API_HOST in /var/www/html/scripts/scripts.*.js"
  sed -i.bak "s%@@UBIRCH_AUTH_SERVICE_API_HOST@@%${UBIRCH_AUTH_SERVICE_API_HOST}%" /var/www/html/scripts/scripts.*.js

fi

/usr/sbin/apache2ctl -D FOREGROUND
