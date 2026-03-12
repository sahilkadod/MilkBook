import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { updateCustomer } from '../../database/customerService';
import { ThemeContext } from '../../theme/ThemeContext';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function UpdateCustomerScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const customer = route.params?.customer;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
    }
  }, [customer]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Customer name is required.');
      return;
    }

    try {
      await updateCustomer(customer.id, name, phone, address);
      Alert.alert('Success', 'Customer updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Update Customer Error:', error);
      Alert.alert('Error', 'Failed to update customer.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.backgroundColor },
        ]}
      >
        <View style={[styles.card, { backgroundColor: theme.cardBackground || theme.backgroundColor }]}>

          <TextInput
            placeholder="Customer Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]}
          />

          <TextInput
            placeholder="Phone"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]}
          />

          <TextInput
            placeholder="Address"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
            style={[
              styles.input,
              {
                color: theme.textColor,
                borderColor: theme.borderlineColor,
                textAlignVertical: 'top',
              },
            ]}
          />

          {/* Update Button with Icon */}
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
            <View style={styles.buttonContent}>
              <MaterialIcon name="edit" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.saveButtonText}>Update Customer</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'flex-start',
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

  buttonContent: {
    flexDirection: 'row', // icon + text aligned horizontally
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});