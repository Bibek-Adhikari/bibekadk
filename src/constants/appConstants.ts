import { Category } from "../models/types";

export const COLORS = {
    primary: '#4F46E5', // Indigo 600 (kept from the original as it works well on dark backgrounds)
    secondary: '#10B981', // Emerald 500
    background: '#141815ff', // Dark background for a dark theme
    surface: '#1F2937', // Darker surface color for cards and sections
    text: '#E5E7EB', // Light text color for readability on dark backgrounds
    textSecondary: '#9CA3AF', // Lighter secondary text for less emphasis
    border: '#374151', // Darker border color for better contrast on dark themes
    danger: '#EF4444', // Red 500 for danger, should work well on dark
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
