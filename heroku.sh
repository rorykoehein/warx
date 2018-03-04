#!/bin/bash
set -e

echo "Deploy to Heroku..."

read -p 'Enter app name: ' app

cp ./Procfile ./dist/
cd ./dist/
rm -rf ./git
git init
heroku git:remote -a ${app}
git add .
git commit -m "auto deploy" --allow-empty
git push -f heroku master