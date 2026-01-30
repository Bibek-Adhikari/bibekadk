import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import added

import { HomeScreen } from '../screens/HomeScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { COLORS } from '../constants/appConstants';

// Define Param Lists for Type Safety
export type RootStackParamList = {
    MainTabs: undefined;
    AddExpense: { expenseId?: string }; // Optional ID for editing
};

export type MainTabParamList = {
    Home: undefined;
    Analytics: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }: { route: any }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary, // Primary color for active tab
                tabBarInactiveTintColor: '#9CA3AF', // Lighter color for inactive tabs in dark mode
                tabBarStyle: {
                    backgroundColor: '#1F2937', // Dark background for the tab bar
                    borderTopColor: '#374151', // Darker border to separate from the screen content
                },
                tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
                    let iconName: any;

                    if (route.name === 'Home') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'Analytics') {
                        iconName = focused ? 'pie-chart' : 'pie-chart-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else {
                        iconName = 'help';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    );
}

export function RootNavigator() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainTabs" component={MainTabs} />
                    <Stack.Screen
                        name="AddExpense"
                        component={AddExpenseScreen}
                        options={{
                            presentation: 'modal',
                            headerShown: true,
                            title: 'Add Expense',
                            headerStyle: { backgroundColor: '#1F2937' }, // Dark header background
                            headerTintColor: '#E5E7EB', // Light text for header
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}
