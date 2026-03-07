React Native App (npm)

This is a new React Native
 project, bootstrapped using @react-native-community/cli
.

React Native lets you build mobile apps using only JavaScript and React. Your code runs natively on both Android and iOS.

Getting Started

Note: Make sure you have completed the Set Up Your Environment
 guide before proceeding.

# Step 1: Start Metro

Metro is the JavaScript build tool for React Native. Start it from the root of your project:

npm start
# Step 2: Build and Run Your App

With Metro running, open a new terminal window/pane and run:

Android (Debug)
npm run android
Android (Release)
npm run android-release
iOS (macOS only)

Before running on iOS, install CocoaPods dependencies:

bundle install
bundle exec pod install
npm run ios

# Step 3: Build APK (Android)

Debug APK:
```sh
npm run build-debug
```

Release APK:
```sh
npm run build-release
```
Release APK path:
android/app/build/outputs/apk/release/app-release.apk

# Step 4: Install APK on Device

Debug:
```sh
npm run install-debug
```
Release:
```sh
npm run install-release
```

# Step 5: Clean Project

If your app shows old code or changes are not reflected:
```sh
npm run clean
```
# Step 6: Modify Your App

Open App.tsx (or your entry component) in your text editor and make changes. Fast Refresh will automatically update your app.

## To force a full reload:

### Android: Press R twice or use Dev Menu (Ctrl + M or Cmd ⌘ + M)

### iOS: Press R in the simulator

# Step 7: Install Navigation Dependencies
```sh
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

# Step 8: Lint & Test
```sh
npm run lint
npm run test
```
# Step 9: Troubleshooting

Old app still running: Run npm run clean and uninstall old app from device/emulator.

Metro not starting: Run npm start --reset-cache.

Build fails: Check android/build.gradle for correct buildToolsVersion, compileSdkVersion, and targetSdkVersion.

Dependencies missing: Run npm install (and bundle exec pod install for iOS).

# Step 10: Scripts (package.json)

Add these scripts to your package.json for easy npm commands:
```sh
"scripts": {
    "android": "react-native run-android",
    "android-release": "cd android && ./gradlew assembleRelease && cd ..",
    "build-debug": "cd android && ./gradlew assembleDebug && cd ..",
    "build-release": "cd android && ./gradlew assembleRelease && cd ..",
    "install-debug": "cd android && ./gradlew installDebug && cd ..",
    "install-release": "cd android && ./gradlew installRelease && cd ..",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest",
    "clean": "cd android && ./gradlew clean && cd .."
}
```