@echo off

:: Check if Node.js is installed
node -v >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed, installing now...
  :: Download Node.js (This downloads version 16.4.2, you can change this to the version you want)
  curl -O https://nodejs.org/dist/v18.16.1/node-v18.16.1-x64.msi
  :: Install Node.js silently
  msiexec /quiet /i node-v16.4.2-x64.msi
)

:: Check if Ionic is installed
ionic -v >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo Ionic is not installed, installing now...
  :: Install Ionic
  npm install -g @ionic/cli
)

:: Navigate to project directory
cd ionic/storage

:: Serve the app
ionic serve

@echo on
