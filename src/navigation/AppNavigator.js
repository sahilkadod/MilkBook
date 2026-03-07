import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomerListScreen from '../screens/customers/CustomerListScreen';
import AddCustomerScreen from '../screens/customers/AddCustomerScreen';
import CustomerDashboardScreen from '../screens/customers/CustomerDashboardScreen';
import MilkEntryScreen from '../screens/milk/MilkEntryScreen';
import SetRateScreen from '../screens/SetRateScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Simple hamburger icon
function HamburgerIcon() {
  return (
    <View style={{ padding: 10 }}>
      <View style={{ width: 25, height: 3, backgroundColor: '#2E86DE', marginBottom: 4, borderRadius: 2 }} />
      <View style={{ width: 25, height: 3, backgroundColor: '#2E86DE', marginBottom: 4, borderRadius: 2 }} />
      <View style={{ width: 25, height: 3, backgroundColor: '#2E86DE', borderRadius: 2 }} />
    </View>
  );
}

// Stack navigator
function HomeStack({ navigation: drawerNavigation }) {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#000',
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => {
          // Show hamburger only on first screen
          if (route.name === 'Customers') {
            return (
              <TouchableOpacity
                onPress={() => drawerNavigation.toggleDrawer()}
                style={{ marginLeft: 15 }}
              >
                <HamburgerIcon />
              </TouchableOpacity>
            );
          }
          return null;
        },
      })}
    >
      <Stack.Screen
        name="Customers"
        component={CustomerListScreen}
        options={{ title: 'Customers' }}
      />
      <Stack.Screen
        name="AddCustomer"
        component={AddCustomerScreen}
        options={{ title: 'Add Customer' }}
      />
      <Stack.Screen
        name="CustomerDashboard"
        component={CustomerDashboardScreen}
        options={{ title: 'Customer Dashboard' }}
      />
      <Stack.Screen
        name="MilkEntry"
        component={MilkEntryScreen}
        options={{ title: 'Milk Entry' }}
      />
      <Stack.Screen
        name="SetRate"
        component={SetRateScreen}
        options={{ title: 'Set Rate' }}
      />
    </Stack.Navigator>
  );
}

// Drawer navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: '#2E86DE',
        }}
      >
        {/* 🔥 RENAMED FROM "Customers" TO "Home" */}
        <Drawer.Screen name="Home">
          {props => <HomeStack {...props} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}