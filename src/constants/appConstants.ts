import { Category } from '../models/types';

export const COLORS = {
    primary: '#4F46E5', // Indigo 600
    secondary: '#10B981', // Emerald 500
    background: '#F9FAFB', // Gray 50
    surface: '#FFFFFF',
    text: '#1F2937', // Gray 800
    textSecondary: '#6B7280', // Gray 500
    border: '#E5E7EB', // Gray 200
    danger: '#EF4444', // Red 500
};

export const CATEGORIES: Category[] = [
    { id: 'food', name: 'Food', color: '#F59E0B', icon: 'fast-food' },
    { id: 'transport', name: 'Transport', color: '#3B82F6', icon: 'car' },
    { id: 'bills', name: 'Bills', color: '#EF4444', icon: 'receipt' },
    { id: 'shopping', name: 'Shopping', color: '#8B5CF6', icon: 'cart' },
    { id: 'entertainment', name: 'Fun', color: '#EC4899', icon: 'game-controller' },
    { id: 'health', name: 'Health', color: '#10B981', icon: 'medkit' },
    { id: 'other', name: 'Other', color: '#6B7280', icon: 'pricetag' },
];
