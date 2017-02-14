#!/bin/sh

STAGE="$1"

if [ "" != "$STAGE" ]
  then
    echo fetch updates from git
    git pull
    echo install missing npm components
    npm install
    echo install missing bower components
    bower install

    grunt build --staging=$STAGE
else
  echo "$0 STAGE"
fi
