#!/bin/sh

export JAVA_HOME="/opt/homebrew/opt/openjdk@17"

cd frontend
npm run build

cd ../backend
rm -rf src/main/resources/static/*
cp -r ../frontend/build/* src/main/resources/static/
./mvnw clean install
