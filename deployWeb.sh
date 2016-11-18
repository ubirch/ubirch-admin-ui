#!/usr/bin/env bash

echo =========  install packages for webApp =================

echo npm install
npm install

echo bower install
bower install

echo build web for prod
./buildWeb.sh prod

echo copy dist content to server api.ubirch.com on port 922
scp -P 922 -r ./dist/* dermicha@api.ubirch.com:/var/www/admin.ubirch.com

echo =========  finished deployment! ==================
