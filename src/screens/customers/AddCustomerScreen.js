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
import { addCustomer, updateCustomer } from '../../database/customerService';
import { ThemeContext } from '../../theme/ThemeContext';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

export default function AddCustomerScreen({ navigation, route }) {
  const { theme } = useContext(ThemeContext);
  const customer = route.params?.customer; // existing customer for edit

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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Customer name is required.');
      return;
    }

    try {
      if (customer) {
        await updateCustomer(customer.id, name, phone, address);
        Alert.alert('Success', 'Customer updated successfully.');
      } else {
        await addCustomer(name, phone, address);
        Alert.alert('Success', 'Customer added successfully.');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Save Customer Error:', error);
      Alert.alert('Error', 'Failed to save customer.');
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
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground || theme.backgroundColor },
          ]}
        >
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

          {/* Save / Update Button with Icon */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <View style={styles.buttonContent}>
              <MaterialIcon
                name={customer ? 'edit' : 'save'}
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.saveButtonText}>
                {customer ? 'Update Customer' : 'Save Customer'}
              </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});