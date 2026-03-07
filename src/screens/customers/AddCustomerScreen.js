import React, { useContext, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { addCustomer } from '../../database/customerService';
import { ThemeContext } from '../../theme/ThemeContext';

export default function AddCustomerScreen({ navigation }) {
    const { theme } = useContext(ThemeContext);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleSave = async () => {
        if (!name) return;

        await addCustomer(name, phone, address);
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>

            <View style={styles.card}>
                <TextInput
                    placeholder="Customer Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                    style={[
                        styles.input,
                        { color: theme.textColorblack, borderColor: theme.borderlineColor }
                    ]}
                />

                <TextInput
                    placeholder="Phone"
                    placeholderTextColor="#999"
                    value={phone}
                    onChangeText={setPhone}
                    style={[
                        styles.input,
                        { color: theme.textColorblack, borderColor: theme.borderlineColor }
                    ]}
                    keyboardType="numeric"
                />

                <TextInput
                    placeholder="Address"
                    placeholderTextColor="#999"
                    value={address}
                    onChangeText={setAddress}
                    style={[
                        styles.input,
                        { color: theme.textColorblack, borderColor: theme.borderlineColor }
                    ]}
                />

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Customer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-start',
    },

    card: {
        backgroundColor: '#f8f8f8',
        padding: 20,
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