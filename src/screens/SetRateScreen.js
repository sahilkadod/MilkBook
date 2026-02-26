import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../theme/ThemeContext';
import { getLatestRate, setLatestRate } from '../database/rateService';

export default function SetRateScreen() {
  const { theme } = useContext(ThemeContext);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [rate, setRate] = useState('');

  // Load rate when month/year changes
  useEffect(() => {
    const loadRate = async () => {
      try {
        const existingRate = await getLatestRate(selectedMonth, selectedYear);
        setRate(existingRate?.toString() || '');
      } catch (e) {
        console.log('Failed to load rate:', e);
        Alert.alert('Error', 'Failed to load rate');
      }
    };
    loadRate();
  }, [selectedMonth, selectedYear]);

  // Save/Update rate
  const handleSave = async () => {
    if (!rate) {
      Alert.alert('Error', 'Please enter a rate');
      return;
    }

    try {
      const success = await setLatestRate(selectedMonth, selectedYear, parseFloat(rate));
      if (success) {
        Alert.alert('Success', 'Rate saved successfully');
      } else {
        Alert.alert('Error', 'Failed to save rate');
      }
    } catch (e) {
      console.log('Save rate error:', e);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>Set Monthly Rate</Text>

      <Text style={[styles.label, { color: theme.textColor }]}>Select Month</Text>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={(value) => setSelectedMonth(value)}
        style={[styles.picker, { color: theme.textColor }]}
      >
        {[...Array(12)].map((_, i) => (
          <Picker.Item
            key={i}
            label={new Date(0, i).toLocaleString('default', { month: 'long' })}
            value={i + 1}
          />
        ))}
      </Picker>

      <Text style={[styles.label, { color: theme.textColor }]}>Select Year</Text>
      <Picker
        selectedValue={selectedYear}
        onValueChange={(value) => setSelectedYear(value)}
        style={[styles.picker, { color: theme.textColor }]}
      >
        {[2024, 2025, 2026, 2027].map((year) => (
          <Picker.Item key={year} label={year.toString()} value={year} />
        ))}
      </Picker>

      <Text style={[styles.label, { color: theme.textColor }]}>Enter Rate</Text>
      <TextInput
        style={[styles.input, { borderColor: theme.textColor, color: theme.textColor }]}
        placeholder="Enter Rate"
        placeholderTextColor={theme.textColor + '88'}
        keyboardType="numeric"
        value={rate}
        onChangeText={setRate}
      />

      <Button title="Save / Update Rate" onPress={handleSave} color={theme.primaryColor} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginTop: 10 },
  picker: { marginVertical: 10 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 15,
    borderRadius: 5,
  },
});