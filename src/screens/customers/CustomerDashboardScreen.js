// Table columns: Date | M.L | M.F | E.L | E.F
// Fixed width for Date, flex for others
import React, { useContext, useState, useEffect } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, TextInput, Alert, Share, KeyboardAvoidingView, Platform
} from 'react-native';
import { getMilkEntriesByCustomer } from '../../database/milkService';
import { getLatestRate, setLatestRate } from '../../database/rateService';
import { ThemeContext } from '../../theme/ThemeContext';
import { getContrastColor } from '../../theme/theme';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For react-native-vector-icons

export default function CustomerDashboardScreen({ route, navigation }) {
    const { theme } = useContext(ThemeContext);
    const { customer } = route.params;

    const headerTextColor = getContrastColor(theme.cardBackground);
    const rowTextColor = getContrastColor(theme.backgroundColor);

    const [entries, setEntries] = useState([]);
    const [currentRate, setCurrentRate] = useState(0);
    const [newRate, setNewRate] = useState('');
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    // Load entries
    const loadEntries = async () => {
        const data = await getMilkEntriesByCustomer(customer.id, selectedMonth, selectedYear);
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const entryMap = {};
        data.forEach(item => entryMap[item.date] = item);
        const fullMonth = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(selectedYear, selectedMonth - 1, day);
            const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            fullMonth.push(
                entryMap[formattedDate] || {
                    id: `empty-${formattedDate}`,
                    date: formattedDate,
                    morning_liter: '',
                    morning_fat: '',
                    evening_liter: '',
                    evening_fat: '',
                }
            );
        }
        setEntries(fullMonth);
    };

    // Load rate
    const loadRate = async () => {
        try {
            const rate = await getLatestRate(selectedMonth - 1, selectedYear);
            setCurrentRate(rate || 0);
            setNewRate(rate ? rate.toString() : '');
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadEntries();
        loadRate();
    }, [selectedMonth, selectedYear]);

    // Save rate
    const saveRate = async () => {
        const parsedRate = parseFloat(newRate.replace(',', '.'));
        if (isNaN(parsedRate) || parsedRate < 0) return Alert.alert('Invalid Input', 'Enter a valid number');
        try {
            const success = await setLatestRate(selectedMonth - 1, selectedYear, parsedRate);
            if (success) {
                setCurrentRate(parsedRate);
                Alert.alert('Success', 'Rate saved');
            } else {
                Alert.alert('Error', 'Failed to save rate');
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Totals
    const totals = { totalML: 0, totalMF: 0, totalEL: 0, totalEF: 0, totalLiter: 0, totalFat: 0, totalMoney: 0 };
    let totalDaysWithData = 0;
    entries.forEach(item => {
        const mLit = parseFloat(item.morning_liter) || 0;
        const mFat = parseFloat(item.morning_fat) || 0;
        const eLit = parseFloat(item.evening_liter) || 0;
        const eFat = parseFloat(item.evening_fat) || 0;
        if (mLit || eLit) totalDaysWithData++;
        totals.totalML += mLit;
        totals.totalMF += mFat;
        totals.totalEL += eLit;
        totals.totalEF += eFat;
    });
    totals.totalLiter = totals.totalML + totals.totalEL;
    totals.totalFat = totals.totalMF + totals.totalEF;
    const totalSessions = totalDaysWithData * 2;
    const averageFat = totalSessions ? totals.totalFat / totalSessions : 0;
    const ratePerLiter = averageFat * currentRate;
    totals.totalMoney = totals.totalLiter * ratePerLiter;

    // Share report
    const shareReport = async () => {
        let message = `Milk Report\n${customer.name}\n${selectedMonth}/${selectedYear}\n\n`;
        entries.forEach(item => {
            if (item.morning_liter || item.evening_liter) {
                const day = new Date(item.date).getDate().toString().padStart(2, '0');
                message += `${day}  M:${item.morning_liter || '-'}L ${item.morning_fat || '-'}F  E:${item.evening_liter || '-'}L ${item.evening_fat || '-'}F\n`;
            }
        });
        message += `\nTotal Liter: ${totals.totalLiter.toFixed(1)}`;
        message += `\nTotal Fat: ${totals.totalFat.toFixed(1)}`;
        message += `\nTotal Money: ₹${totals.totalMoney.toFixed(2)}`;
        await Share.share({ message });
    };

    const renderRow = ({ item }) => (
        <TouchableOpacity
            onPress={() =>
                navigation.navigate('MilkEntry', {
                    customer,
                    entry: item, // optional, if you are editing an entry
                    refreshDashboard: loadEntries, // Pass this to trigger reloading of data
                })
            }
            activeOpacity={0.7}
        >
            <View style={[styles.row, { backgroundColor: theme.backgroundColor, borderColor: theme.borderlineColor }]}>
                <Text style={[styles.cellDate, { color: rowTextColor }]}>{parseInt(item.date.split('-')[2], 10)}</Text>
                <Text style={[styles.cell, { color: rowTextColor }]}>{item.morning_liter || '-'}</Text>
                <Text style={[styles.cell, { color: rowTextColor }]}>{item.morning_fat || '-'}</Text>
                <Text style={[styles.cell, { color: rowTextColor }]}>{item.evening_liter || '-'}</Text>
                <Text style={[styles.cell, { color: rowTextColor }]}>{item.evening_fat || '-'}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.backgroundColor }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={{ padding: 10 }}>
                {/* Customer */}
                <Text style={[styles.customerName, { backgroundColor: theme.cardBackground, color: headerTextColor }]}>{customer.name}</Text>

                {/* Month/Year */}
                <View style={[styles.filterCard, { borderColor: theme.borderlineColor, backgroundColor: theme.cardBackground }]}>
                    <Picker style={styles.picker} selectedValue={selectedMonth} onValueChange={setSelectedMonth} dropdownIconColor={theme.textColor}>
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => <Picker.Item key={i} label={m} value={i + 1} color={theme.textColor} />)}
                    </Picker>
                    <Picker style={styles.picker} selectedValue={selectedYear} onValueChange={setSelectedYear} dropdownIconColor={theme.textColor}>
                        {[2026, 2027, 2028, 2029, 2030].map(y => <Picker.Item key={y} label={y.toString()} value={y} color={theme.textColor} />)}
                    </Picker>
                </View>

                {/* Rate */}
                <View style={styles.rateCard}>
                    <Text style={[styles.rateLabel, { color: theme.textColor }]}>Rate</Text>
                    <TextInput style={[styles.rateInput, { color: theme.textColor, borderColor: theme.borderlineColor }]} value={newRate} onChangeText={setNewRate} keyboardType="numeric" />
                    <TouchableOpacity style={styles.saveButton} onPress={saveRate}><Text style={styles.saveButtonText}>Save</Text></TouchableOpacity>
                </View>

                {/* Summary */}
                <View style={[styles.summaryCard, { backgroundColor: theme.summaryCardBackground, borderColor: theme.borderlineColor }]}>
                    <Text style={[styles.summaryText, { color: theme.summaryCardText }]}>Total Liter: {totals.totalLiter.toFixed(1)}</Text>
                    <Text style={[styles.summaryText, { color: theme.summaryCardText }]}>Total Fat: {totals.totalFat.toFixed(1)}</Text>
                    <Text style={[styles.summaryText, { color: theme.summaryCardText }]}>Avg Fat: {averageFat.toFixed(2)}</Text>
                    <Text style={[styles.summaryText, { color: theme.summaryCardText }]}>Rate: {currentRate.toFixed(1)}</Text>
                    <Text style={[styles.summaryTextBold, { color: theme.summaryCardText }]}>Total ₹: {totals.totalMoney.toFixed(2)}</Text>
                </View>

                {/* Buttons */}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('MilkEntry', { customer })}
                >
                    <Icon name="add" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Add Milk Entry</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: '#25D366' }]}
                    onPress={shareReport}
                >
                    <Icon name="share" size={20} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.addButtonText}>Share Report</Text>
                </TouchableOpacity>
            </View>

            {/* Table */}
            <FlatList
                data={entries}
                keyExtractor={item => item.id.toString()}
                renderItem={renderRow}
                ListHeaderComponent={() => (
                    <View style={[styles.tableHeader, { backgroundColor: theme.cardBackground, borderColor: theme.borderlineColor }]}>
                        <Text style={[styles.headerDate, { color: headerTextColor }]}>Date</Text>
                        <Text style={[styles.cell, { color: headerTextColor }]}>M.L</Text>
                        <Text style={[styles.cell, { color: headerTextColor }]}>M.F</Text>
                        <Text style={[styles.cell, { color: headerTextColor }]}>E.L</Text>
                        <Text style={[styles.cell, { color: headerTextColor }]}>E.F</Text>
                    </View>
                )}
                ListFooterComponent={() => (
                    <View style={[styles.row, { backgroundColor: theme.cardBackground, borderTopWidth: 2, borderColor: theme.borderlineColor }]}>
                        <Text style={[styles.cellDate, { color: headerTextColor, fontWeight: 'bold' }]}>Total</Text>
                        <Text style={[styles.cell, { color: headerTextColor, fontWeight: 'bold' }]}>{totals.totalML.toFixed(1)}</Text>
                        <Text style={[styles.cell, { color: headerTextColor, fontWeight: 'bold' }]}>{totals.totalMF.toFixed(1)}</Text>
                        <Text style={[styles.cell, { color: headerTextColor, fontWeight: 'bold' }]}>{totals.totalEL.toFixed(1)}</Text>
                        <Text style={[styles.cell, { color: headerTextColor, fontWeight: 'bold' }]}>{totals.totalEF.toFixed(1)}</Text>
                    </View>
                )}
                keyboardShouldPersistTaps="handled"
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    customerName: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, padding: 8, borderRadius: 6 },
    filterCard: { flexDirection: 'row', borderRadius: 8, marginBottom: 10 },
    picker: { flex: 1 },
    rateCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    rateLabel: { fontSize: 14, marginRight: 6, fontWeight: '600' },
    rateInput: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, height: 36, flex: 1, marginRight: 6 },
    saveButton: { backgroundColor: '#2E86DE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    saveButtonText: { color: '#fff', fontWeight: '600' },
    addButton: { backgroundColor: '#2E86DE', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
    addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    summaryCard: { borderRadius: 8, padding: 8, marginBottom: 10, borderWidth: 1 },
    summaryText: { fontSize: 12, marginVertical: 1 },
    summaryTextBold: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
    tableHeader: { flexDirection: 'row', paddingVertical: 6, borderRadius: 6, paddingHorizontal: 5, borderWidth: 1 },
    row: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 0.5, paddingHorizontal: 5 },
    cellDate: { width: 45, textAlign: 'center', fontSize: 12, fontWeight: 'bold', borderRightWidth: 1, borderColor: '#ccc' },
    cell: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '500', borderRightWidth: 1, borderColor: '#ccc' },
    headerDate: {
        width: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 13
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 13
    },
    cellDate: {
        width: 40,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        paddingVertical: 4
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        paddingVertical: 4
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderColor: '#ccc',
        alignItems: 'center'
    },
    tableHeader: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderColor: '#aaa',
        backgroundColor: '#f5f5f5',
        alignItems: 'center'
    },
    addButton: {
        backgroundColor: '#2E86DE',
        paddingVertical: 10,
        paddingHorizontal: 15, // Added some padding for better spacing
        borderRadius: 8,
        alignItems: 'center',
        flexDirection: 'row',  // Added this to align text and icon in one line
        marginBottom: 8
    },
});