import 'react-native-gesture-handler';
import React, { useEffect, useContext } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { requestStoragePermission } from './src/utils/permissions';
import { MenuProvider } from 'react-native-popup-menu';

import AppNavigator from './src/navigation/AppNavigator';
import { createTables } from './src/database/db';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext';

// -------------------- INITIALIZATION FUNCTION --------------------
const initializeApp = async () => {
  try {
    await createTables();
  } catch (err) {
    console.error('App initialization error:', err);
  }
};

// -------------------- MAIN APP COMPONENT --------------------
function AppContent() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.backgroundColor }]}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.backgroundColor}
      />
      <AppNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  useEffect(() => {
    initializeApp();
    requestStoragePermission();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <SafeAreaProvider>
          <MenuProvider>
            <AppContent />
          </MenuProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});