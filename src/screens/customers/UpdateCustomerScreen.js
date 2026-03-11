import React, { useContext, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { updateCustomer } from '../../database/customerService';
import { ThemeContext } from '../../theme/ThemeContext';

export default function UpdateCustomerScreen({ navigation, route }) {
    const { theme } = useContext(ThemeContext);
    const customer = route.params?.customer;

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setPhone(customer.phone);
            setAddress(customer.address);
        }
    }, [customer]);

    const handleUpdate = async () => {
        if (!name) return;

        await updateCustomer(customer.id, name, phone, address);
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>

                <TextInput
                    placeholder="Customer Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    style={[
                        styles.input,
                        { color: theme.textColor, borderColor: theme.borderlineColor }
                    ]}
                />

                <TextInput
                    placeholder="Phone"
                    placeholderTextColor="#999"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="numeric"
                    style={[
                        styles.input,
                        { color: theme.textColor, borderColor: theme.borderlineColor }
                    ]}
                />

                <TextInput
                    placeholder="Address"
                    placeholderTextColor="#999"
                    value={address}
                    onChangeText={setAddress}
                    style={[
                        styles.input,
                        { color: theme.textColor, borderColor: theme.borderlineColor }
                    ]}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                    <Text style={styles.saveButtonText}>Update Customer</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    card: {
        padding: 15,
        borderRadius: 12,
        elevation: 2,
    },

    input: {
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 12,
        height: 45,
        borderRadius: 8,
    },

    saveButton: {
        backgroundColor: '#2E86DE',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },

    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});