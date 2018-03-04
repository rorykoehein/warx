#!/bin/bash
set -e

echo "BUILD SERVER"

yarn
yarn build-shared
yarn build-server
cp ./package.json ./dist/
cp ./yarn.lock ./dist/

echo "BUILD CLIENT"

cd client
yarn
yarn build
rm -rf ./build/static/*/*.map
cd ..

echo "COPY CLIENT TO SERVER DIST"

rsync -a -v ./client/build/ ./dist/public/
