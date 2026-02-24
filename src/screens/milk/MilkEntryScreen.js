import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet
} from 'react-native';
import { addMilkEntry, updateMilkEntry } from '../../database/milkService';
import { ThemeContext } from '../../theme/ThemeContext';

export default function MilkEntryScreen({ route, navigation }) {
  const { theme } = useContext(ThemeContext);
  const { customer, entry } = route.params || {};

  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
  const [mLiter, setMLiter] = useState(entry?.morning_liter?.toString() || '');
  const [mFat, setMFat] = useState(entry?.morning_fat?.toString() || '');
  const [eLiter, setELiter] = useState(entry?.evening_liter?.toString() || '');
  const [eFat, setEFat] = useState(entry?.evening_fat?.toString() || '');

  const handleSave = async () => {
    // Only update if this row has a real DB ID
    if (entry?.id && !entry.id.toString().startsWith('empty')) {
      await updateMilkEntry(
        entry.id,
        parseFloat(mLiter) || 0,
        parseFloat(mFat) || 0,
        parseFloat(eLiter) || 0,
        parseFloat(eFat) || 0
      );
    } else {
      // Add new entry if it does not exist
      await addMilkEntry(
        customer.id,
        date,
        parseFloat(mLiter) || 0,
        parseFloat(mFat) || 0,
        parseFloat(eLiter) || 0,
        parseFloat(eFat) || 0
      );
    }

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.textColor }]}>{customer.name}</Text>

      <Text style={[{ color: theme.textColor }]}>Date</Text>
      <TextInput value={date} onChangeText={setDate} style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]} />

      <Text style={[{ color: theme.textColor }]}>Morning Liter</Text>
      <TextInput value={mLiter} onChangeText={setMLiter} style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]} keyboardType="numeric" />

      <Text style={[{ color: theme.textColor }]}>Morning Fat</Text>
      <TextInput value={mFat} onChangeText={setMFat} style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]} keyboardType="numeric" />

      <Text style={[{ color: theme.textColor }]}>Evening Liter</Text>
      <TextInput value={eLiter} onChangeText={setELiter} style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]} keyboardType="numeric" />

      <Text style={[{ color: theme.textColor }]}>Evening Fat</Text>
      <TextInput value={eFat} onChangeText={setEFat} style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]} keyboardType="numeric" />

      <Button title={entry ? "Update Entry" : "Save Entry"} onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 25, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});