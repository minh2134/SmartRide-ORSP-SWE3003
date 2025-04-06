@echo off
echo === SmartRide Android Development Helper ===
echo.

echo 1. Killing ADB server...
adb kill-server
timeout /t 2 > nul

echo 2. Starting ADB server...
adb start-server
timeout /t 2 > nul

echo 3. Checking for connected devices...
adb devices
timeout /t 2 > nul

echo 4. Cleaning Gradle project...
cd android
call gradlew clean
cd ..
timeout /t 2 > nul

echo 5. Running Metro bundler in a new window...
start cmd /k "npm start"
timeout /t 5 > nul

echo 6. Building and installing the app...
call npm run android

echo === Done! ===
echo If the app failed to install, make sure your emulator is running or physical device is connected.
echo. 