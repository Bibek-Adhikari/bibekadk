export type CategoryId = 'food' | 'transport' | 'bills' | 'shopping' | 'entertainment' | 'health' | 'other';

export interface Category {
    id: CategoryId;
    name: string;
    color: string;
    icon: string; // Ionicons name
}

export interface Expense {
    id: string;
    amount: number;
    categoryId: CategoryId;
    note?: string;
    date: string; // ISO string
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface ExpenseFilters {
    period: 'today' | 'week' | 'month' | 'custom';
    categoryId?: CategoryId | null;
    startDate?: string; // ISO string (for custom range)
    endDate?: string;   // ISO string (for custom range)
}
