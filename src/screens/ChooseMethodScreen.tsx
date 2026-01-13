import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseMethod'>;

export default function ChooseMethodScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            {/* Corner decorations */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.header}>
                <Image source={require('../../assets/images/Images/ayusetu.png')} style={styles.brandMark} />
                <Text style={styles.title}>Create ABHA</Text>
                <Text style={styles.subtitle}>Choose authentication method</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <TouchableOpacity
                    style={styles.methodCard}
                    onPress={() => navigation.navigate('AadhaarInput')}
                >
                    <View style={styles.methodHeader}>
                        <Text style={styles.methodIcon}>🆔</Text>
                        <View style={styles.recommendedBadge}>
                            <Text style={styles.recommendedText}>Recommended</Text>
                        </View>
                    </View>
                    <Text style={styles.methodTitle}>Using Aadhaar</Text>
                    <Text style={styles.methodDesc}>
                        Fastest way to create ABHA with Aadhaar OTP verification
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.methodCard}
                    onPress={() => navigation.navigate('MobileInput')}
                >
                    <View style={styles.methodHeader}>
                        <Text style={styles.methodIcon}>📱</Text>
                    </View>
                    <Text style={styles.methodTitle}>Using Mobile Number</Text>
                    <Text style={styles.methodDesc}>
                        Create using mobile OTP (can upgrade with Aadhaar later)
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backLinkText}>← Go Back</Text>
                </TouchableOpacity>
            </ScrollView>

            <SponsorFooter logoSource={require('../../assets/images/Images/SponserCPJLOGO.png')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { alignItems: 'center', paddingTop: 40, paddingBottom: 20 },
    brandMark: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 12 },
    title: { fontSize: 42, fontWeight: '400', color: '#000', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#666' },
    content: { flex: 1 },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 200,
    },
    methodCard: {
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    methodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    methodIcon: {
        fontSize: 40,
    },
    recommendedBadge: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    recommendedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    methodTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    methodDesc: {
        fontSize: 15,
        color: '#666',
        lineHeight: 22,
    },
    backLink: {
        alignItems: 'center',
        marginTop: 20,
    },
    backLinkText: {
        fontSize: 16,
        color: '#444',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
    },
    cornerTopRight: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
    },
});
