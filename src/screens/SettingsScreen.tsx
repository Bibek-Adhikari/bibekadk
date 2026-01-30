import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import { documentDirectory, writeAsStringAsync, readAsStringAsync } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseStore } from '../store/useExpenseStore';
import { COLORS } from '../constants/appConstants';

export const SettingsScreen = () => { // Removed navigation prop
    const { currency, setCurrency, clearAll, expenses, importExpenses } = useExpenseStore();

    const handleExport = async () => {
        try {
            if (!documentDirectory) {
                Alert.alert('Error', 'Storage not available');
                return;
            }
            const fileUri = documentDirectory + 'expenses.json';
            await writeAsStringAsync(fileUri, JSON.stringify(expenses, null, 2));

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export data');
        }
    };

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            if (result.canceled || !result.assets || result.assets.length === 0) return;

            const fileUri = result.assets[0].uri;
            const fileContent = await readAsStringAsync(fileUri);

            try {
                const parsed = JSON.parse(fileContent);
                if (Array.isArray(parsed) && parsed.every(e => e.id && e.amount && e.categoryId)) { // Basic schema check
                    importExpenses(parsed);
                    Alert.alert('Success', `Imported ${parsed.length} expenses.`);
                } else {
                    Alert.alert('Invalid File', 'The JSON file does not match the expected format.');
                }
            } catch (e) {
                Alert.alert('Error', 'Failed to parse JSON.');
            }

        } catch (error) {
            Alert.alert('Error', 'Failed to import data');
            console.log(error);
        }
    };

    const confirmClear = () => {
        Alert.alert(
            'Clear All Data',
            'Are you sure you want to delete all expenses? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: clearAll },
            ]
        );
    };

    const CURRENCIES = ['$', '€', '£', '¥', '₹', 'Rp'];

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Currency</Text>
                <View style={styles.currencyContainer}>
                    {CURRENCIES.map(c => (
                        <TouchableOpacity
                            key={c}
                            style={[styles.currencyChip, currency === c && styles.activeCurrency]}
                            onPress={() => setCurrency(c)}
                        >
                            <Text style={[styles.currencyText, currency === c && styles.activeCurrencyText]}>{c}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Management</Text>

                <TouchableOpacity style={styles.row} onPress={handleExport}>
                    <Ionicons name="share-outline" size={24} color={COLORS.text} />
                    <Text style={styles.rowText}>Export Data (JSON)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={handleImport}>
                    <Ionicons name="download-outline" size={24} color={COLORS.text} />
                    <Text style={styles.rowText}>Import Data (JSON)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.row} onPress={confirmClear}>
                    <Ionicons name="trash-outline" size={24} color={COLORS.danger} />
                    <Text style={[styles.rowText, { color: COLORS.danger }]}>Clear All Data</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.version}>Expense Tracker v1.0.0</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    currencyContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    currencyChip: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    activeCurrency: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    currencyText: {
        fontSize: 18,
        color: COLORS.text,
        fontWeight: '600',
    },
    activeCurrencyText: {
        color: 'white',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    rowText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
        marginLeft: 16,
    },
    version: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        marginTop: 'auto',
        marginBottom: 20,
    },
});
