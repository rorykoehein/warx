#!/bin/bash

echo "Deploy to heroku"

cp ./Procfile ./dist/
cd ./dist/
git add .
git commit -m "auto deploy"
git push heroku master
