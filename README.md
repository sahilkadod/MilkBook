# Milk Record App

## Overview

Milk Record App is a simple and free application designed for people working in the milk industry. It helps users record and manage daily milk collection data easily.

The application allows users to store milk records twice a day (morning and evening), including milk quantity in liters and fat percentage. The system also calculates daily records and provides monthly summaries.

## Features

* Record morning and evening milk data
* Store milk quantity in liters
* Record milk fat percentage
* Automatic daily and monthly calculations
* Simple and easy-to-use interface

## Purpose

This application was created to help community members in the milk industry maintain accurate milk records and reduce manual calculations.

## Usage

This application is provided **free for community use**. Users can use the app to manage their milk records easily.

## Ownership

This project is maintained and controlled by the project owner. The source code, updates, and future development are managed by the owner.

Unauthorized redistribution, modification, or commercial use is not allowed without permission from the owner.

## Contact

For suggestions or support, please contact the project owner.

---

# React Native App (npm)

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

---

## Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

---

## Step 1: Start Metro

Metro is the JavaScript build tool for React Native. Start it from the root of your project:

```sh
npm start
```

---

## Step 2: Build and Run Your App

With Metro running, open a new terminal window/pane and run:

Android (Debug)
```sh
npm run android
```
Android (Release)
```sh
npm run android-release
```
iOS (macOS only)

Before running on iOS, install CocoaPods dependencies:
```sh
bundle install
bundle exec pod install
```
Then run:
```sh
npm run ios
```

---

## Step 3: Build APK (Android)

### Debug APK:
```sh
npm run build-debug
```
### Release APK:
```sh
npm run build-release
```
### Release APK path:
```sh
android/app/build/outputs/apk/release/app-release.apk
```

---

## Step 4: Install APK on Device

Debug:
```sh
npm run install-debug
```
Release:
```sh
npm run install-release
```

---

## Step 5: Clean Project

If your app shows old code or changes are not reflected:
```sh
npm run clean
```

---

## Step 6: Modify Your App

Open App.tsx (or your entry component) in your text editor and make changes. Fast Refresh will automatically update your app.

To force a full reload:

Android: Press <kbd>R</kbd> twice or use Dev Menu (<kbd>Ctrl</kbd> + <kbd>M</kbd> or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd>)

iOS: Press <kbd>R</kbd> in the simulator

---

## Step 7: Install Navigation Dependencies
```sh
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

---

## Step 8: Lint & Test
```sh
npm run lint
npm run test
```

---

## Step 9: Troubleshooting

Old app still running: Run npm run clean and uninstall old app from device/emulator.

Metro not starting: Run npm start --reset-cache.

Build fails: Check android/build.gradle for correct buildToolsVersion, compileSdkVersion, and targetSdkVersion.

Dependencies missing: Run npm install (and bundle exec pod install for iOS).

---

## Step 10: Scripts (package.json)

Add these scripts to your package.json for easy npm commands:

```json
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

---

## Learn More

- [React Native Website](https://reactnative.dev) – Learn more about React Native
- [Getting Started](https://reactnative.dev/docs/environment-setup) – Overview of React Native and environment setup
- [Learn the Basics](https://reactnative.dev/docs/getting-started) – Guided tour of React Native basics
- [Blog](https://reactnative.dev/blog) – Latest official React Native posts
- [`@facebook/react-native`](https://github.com/facebook/react-native) – Open Source GitHub repository
