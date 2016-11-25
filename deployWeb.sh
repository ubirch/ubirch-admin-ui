#!/usr/bin/env bash

echo =========  install packages for webApp =================

echo npm install
npm install

echo bower install
bower install

STAGE="dev"
if [ "$1" != "" ]
  then
    STAGE=$1
fi

echo build web for $STAGE
./buildWeb.sh $STAGE

echo copy dist content to server api.ubirch.com on port 922
scp -P 922 -r ./dist/* dermicha@api.ubirch.com:/var/www/admin.ubirch.com

echo =========  finished deployment! ==================
