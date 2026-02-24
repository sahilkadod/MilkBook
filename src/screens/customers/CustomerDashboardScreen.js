import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { getMilkEntriesByCustomer } from '../../database/milkService';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { ThemeContext } from '../../theme/ThemeContext';

export default function CustomerDashboardScreen({ route, navigation }) {
    const { theme } = useContext(ThemeContext);
    const { customer } = route.params;
    const [entries, setEntries] = useState([]);
    const currentDate = new Date();

    const [selectedMonth, setSelectedMonth] = useState(
        currentDate.getMonth() + 1
    );
    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };
    const [selectedYear, setSelectedYear] = useState(
        currentDate.getFullYear()
    );
    const loadEntries = () => {
        const data = getMilkEntriesByCustomer(
            customer.id,
            selectedMonth,
            selectedYear
        );

        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

        const fullMonth = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const formattedDate = `${selectedYear}-${String(
                selectedMonth
            ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            const existingEntry = data.find(
                (item) => item.date === formattedDate
            );

            fullMonth.push(
                existingEntry || {
                    id: `empty-${day}`,
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
    // Inside CustomerDashboardScreen, before return()
    const calculateTotals = () => {
        let totalML = 0, totalMF = 0, totalEL = 0, totalEF = 0;

        entries.forEach(item => {
            totalML += parseFloat(item.morning_liter) || 0;
            totalMF += parseFloat(item.morning_fat) || 0;
            totalEL += parseFloat(item.evening_liter) || 0;
            totalEF += parseFloat(item.evening_fat) || 0;
        });

        return { totalML, totalMF, totalEL, totalEF };
    };

    const totals = calculateTotals();

    useFocusEffect(
        React.useCallback(() => {
            loadEntries();
        }, [selectedMonth, selectedYear])
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <Text style={[styles.title, { color: theme.textColor }]}>{customer.name}</Text>
            <View style={styles.filterRow}>
                <Picker
                    style={styles.picker}
                    selectedValue={selectedMonth}
                    onValueChange={(value) => setSelectedMonth(value)}
                >
                    {[...Array(12)].map((_, i) => (
                        <Picker.Item
                            key={i}
                            label={new Date(0, i).toLocaleString('default', { month: 'long' })}
                            value={i + 1}
                        />
                    ))}
                </Picker>

                <Picker
                    style={styles.picker}
                    selectedValue={selectedYear}
                    onValueChange={(value) => setSelectedYear(value)}
                >
                    {[2024, 2025, 2026, 2027].map((year) => (
                        <Picker.Item key={year} label={year.toString()} value={year} />
                    ))}
                </Picker>
            </View>
            <Button
                title="Add Milk Entry"
                onPress={() =>
                    navigation.navigate('MilkEntry', { customer })
                }
            />
            <View style={styles.header}>
                <Text style={styles.headerDate}>Date</Text>
                <Text style={styles.headerCell}>M.L</Text>
                <Text style={styles.headerCell}>M.F</Text>
                <Text style={styles.headerCell}>E.L</Text>
                <Text style={styles.headerCell}>E.F</Text>
            </View>
            <FlatList
                data={entries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MilkEntry', { entry: item, customer })}
                    >
                        <View style={[styles.row,{ backgroundColor: theme.backgroundColor, borderColor:theme.textColor }]}>
                            <Text style={[styles.cellDate, { color: theme.textColor }]}>
                                {new Date(item.date).getDate()}
                            </Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>{item.morning_liter}</Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>{item.morning_fat}</Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>{item.evening_liter}</Text>
                            <Text style={[styles.cell, { color: theme.textColor }]}>{item.evening_fat}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListFooterComponent={() => (
                    <View style={[styles.row, { backgroundColor: theme.textColor, borderColor:theme.textColor, borderTopWidth: 2 }]}>
                        <Text style={styles.cellDate}>Total</Text>
                        <Text style={styles.cell}>{totals.totalML.toFixed(2)}</Text>
                        <Text style={styles.cell}>{totals.totalMF.toFixed(2)}</Text>
                        <Text style={styles.cell}>{totals.totalEL.toFixed(2)}</Text>
                        <Text style={styles.cell}>{totals.totalEF.toFixed(2)}</Text>
                    </View>
                )}
            />
            {/* <FlatList
                data={entries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('MilkEntry', { entry: item, customer })}
                    >
                        <View style={styles.row}>
                            <Text style={styles.cellDate}>{new Date(item.date).getDate()}</Text>
                            <Text style={styles.cell}>{item.morning_liter}</Text>
                            <Text style={styles.cell}>{item.morning_fat}</Text>
                            <Text style={styles.cell}>{item.evening_liter}</Text>
                            <Text style={styles.cell}>{item.evening_fat}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 25, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    card: {
        borderWidth: 1,
        padding: 10,
        marginVertical: 8,
        borderRadius: 5,
    },
    header: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        paddingVertical: 8,
        backgroundColor: '#f2f2f2',
    },

    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },

    headerDate: {
        flex: 1,
        fontWeight: 'bold',
    },

    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    cellDate: {
        flex: 1,
    },

    cell: {
        flex: 1,
        textAlign: 'center',
    },
});