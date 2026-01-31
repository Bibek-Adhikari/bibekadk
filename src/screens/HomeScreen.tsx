import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday, parseISO, startOfDay, isWithinInterval, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { useExpenseStore } from '../store/useExpenseStore';
import { COLORS } from '../constants/appConstants';
import { ExpenseItem } from '../components/ExpenseItem';
import { Expense } from '../models/types';

export const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const { expenses, currency, filters, setFilters, deleteExpense } = useExpenseStore();

    const filteredExpenses = useMemo(() => {
        let filtered = expenses;

        // Filter by Date
        const now = new Date();
        let start: Date, end: Date;

        // Basic date filtering logic
        if (filters.period === 'today') {
            start = startOfDay(now);
            end = now;
        } else if (filters.period === 'week') {
            start = startOfWeek(now);
            end = now;
        } else if (filters.period === 'month') {
            start = startOfMonth(now);
            end = now;
        }
        // Custom range logic would go here

        // Apply filtering (simplified for now to match 'period' strictly if needed, 
        // but usually 'today' means 'start of today' onwards)
        // Actually, expenses store already sorts them.

        // Let's implement robust filtering based on 'filters.period'
        filtered = filtered.filter(e => {
            const d = parseISO(e.date);
            if (filters.period === 'today') return isToday(d);
            if (filters.period === 'week') return d >= startOfWeek(now) && d <= endOfWeek(now);
            if (filters.period === 'month') return d >= startOfMonth(now) && d <= endOfMonth(now);
            return true;
        });

        return filtered;
    }, [expenses, filters.period]);

    const sections = useMemo(() => {
        const grouped: { [key: string]: Expense[] } = {};
        filteredExpenses.forEach((item) => {
            const date = parseISO(item.date);
            let title = format(date, 'MMMM dd, yyyy');
            if (isToday(date)) title = 'Today';
            else if (isYesterday(date)) title = 'Yesterday';

            if (!grouped[title]) grouped[title] = [];
            grouped[title].push(item);
        });

        return Object.keys(grouped).map((title) => ({
            title,
            data: grouped[title],
        }));
    }, [filteredExpenses]);

    const totalSpent = useMemo(() => {
        return filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
    }, [filteredExpenses]);

    const renderFilterPill = (period: string, label: string) => (
        <TouchableOpacity
            style={[
                styles.filterPill,
                filters.period === period && styles.activeFilterPill,
            ]}
            onPress={() => setFilters({ period: period as any })}
        >
            <Text
                style={[
                    styles.filterText,
                    filters.period === period && styles.activeFilterText,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Total Spent</Text>
                    <Text style={styles.totalAmount}>{currency}{totalSpent.toFixed(2)}</Text>
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Web')}>
                    <Ionicons name="globe-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.filterText}>← Website</Text>
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[
                        { id: 'today', label: 'Today' },
                        { id: 'week', label: 'This Week' },
                        { id: 'month', label: 'This Month' },
                        { id: 'custom', label: 'All Time' },
                    ]}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderFilterPill(item.id, item.label)}
                />
            </View>

            {/* List */}
            <SectionList<Expense, { title: string }>
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ExpenseItem
                        expense={item}
                        currency={currency}
                        onPress={() => navigation.navigate('AddExpense', { expenseId: item.id })}
                    />
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="receipt-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No expenses found</Text>
                        <Text style={styles.emptySubtext}>Tap + to add one</Text>
                    </View>
                }
            />

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddExpense')}
            >
                <Ionicons name="add" size={32} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50, // Status bar spacing
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.text,
    },
    iconButton: {
        padding: 8,
        backgroundColor: COLORS.surface,
        borderRadius: 50,
    },
    filterContainer: {
        marginBottom: 10,
        height: 40,
    },
    filterPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeFilterPill: {
        backgroundColor: COLORS.primary,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    activeFilterText: {
        color: 'white',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginTop: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
});
