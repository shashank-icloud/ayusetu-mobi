import React from 'react';
import { Image, StyleSheet, Text, View, Platform } from 'react-native';

interface Props {
    logoSource: any;
}

export default function SponsorFooter({ logoSource }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Powered By</Text>
            <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: Platform.OS === 'ios' ? 40 : 30,
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        fontWeight: '500',
    },
    logo: {
        width: 60,
        height: 60,
        opacity: 0.9,
    },
});
