import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { requestStoragePermission } from './src/utils/permissions';
import { MenuProvider } from 'react-native-popup-menu';

import AppNavigator from './src/navigation/AppNavigator';
import { createTables } from './src/database/db';
import { ThemeProvider } from './src/theme/ThemeContext';

// -------------------- INITIALIZATION FUNCTION --------------------
const initializeApp = async () => {
  try {
    await createTables();
  } catch (err) {
    console.error('App initialization error:', err);
  }
};

// -------------------- MAIN APP COMPONENT --------------------
export default function App() {
  useEffect(() => {
    initializeApp();
    requestStoragePermission();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <MenuProvider>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar barStyle="dark-content" />
              <AppNavigator />
            </SafeAreaView>
          </MenuProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}