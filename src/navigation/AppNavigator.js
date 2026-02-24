import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerListScreen from '../screens/customers/CustomerListScreen';
import AddCustomerScreen from '../screens/customers/AddCustomerScreen';
import CustomerDashboardScreen from '../screens/customers/CustomerDashboardScreen';
import MilkEntryScreen from '../screens/milk/MilkEntryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Customers"
                    component={CustomerListScreen}
                />
                <Stack.Screen
                    name="AddCustomer"
                    component={AddCustomerScreen}
                />
                <Stack.Screen
                    name="CustomerDashboard"
                    component={CustomerDashboardScreen}
                    options={{ title: 'Dashboard' }}
                />
                <Stack.Screen
                    name="MilkEntry"
                    component={MilkEntryScreen}
                    options={{ title: 'Add Milk Entry' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}