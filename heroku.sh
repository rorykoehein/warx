#!/bin/bash

echo "Deploy to heroku"

./build.sh $1
cd ../dist/$1
cp ./Procfile ../dist/$1/
git add .
git commit -m 'auto deploy $1'
git push heroku master
