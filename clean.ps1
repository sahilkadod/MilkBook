Write-Host "Cleaning React Native project..."

Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android\app\build -ErrorAction SilentlyContinue

npm cache clean --force
npm install

cd android
./gradlew clean
cd ..

Write-Host "Starting Metro..."
npx react-native start --reset-cache