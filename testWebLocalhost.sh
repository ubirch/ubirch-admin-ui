#!/usr/bin/env sh
env
echo build ubirch admin UI
echo "create dist version for stage >>$1<<"
echo install missing npm components
npm install
echo install missing bower components
bower install --allow-root
grunt serve:dist --staging=dev
