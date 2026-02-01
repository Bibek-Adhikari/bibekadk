import React, { useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/appConstants';

export const WebScreen = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: 'Website',
            headerStyle: { backgroundColor: '#1F2937' },
            headerTintColor: '#E5E7EB',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <iframe
                src="https://bibekadk.netlify.app/"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Website"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
