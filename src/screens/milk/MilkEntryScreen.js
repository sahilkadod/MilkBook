import React, { useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { addMilkEntry, updateMilkEntry } from '../../database/milkService';
import { ThemeContext } from '../../theme/ThemeContext';
import { getContrastColor } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

    // Call refreshDashboard to reload data in CustomerDashboardScreen
    if (route.params?.refreshDashboard) {
      route.params.refreshDashboard(); // this will trigger loadEntries in the dashboard
    }

    navigation.goBack(); // navigate back to the dashboard
  };

  // ---------------- Dynamic Colors ----------------
  const inputBackgroundColor = theme.cardBackground;
  const inputTextColor = getContrastColor(inputBackgroundColor);
  const inputBorderColor = theme.borderlineColor || inputTextColor;

  const buttonTextColor = getContrastColor(theme.secondaryColor);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Customer Name */}
      <Text style={[styles.title, { color: getContrastColor(theme.primaryColor) }]}>
        {customer.name}
      </Text>

      <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: '#000' }]}>

        {/* Date */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: inputTextColor }]}>Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            style={[styles.input, { color: inputTextColor, backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
            returnKeyType="next"
            onSubmitEditing={() => mLiterRef.current?.focus()}
          />
        </View>

        {/* Morning Row */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: inputTextColor }]}>Morning Liter</Text>
            <TextInput
              ref={mLiterRef}
              value={mLiter}
              onChangeText={setMLiter}
              style={[styles.input, { color: inputTextColor, backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
              keyboardType="decimal-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => mFatRef.current?.focus()}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: inputTextColor }]}>Morning Fat</Text>
            <TextInput
              ref={mFatRef}
              value={mFat}
              onChangeText={setMFat}
              style={[styles.input, { color: inputTextColor, backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
              keyboardType="decimal-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => eLiterRef.current?.focus()}
            />
          </View>
        </View>

        {/* Evening Row */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: inputTextColor }]}>Evening Liter</Text>
            <TextInput
              ref={eLiterRef}
              value={eLiter}
              onChangeText={setELiter}
              style={[styles.input, { color: inputTextColor, backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
              keyboardType="decimal-pad"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => eFatRef.current?.focus()}
            />
          </View>
          <View style={styles.halfField}>
            <Text style={[styles.label, { color: inputTextColor }]}>Evening Fat</Text>
            <TextInput
              ref={eFatRef}
              value={eFat}
              onChangeText={setEFat}
              style={[styles.input, { color: inputTextColor, backgroundColor: inputBackgroundColor, borderColor: inputBorderColor }]}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.secondaryColor }]}
          onPress={handleSave}
        >
          <Icon name="save" size={20} color={buttonTextColor} style={{ marginRight: 6 }} />
          <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>
            {entry ? "Update Entry" : "Save Entry"}
          </Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 10
  },
  card: {
    padding: 20,
    borderRadius: 15,
    elevation: 4,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5
  },
  field: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  halfField: { flex: 0.48 },
  label: { fontSize: 14, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, height: 45 },
  saveButton: { marginTop: 10, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { fontWeight: '700', fontSize: 16 }
});