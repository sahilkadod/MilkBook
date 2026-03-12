import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import IonIcon from 'react-native-vector-icons/Ionicons';

import CustomerListScreen from '../screens/customers/CustomerListScreen';
import AddCustomerScreen from '../screens/customers/AddCustomerScreen';
import UpdateCustomerScreen from '../screens/customers/UpdateCustomerScreen';
import CustomerDashboardScreen from '../screens/customers/CustomerDashboardScreen';
import MilkEntryScreen from '../screens/milk/MilkEntryScreen';
import SetRateScreen from '../screens/SetRateScreen';

import { ThemeContext } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Hamburger icon
function HamburgerIcon({ color }) {
  return <IonIcon name="menu" size={26} color={color || '#2E86DE'} />;
}

// Stack Navigator
function HomeStack({ navigation: drawerNavigation }) {
  const { theme } = useContext(ThemeContext);

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: theme.backgroundColor },
        headerTintColor: theme.textColor,
        headerTitleStyle: { fontWeight: 'bold' },
        headerLeft: () => {
          if (route.name === 'Customers') {
            return (
              <TouchableOpacity
                onPress={() => drawerNavigation.toggleDrawer()}
                style={{ marginLeft: 15 }}
              >
                <HamburgerIcon color={theme.textColor} />
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
        name="UpdateCustomer"
        component={UpdateCustomerScreen}
        options={{ title: 'Update Customer' }}
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

// Drawer Navigator
export default function AppNavigator() {
  const { theme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: '#2E86DE',
          drawerInactiveTintColor: theme.textColor,
          drawerLabelStyle: { fontSize: 16, color: theme.textColor },
          drawerStyle: { backgroundColor: theme.backgroundColor },
        }}
      >
        <Drawer.Screen
          name="Home"
          options={{
            drawerIcon: ({ color, size }) => (
              <IonIcon name="home-outline" size={size} color={color} />
            ),
          }}
        >
          {props => <HomeStack {...props} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="Customer"
          options={{
            drawerIcon: ({ color, size }) => (
              <IonIcon name="people-outline" size={22} color={color} />
            ),
          }}
        >
          {props => <HomeStack {...props} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}