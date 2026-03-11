import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCustomers, deleteCustomerFromDB } from '../../database/customerService';
import { ThemeContext } from '../../theme/ThemeContext';
import { Menu, Provider } from 'react-native-paper';

export default function CustomerListScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [customers, setCustomers] = useState([]);

    // Menu state
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const loadCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    };

    const deleteCustomer = (customerId, customerName) => {
        Alert.alert(
            'Delete Customer',
            `Are you sure you want to delete "${customerName}"?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete User',
                    style: 'destructive', // This makes the text red
                    onPress: () => {
                        deleteCustomerFromDB(customerId);
                        setCustomers(prev => prev.filter(c => c.id !== customerId));
                    },
                },
            ]
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCustomers();
        }, [])
    );

    return (
        <Provider>
            <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                {/* Add Customer Button */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddCustomer')}
                >
                    <Text style={styles.addButtonText}>+ Add Customer</Text>
                </TouchableOpacity>

                <FlatList
                    data={customers}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('CustomerDashboard', { customer: item })}
                            onLongPress={(e) => {
                                const { locationX, locationY } = e.nativeEvent;
                                setMenuPosition({
                                    x: locationX + 40,
                                    y: locationY + 20,
                                });
                                setSelectedCustomer(item);
                                setMenuVisible(true);
                            }}
                        >
                            <View
                                style={[
                                    styles.card,
                                    { borderColor: theme.borderlineColor, backgroundColor: theme.cardBackground },
                                ]}
                            >
                                <View style={styles.row}>
                                    <Text style={[styles.name, { color: theme.userNameColor }]}>{item.name}</Text>
                                    <Text style={styles.arrow}>›</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />

                {/* Dynamic popup menu */}
                {selectedCustomer && (
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={{ x: menuPosition.x, y: menuPosition.y }}
                    >
                        <Menu.Item
                            onPress={() => {
                                navigation.navigate('UpdateCustomer', { customer: selectedCustomer });
                                setMenuVisible(false);
                            }}
                            title="Edit Customer Details"
                        />
                        <Menu.Item
                            onPress={() => {
                                deleteCustomer(selectedCustomer.id, selectedCustomer.name);
                                setMenuVisible(false);
                            }}
                            title="Delete Customer"
                            titleStyle={{ color: 'red' }}
                        />
                    </Menu>
                )}
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    addButton: {
        backgroundColor: '#2E86DE',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
    },

    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    card: {
        borderWidth: 1,
        padding: 15,
        marginVertical: 8,
        borderRadius: 12,
        elevation: 2,
    },

    name: {
        fontWeight: '600',
        fontSize: 16,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    arrow: {
        fontSize: 20,
        color: '#999',
    },
});