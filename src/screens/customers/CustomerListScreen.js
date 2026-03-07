import React, { useContext, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getCustomers } from '../../database/customerService';
import { getMonthlySummaryByCustomer } from '../../database/milkService';
import { ThemeContext } from '../../theme/ThemeContext';

export default function CustomerListScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [customers, setCustomers] = useState([]);

    const loadCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    };

    useFocusEffect(
        React.useCallback(() => {
            loadCustomers();
        }, [])
    );

    return (
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
                        style={[
                            styles.card,
                            {
                                borderColor: theme.borderlineColor,
                                backgroundColor: theme.borderlineColor,
                            }
                        ]}
                        activeOpacity={0.7}
                        onPress={() =>
                            navigation.navigate('CustomerDashboard', { customer: item })
                        }
                    >
                        <View style={[styles.row]}>
                            <View>
                                <Text
                                    style={[styles.name, { color: theme.textColorblack }]}
                                >
                                    {item.name}
                                </Text>
                            </View>

                            <Text style={styles.arrow}>›</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
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

    balance: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'green',
    },
});