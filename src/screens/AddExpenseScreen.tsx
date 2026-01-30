import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useExpenseStore } from '../store/useExpenseStore';
import { CATEGORIES, COLORS } from '../constants/appConstants';
import { CategoryId } from '../models/types';

export const AddExpenseScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const expenseId = route.params?.expenseId;

    const { addExpense, updateExpense, expenses } = useExpenseStore();

    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [categoryId, setCategoryId] = useState<CategoryId>('food');
    const [date, setDate] = useState(new Date());

    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (expenseId) {
            const expense = expenses.find((e) => e.id === expenseId);
            if (expense) {
                setAmount(expense.amount.toString());
                setNote(expense.note || '');
                setCategoryId(expense.categoryId);
                setDate(new Date(expense.date));
                navigation.setOptions({ title: 'Edit Expense' });
            }
        }
    }, [expenseId, expenses, navigation]);

    const handleSave = () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
            return;
        }

        if (expenseId) {
            updateExpense(expenseId, {
                amount: numAmount,
                categoryId,
                note,
                date: date.toISOString(),
            });
        } else {
            addExpense({
                amount: numAmount,
                categoryId,
                note,
                date: date.toISOString(),
            });
        }
        navigation.goBack();
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Amount Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={styles.amountWrapper}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder="0.00"
                            placeholderTextColor={COLORS.textSecondary}
                            autoFocus={!expenseId}
                        />
                    </View>
                </View>

                {/* Category Selector */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.categoryGrid}>
                        {CATEGORIES.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryItem,
                                    categoryId === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color },
                                ]}
                                onPress={() => setCategoryId(cat.id)}
                            >
                                <Ionicons
                                    name={cat.icon as any}
                                    size={24}
                                    color={categoryId === cat.id ? cat.color : COLORS.textSecondary}
                                />
                                <Text style={[
                                    styles.categoryText,
                                    categoryId === cat.id && { color: cat.color, fontWeight: '700' }
                                ]}>
                                    {cat.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Date Picker */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                        <Ionicons name="calendar-outline" size={20} color={COLORS.text} />
                        <Text style={styles.dateText}>{format(date, 'MMMM dd, yyyy')}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            maximumDate={new Date()}
                        />
                    )}
                </View>

                {/* Note Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Note (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        value={note}
                        onChangeText={setNote}
                        placeholder="What was this for?"
                        multiline
                    />
                </View>
            </ScrollView>

            {/* Save Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Expense</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    amountWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingBottom: 8,
    },
    currencySymbol: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.primary,
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 40,
        fontWeight: '700',
        color: COLORS.text,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryItem: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
    },
    categoryText: {
        fontSize: 12,
        marginTop: 8,
        color: COLORS.textSecondary,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    dateText: {
        marginLeft: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    input: {
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 20,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
});
