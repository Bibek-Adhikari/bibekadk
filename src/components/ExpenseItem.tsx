import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Expense } from '../models/types';
import { CATEGORIES, COLORS } from '../constants/appConstants';

interface ExpenseItemProps {
    expense: Expense;
    onPress: () => void;
    currency: string;
}

export const ExpenseItem = ({ expense, onPress, currency }: ExpenseItemProps) => {
    const category = CATEGORIES.find((c) => c.id === expense.categoryId) || CATEGORIES[CATEGORIES.length - 1];

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
                <Ionicons name={category.icon as any} size={24} color={category.color} />
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.categoryName}>{expense.note || category.name}</Text>
                <Text style={styles.date}>{format(new Date(expense.date), 'h:mm a')}</Text>
            </View>

            <Text style={styles.amount}>
                {currency}{expense.amount.toFixed(2)}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
    },
});
