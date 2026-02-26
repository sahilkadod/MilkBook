import React, { useContext, useState } from 'react';
import {
    View, Text, Button, FlatList, StyleSheet,
    TouchableOpacity, TextInput, Alert, Platform
} from 'react-native';
import { getMilkEntriesByCustomer } from '../../database/milkService';
import { getLatestRate, setLatestRate } from '../../database/rateService';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../theme/ThemeContext';

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
        data.forEach(item => {
            entryMap[item.date] = item;
        });

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

    // -------------------- TOTALS CALCULATION --------------------
    let totals = {
        totalML: 0,
        totalMF: 0,
        totalEL: 0,
        totalEF: 0,
        totalLiter: 0,
        totalFat: 0,
        totalMoney: 0,
    };

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

    // ✅ Total Liter
    totals.totalLiter = totals.totalML + totals.totalEL;

    // ✅ Total Fat
    totals.totalFat = totals.totalMF + totals.totalEF;

    // ✅ Sessions = days × 2
    const totalSessions = totalDaysWithData * 2;

    // ✅ Average Fat (your method)
    const averageFat =
        totalSessions > 0
            ? totals.totalFat / totalSessions
            : 0;

    // ✅ Rate per liter
    const ratePerLiter = averageFat * currentRate;

    // ✅ Total Money
    totals.totalMoney = totals.totalLiter * ratePerLiter;

    // -------------------- FOOTER TOTAL ROW --------------------
    const renderFooter = () => (
        <View style={[styles.row, { backgroundColor: '#e6e6e6', borderTopWidth: 1.5 }]}>
            <Text style={[styles.cellDate, { fontWeight: 'bold' }]}>
                Total
            </Text>

            <Text style={[styles.cell, { fontWeight: 'bold' }]}>
                {totals.totalML.toFixed(1)}
            </Text>

            <Text style={[styles.cell, { fontWeight: 'bold' }]}>
                {totals.totalMF.toFixed(1)}
            </Text>

            <Text style={[styles.cell, { fontWeight: 'bold' }]}>
                {totals.totalEL.toFixed(1)}
            </Text>

            <Text style={[styles.cell, { fontWeight: 'bold' }]}>
                {totals.totalEF.toFixed(1)}
            </Text>
        </View>
    );
    // -------------------- HEADER --------------------
    const renderHeader = () => (
        <View style={[styles.title, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.title, { color: theme.textColor }]}>{customer.name}</Text>

            <View style={styles.filterRow}>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedMonth}
                    onValueChange={setSelectedMonth}
                >
                    {[
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((name, index) => (
                        <Picker.Item key={index} label={name} value={index + 1} />
                    ))}
                </Picker>

                <Picker
                    style={styles.picker}
                    selectedValue={selectedYear}
                    onValueChange={setSelectedYear}
                >
                    {[2024, 2025, 2026, 2027].map(y => (
                        <Picker.Item key={y} label={y.toString()} value={y} />
                    ))}
                </Picker>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                <Text style={{ color: theme.textColor, fontSize: 16, marginRight: 10 }}>Rate:</Text>
                <TextInput
                    style={[styles.input, { color: theme.textColor, borderColor: theme.textColor }]}
                    value={newRate}
                    onChangeText={setNewRate}
                    keyboardType="numeric"
                />
                <Button title="Save Rate" onPress={saveRate} />
            </View>

            <Button title="Add Milk Entry" onPress={() => navigation.navigate('MilkEntry', { customer })} />

            <View style={styles.summary}>
                <Text style={styles.summaryText}>Total Liter: {totals.totalLiter.toFixed(1)}</Text>
                <Text style={styles.summaryText}>Total Fat: {totals.totalFat.toFixed(1)}</Text>
                <Text style={styles.summaryText}>Average Fat: {averageFat.toFixed(2)}</Text>
                <Text style={styles.summaryText}>Rate: {currentRate.toFixed(1)}</Text>
                <Text style={styles.summaryText}>Total Money: {totals.totalMoney.toFixed(2)}</Text>
            </View>

            <View style={styles.header}>
                <Text style={styles.headerDate}>Date</Text>
                <Text style={styles.headerCell}>M.L</Text>
                <Text style={styles.headerCell}>M.F</Text>
                <Text style={styles.headerCell}>E.L</Text>
                <Text style={styles.headerCell}>E.F</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={entries}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('MilkEntry', {
                                entry: item,
                                customer,
                                month: selectedMonth,
                                year: selectedYear,
                            })
                        }
                    >
                        <View style={[styles.row, { backgroundColor: theme.backgroundColor }]}>
                            <Text style={[styles.cellDate, { color: theme.textColor }]}>
                                {parseInt(item.date.split('-')[2], 10)}
                            </Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>
                                {item.morning_liter || '-'}
                            </Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>
                                {item.morning_fat || '-'}
                            </Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>
                                {item.evening_liter || '-'}
                            </Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>
                                {item.evening_fat || '-'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}   // 👈 ADD THIS LINE
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
    },
    picker: { flex: 1 },
    input: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 6,
        flex: 1,
        marginRight: 8,
    },
    header: {
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: '#f2f2f2',
        borderBottomWidth: 1,
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
    },
    headerDate: { width: 45, fontWeight: 'bold' },
    headerCell: { flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 12 },
    cellDate: { width: 45, fontSize: 13, fontWeight: 'bold' },
    cell: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: 'bold' },
    summary: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingVertical: 8,
        backgroundColor: '#f2f2f2',
    },
    summaryText: {
        width: '48%',
        fontSize: 13,
        marginVertical: 2,
    },
});