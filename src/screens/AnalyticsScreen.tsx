import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useExpenseStore } from '../store/useExpenseStore';
import { COLORS, CATEGORIES } from '../constants/appConstants';
import { subDays, format, startOfDay, eachDayOfInterval } from 'date-fns';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const AnalyticsScreen = () => {
    const { expenses, currency } = useExpenseStore();

    // Data for Summary Cards
    const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
    const avgPerDay = useMemo(() => {
        if (expenses.length === 0) return 0;
        // Simple avg based on active days or just total / unique days
        const uniqueDays = new Set(expenses.map(e => format(new Date(e.date), 'yyyy-MM-dd'))).size;
        return uniqueDays > 0 ? totalSpent / uniqueDays : 0;
    }, [expenses, totalSpent]);

    // Data for Line Chart (Last 7 Days)
    const lineChartData = useMemo(() => {
        const end = new Date();
        const start = subDays(end, 6);
        const days = eachDayOfInterval({ start, end });

        const data = days.map(day => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const dayTotal = expenses
                .filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dayStr)
                .reduce((sum, e) => sum + e.amount, 0);
            return dayTotal;
        });

        const labels = days.map(day => format(day, 'dd/MM'));

        return {
            labels,
            datasets: [{ data }],
        };
    }, [expenses]);

    // Data for Pie Chart (By Category)
    const pieChartData = useMemo(() => {
        const categoryMap: { [key: string]: number } = {};
        expenses.forEach(e => {
            categoryMap[e.categoryId] = (categoryMap[e.categoryId] || 0) + e.amount;
        });

        return Object.keys(categoryMap).map(catId => {
            const category = CATEGORIES.find(c => c.id === catId);
            return {
                name: category ? category.name : 'Unknown',
                population: categoryMap[catId],
                color: category ? category.color : COLORS.text,
                legendFontColor: COLORS.textSecondary,
                legendFontSize: 12,
            };
        }).sort((a, b) => b.population - a.population);
    }, [expenses]);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total Spent</Text>
                    <Text style={styles.summaryValue}>{currency}{totalSpent.toFixed(0)}</Text>
                </View>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Avg / Day</Text>
                    <Text style={styles.summaryValue}>{currency}{avgPerDay.toFixed(0)}</Text>
                </View>
            </View>

            {/* Line Chart */}
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Spending Trend (Last 7 Days)</Text>
                {lineChartData.datasets[0].data.some(v => v > 0) ? (
                    <LineChart
                        data={lineChartData}
                        width={SCREEN_WIDTH - 40}
                        height={220}
                        chartConfig={{
                            backgroundColor: COLORS.surface,
                            backgroundGradientFrom: COLORS.surface,
                            backgroundGradientTo: COLORS.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => COLORS.primary,
                            labelColor: (opacity = 1) => COLORS.textSecondary,
                            style: { borderRadius: 16 },
                            propsForDots: { r: '4', strokeWidth: '2', stroke: COLORS.primary },
                        }}
                        bezier
                        style={{ marginVertical: 8, borderRadius: 16 }}
                    />
                ) : (
                    <Text style={styles.noDataText}>Not enough data for trend</Text>
                )}

            </View>

            {/* Pie Chart */}
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>Spending by Category</Text>
                {pieChartData.length > 0 ? (
                    <PieChart
                        data={pieChartData}
                        width={SCREEN_WIDTH - 40}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                    />
                ) : (
                    <Text style={styles.noDataText}>No expenses to show</Text>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 50,
    },
    summaryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 24,
        gap: 16,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.text,
    },
    chartContainer: {
        backgroundColor: COLORS.surface,
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    noDataText: {
        color: COLORS.textSecondary,
        marginVertical: 20,
        fontStyle: 'italic',
    }
});
