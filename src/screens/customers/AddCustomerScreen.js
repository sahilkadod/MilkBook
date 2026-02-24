import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
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
            <TextInput
                placeholder="Customer Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            <Button title="Save Customer" onPress={handleSave} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: {
        borderWidth: 1,
        marginBottom: 15,
        padding: 10,
        borderRadius: 5,
    },
});