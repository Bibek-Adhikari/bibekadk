import 'react-native-get-random-values';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseFilters, CategoryId } from '../models/types';

interface ExpenseState {
    expenses: Expense[];
    currency: string;
    filters: ExpenseFilters;
    searchQuery: string;
    addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
    updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => void;
    deleteExpense: (id: string) => void;
    setFilters: (filters: Partial<ExpenseFilters>) => void;
    setSearchQuery: (query: string) => void;
    setCurrency: (currency: string) => void;
    importExpenses: (expenses: Expense[]) => void;
    clearAll: () => void;
}

export const useExpenseStore = create<ExpenseState>()(
    persist(
        (set) => ({
            expenses: [],
            currency: '$',
            filters: { period: 'today' },
            searchQuery: '',
            addExpense: (expenseData) => set((state) => ({
                expenses: [
                    {
                        ...expenseData,
                        id: uuidv4(),
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                    ...state.expenses,
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // Keep sorted by date desc
            })),
            updateExpense: (id, updates) => set((state) => ({
                expenses: state.expenses.map((e) =>
                    e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
                ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            })),
            deleteExpense: (id) => set((state) => ({
                expenses: state.expenses.filter((e) => e.id !== id),
            })),
            setFilters: (newFilters) => set((state) => ({
                filters: { ...state.filters, ...newFilters },
            })),
            setSearchQuery: (searchQuery) => set({ searchQuery }),
            setCurrency: (currency) => set({ currency }),
            importExpenses: (newExpenses) => set((state) => ({
                expenses: [...state.expenses, ...newExpenses]
                    .filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i) // dedup by id
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            })),
            clearAll: () => set({ expenses: [] }),
        }),
        {
            name: 'expense-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
