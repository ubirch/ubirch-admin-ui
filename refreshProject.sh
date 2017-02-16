#!/bin/sh

echo fetch updates from git
git pull
echo install missing npm components
npm install
echo install missing bower components
bower install

