rm -rf dist
npm run build
rm -rf dist/build.zip 
cp -r node_modules dist
cp -r src/assets dist/assets
mv dist/src/* dist/
rm -rf dist/src 
cd dist && zip -r function.zip .