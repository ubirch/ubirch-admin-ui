#!/bin/sh

STAGE="$1"

if [ "" != "$STAGE" ]
  then
    echo "create dist version for stage >>$STAGE<<"
    echo install missing npm components
    npm install
    echo install missing bower components
    bower install

    grunt build --staging=$STAGE
else
  echo "$0 STAGE"
fi
