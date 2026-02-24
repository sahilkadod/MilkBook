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
            <Button
                title="Add Customer"
                onPress={() => navigation.navigate('AddCustomer')}
            />

            <FlatList
                data={customers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.card,{ borderColor : theme.borderlineColor }]}
                        onPress={() =>
                            navigation.navigate('CustomerDashboard', { customer: item })
                        }
                    >
                        <View style={[styles.row,{ color : theme.textColor }]}>
                            <View>
                                <Text style={[styles.name,{ color: theme.textColor }]}>{item.name}</Text>
                                {/* <Text>{item.phone}</Text> */}
                            </View>

                            {/* <Text style={styles.balance}>
                                ₹ {item.monthlyAmount || 0}
                            </Text> */}
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    card: {
        borderWidth: 1,
        padding: 15,
        marginVertical: 8,
        borderRadius: 5,
    },
    name: { fontWeight: 'bold', fontSize: 16 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    balance: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'green',
    },
});