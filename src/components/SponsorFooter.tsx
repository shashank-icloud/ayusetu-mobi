import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

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
        paddingVertical: 24,
        // keep footer near bottom
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 36,
    },
    label: {
        fontSize: 18,
        color: '#000',
        marginBottom: 8,
    },
    logo: {
        width: 64,
        height: 64,
        opacity: 0.95,
    },
});
