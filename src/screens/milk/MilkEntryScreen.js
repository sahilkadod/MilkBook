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
import { getContrastColor } from '../../theme/theme'; // <-- import contrast helper

export default function MilkEntryScreen({ route, navigation }) {

  const { theme } = useContext(ThemeContext);
  const { customer, entry } = route.params || {};

  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
  const [mLiter, setMLiter] = useState(entry?.morning_liter?.toString() || '');
  const [mFat, setMFat] = useState(entry?.morning_fat?.toString() || '');
  const [eLiter, setELiter] = useState(entry?.evening_liter?.toString() || '');
  const [eFat, setEFat] = useState(entry?.evening_fat?.toString() || '');

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

  // Determine proper text and border colors based on background
  const dynamicTextColor = getContrastColor(theme.cardBackground);
  const dynamicBorderColor = getContrastColor(theme.cardBackground);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      
      {/* Customer Name */}
      <Text style={[styles.title, { color: getContrastColor(theme.primaryColor), backgroundColor: theme.primaryColor }]}>
        {customer.name}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>

        {/* Date */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: dynamicTextColor }]}>Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            style={[styles.input, { color: dynamicTextColor, borderColor: dynamicBorderColor }]}
            returnKeyType="next"
            onSubmitEditing={() => mLiterRef.current?.focus()}
          />
        </View>

        {/* Morning Row */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: dynamicTextColor }]}>Morning Liter</Text>
            <TextInput
              ref={mLiterRef}
              value={mLiter}
              onChangeText={setMLiter}
              style={[styles.input, { color: dynamicTextColor, borderColor: dynamicBorderColor }]}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => mFatRef.current?.focus()}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: dynamicTextColor }]}>Morning Fat</Text>
            <TextInput
              ref={mFatRef}
              value={mFat}
              onChangeText={setMFat}
              style={[styles.input, { color: dynamicTextColor, borderColor: dynamicBorderColor }]}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => eLiterRef.current?.focus()}
            />
          </View>
        </View>

        {/* Evening Row */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: dynamicTextColor }]}>Evening Liter</Text>
            <TextInput
              ref={eLiterRef}
              value={eLiter}
              onChangeText={setELiter}
              style={[styles.input, { color: dynamicTextColor, borderColor: dynamicBorderColor }]}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => eFatRef.current?.focus()}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: dynamicTextColor }]}>Evening Fat</Text>
            <TextInput
              ref={eFatRef}
              value={eFat}
              onChangeText={setEFat}
              style={[styles.input, { color: dynamicTextColor, borderColor: dynamicBorderColor }]}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title={entry ? "Update Entry" : "Save Entry"}
            onPress={handleSave}
            color={theme.secondaryColor}
          />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, padding: 10, borderRadius: 8 },
  card: { padding: 15, borderRadius: 12, elevation: 2 },
  field: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  halfField: { flex: 0.48 },
  label: { fontSize: 14, marginBottom: 5, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, height: 45 },
  buttonWrapper: { marginTop: 10 },
});