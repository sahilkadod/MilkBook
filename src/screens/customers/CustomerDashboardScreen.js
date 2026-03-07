import React, { useContext, useState } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    TouchableOpacity, TextInput, Alert, Share, Linking
} from 'react-native';
import { getMilkEntriesByCustomer } from '../../database/milkService';
import { getLatestRate, setLatestRate } from '../../database/rateService';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../theme/ThemeContext';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

// ------------------- Helper: get contrasting text color -------------------
const getContrastColor = (bgColor) => {
    // Remove hash if exists
    let color = bgColor.replace('#', '');
    if (color.length === 3) color = color.split('').map(c => c + c).join('');
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
};

export default function CustomerDashboardScreen({ route, navigation }) {
    const { theme } = useContext(ThemeContext);
    const { customer } = route.params;

    const [entries, setEntries] = useState([]);
    const [currentRate, setCurrentRate] = useState(0);
    const [newRate, setNewRate] = useState('');

    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    // -------------------- LOAD ENTRIES --------------------
    const loadEntries = async () => {
        const data = await getMilkEntriesByCustomer(customer.id, selectedMonth, selectedYear);
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const entryMap = {};
        data.forEach(item => { entryMap[item.date] = item; });

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

    // -------------------- LOAD RATE --------------------
    const loadRate = async (month = selectedMonth, year = selectedYear) => {
        try {
            const rate = await getLatestRate(month - 1, year);
            setCurrentRate(rate || 0);
            setNewRate(rate ? rate.toString() : '');
        } catch (err) {
            console.log('Load rate error:', err);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadEntries();
            loadRate();
        }, [selectedMonth, selectedYear])
    );

    // -------------------- SAVE RATE --------------------
    const saveRate = async () => {
        const parsedRate = parseFloat(newRate.replace(',', '.'));
        if (isNaN(parsedRate) || parsedRate < 0) {
            return Alert.alert('Invalid Input', 'Enter a valid positive number');
        }
        try {
            const success = await setLatestRate(selectedMonth - 1, selectedYear, parsedRate);
            if (success) {
                setCurrentRate(parsedRate);
                Alert.alert('Success', 'Rate saved successfully');
            } else {
                Alert.alert('Error', 'Failed to save rate');
            }
        } catch (err) {
            console.log('Save rate error:', err);
            Alert.alert('Error', 'Error saving rate');
        }
    };

    // -------------------- CALCULATE TOTALS --------------------
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
    const averageFat = totalSessions > 0 ? totals.totalFat / totalSessions : 0;
    const ratePerLiter = averageFat * currentRate;
    totals.totalMoney = totals.totalLiter * ratePerLiter;

    // -------------------- SHARE REPORT --------------------
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

        try {
            await Share.share({ message });
        } catch (error) {
            console.log('Share error:', error);
            Alert.alert('Error', 'Unable to share report.');
        }
    };

    // -------------------- FOOTER --------------------
    const renderFooter = () => {
        const footerTextColor = getContrastColor(theme.cardBackground);
        return (
            <View style={[styles.row, { backgroundColor: theme.cardBackground, borderTopWidth: 1.5, borderColor: theme.borderlineColor }]}>
                <Text style={[styles.cellDate, { fontWeight: 'bold', color: footerTextColor }]}>Total</Text>
                <Text style={[styles.cell, { fontWeight: 'bold', color: footerTextColor }]}>{totals.totalML.toFixed(1)}</Text>
                <Text style={[styles.cell, { fontWeight: 'bold', color: footerTextColor }]}>{totals.totalMF.toFixed(1)}</Text>
                <Text style={[styles.cell, { fontWeight: 'bold', color: footerTextColor }]}>{totals.totalEL.toFixed(1)}</Text>
                <Text style={[styles.cell, { fontWeight: 'bold', color: footerTextColor }]}>{totals.totalEF.toFixed(1)}</Text>
            </View>
        );
    };

    // -------------------- HEADER --------------------
    const renderHeader = () => {
        const headerTextColor = getContrastColor(theme.cardBackground);

        return (
            <View style={[styles.headerContainer, { backgroundColor: theme.backgroundColor }]}>
                <Text style={[styles.customerName, { color: theme.userNameColor }]}>{customer.name}</Text>

                {/* Month + Year Picker */}
                <View style={[styles.filterCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderlineColor, borderWidth: 1 }]}>
                    <Picker style={styles.picker} selectedValue={selectedMonth} onValueChange={setSelectedMonth}>
                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                            .map((name, index) => <Picker.Item key={index} label={name} value={index + 1} />)}
                    </Picker>
                    <Picker style={styles.picker} selectedValue={selectedYear} onValueChange={setSelectedYear}>
                        {[2024, 2025, 2026, 2027].map(y => <Picker.Item key={y} label={y.toString()} value={y} />)}
                    </Picker>
                </View>

                {/* Rate Section */}
                <View style={styles.rateCard}>
                    <Text style={[styles.rateLabel, { color: headerTextColor }]}>Rate</Text>
                    <TextInput
                        style={[styles.rateInput, { color: headerTextColor, borderColor: theme.borderlineColor }]}
                        value={newRate} onChangeText={setNewRate} keyboardType="numeric"
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveRate}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

                {/* Add Entry Button */}
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('MilkEntry', { customer })}>
                    <Text style={styles.addButtonText}>Add Milk Entry</Text>
                </TouchableOpacity>

                {/* Share Report Button */}
                <TouchableOpacity
                    style={[styles.addButton, { backgroundColor: '#2980b9' }]}
                    onPress={shareReport}
                >
                    <Text style={styles.addButtonText}>Share Report</Text>
                </TouchableOpacity>

                {/* Summary */}
                <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground, borderColor: theme.borderlineColor, borderWidth: 1 }]}>
                    <Text style={[styles.summaryText, { color: headerTextColor }]}>Total Liter: {totals.totalLiter.toFixed(1)}</Text>
                    <Text style={[styles.summaryText, { color: headerTextColor }]}>Total Fat: {totals.totalFat.toFixed(1)}</Text>
                    <Text style={[styles.summaryText, { color: headerTextColor }]}>Average Fat: {averageFat.toFixed(2)}</Text>
                    <Text style={[styles.summaryText, { color: headerTextColor }]}>Rate: {currentRate.toFixed(1)}</Text>
                    <Text style={[styles.summaryTextBold, { color: headerTextColor }]}>Total Money: ₹ {totals.totalMoney.toFixed(2)}</Text>
                </View>

                {/* Table Header */}
                <View style={[styles.tableHeader, { backgroundColor: theme.cardBackground, borderColor: theme.borderlineColor, borderWidth: 1 }]}>
                    <Text style={[styles.headerDate, { color: headerTextColor }]}>Date</Text>
                    <Text style={[styles.headerCell, { color: headerTextColor }]}>M.L</Text>
                    <Text style={[styles.headerCell, { color: headerTextColor }]}>M.F</Text>
                    <Text style={[styles.headerCell, { color: headerTextColor }]}>E.L</Text>
                    <Text style={[styles.headerCell, { color: headerTextColor }]}>E.F</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={entries}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                    const rowTextColor = getContrastColor(theme.backgroundColor);
                    return (
                        <TouchableOpacity onPress={() => navigation.navigate('MilkEntry', { entry: item, customer, month: selectedMonth, year: selectedYear })}>
                            <View style={[styles.row, { backgroundColor: theme.backgroundColor, borderColor: theme.borderlineColor }]}>
                                <Text style={[styles.cellDate, { color: rowTextColor }]}>{parseInt(item.date.split('-')[2], 10)}</Text>
                                <Text style={[styles.cell, { color: rowTextColor }]}>{item.morning_liter || '-'}</Text>
                                <Text style={[styles.cell, { color: rowTextColor }]}>{item.morning_fat || '-'}</Text>
                                <Text style={[styles.cell, { color: rowTextColor }]}>{item.evening_liter || '-'}</Text>
                                <Text style={[styles.cell, { color: rowTextColor }]}>{item.evening_fat || '-'}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: { padding: 15 },
    customerName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, backgroundColor: '#3498db', padding: 10, borderRadius: 8 },
    filterCard: { flexDirection: 'row', borderRadius: 10, marginBottom: 15, paddingHorizontal: 5 },
    picker: { flex: 1 },
    rateCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    rateLabel: { fontSize: 16, marginRight: 8, fontWeight: '600' },
    rateInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, height: 40, flex: 1, marginRight: 8 },
    saveButton: { backgroundColor: '#2E86DE', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    saveButtonText: { color: '#fff', fontWeight: '600' },
    addButton: { backgroundColor: '#27ae60', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    summaryCard: { borderRadius: 10, padding: 10, marginBottom: 15 },
    summaryText: { fontSize: 13, marginVertical: 2 },
    summaryTextBold: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
    tableHeader: { flexDirection: 'row', paddingVertical: 10, borderRadius: 8, paddingHorizontal: 5 },
    row: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 0.5, paddingHorizontal: 10 },
    headerDate: { width: 45, fontWeight: 'bold' },
    headerCell: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
    cellDate: { width: 45, fontSize: 13, fontWeight: 'bold' },
    cell: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '500' },
});