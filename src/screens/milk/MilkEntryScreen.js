import React, { useContext, useState, useRef } from 'react';
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

  // ✅ Refs for Next focus
  const mLiterRef = useRef(null);
  const mFatRef = useRef(null);
  const eLiterRef = useRef(null);
  const eFatRef = useRef(null);

  const handleSave = async () => {
    if (entry?.id && !entry.id.toString().startsWith('empty')) {
      await updateMilkEntry(
        entry.id,
        parseFloat(mLiter) || 0,
        parseFloat(mFat) || 0,
        parseFloat(eLiter) || 0,
        parseFloat(eFat) || 0
      );
    } else {
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

      {/* Date */}
      <Text style={{ color: theme.textColor }}>Date</Text>
      <TextInput
        value={date}
        onChangeText={setDate}
        style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]}
        returnKeyType="next"
        onSubmitEditing={() => mLiterRef.current?.focus()}
      />

      {/* Morning Liter */}
      <Text style={{ color: theme.textColor }}>Morning Liter</Text>
      <TextInput
        ref={mLiterRef}
        value={mLiter}
        onChangeText={setMLiter}
        style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => mFatRef.current?.focus()}
      />

      {/* Morning Fat */}
      <Text style={{ color: theme.textColor }}>Morning Fat</Text>
      <TextInput
        ref={mFatRef}
        value={mFat}
        onChangeText={setMFat}
        style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => eLiterRef.current?.focus()}
      />

      {/* Evening Liter */}
      <Text style={{ color: theme.textColor }}>Evening Liter</Text>
      <TextInput
        ref={eLiterRef}
        value={eLiter}
        onChangeText={setELiter}
        style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => eFatRef.current?.focus()}
      />

      {/* Evening Fat */}
      <Text style={{ color: theme.textColor }}>Evening Fat</Text>
      <TextInput
        ref={eFatRef}
        value={eFat}
        onChangeText={setEFat}
        style={[styles.input, { color: theme.textColor, borderColor: theme.borderlineColor }]}
        keyboardType="numeric"
        returnKeyType="done"
        onSubmitEditing={handleSave}   // ✅ Press OK to Save
      />

      <Button title={entry ? "Update Entry" : "Save Entry"} onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 25, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 },
});