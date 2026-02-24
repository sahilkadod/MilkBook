import React, { useEffect, useContext } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { createTables } from './src/database/db';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext';

export default function App() {
  useEffect(() => {
    createTables();
  }, []);

  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

function AppWithTheme() {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme.textColor === '#ffffff' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primaryColor}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.primaryColor }]}>
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({ container: { flex: 1 } });