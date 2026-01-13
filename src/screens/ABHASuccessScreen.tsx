import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'ABHASuccess'>;

const { width } = Dimensions.get('window');

export default function ABHASuccessScreen({ navigation, route }: Props) {
    const { abhaNumber, abhaAddress } = route.params;
    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const page = Math.round(offsetX / width);
        setCurrentPage(page);
    };

    const downloadCard = () => {
        // TODO: Implement card download
        console.log('Download card');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Corner decorations */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {/* Page 1: Success Message */}
                <View style={[styles.page, { width }]}>
                    <View style={styles.successPage}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoCircle}>
                                <Text style={styles.logoSlash}>/.</Text>
                            </View>
                        </View>

                        <View style={styles.successMessageContainer}>
                            <Text style={styles.celebrationIcon}>🎉</Text>
                            <Text style={styles.successText}>
                                All set <Text style={styles.abhaText}>ABHA</Text> created
                            </Text>
                        </View>

                        <View style={styles.swipeHintContainer}>
                            <Text style={styles.swipeIcon}>👉</Text>
                            <Text style={styles.swipeText}>Swipe for credentials</Text>
                        </View>
                    </View>
                    <SponsorFooter logoSource={require('../../assets/images/Images/SponserCPJLOGO.png')} />
                </View>

                {/* Page 2: Credentials */}
                <View style={[styles.page, { width }]}>
                    <View style={styles.credentialsPage}>
                        <View style={styles.cardContainer}>
                            <View style={styles.card}>
                                <Text style={styles.cardLabel}>Card</Text>
                            </View>
                            <TouchableOpacity style={styles.downloadButton} onPress={downloadCard}>
                                <Text style={styles.downloadIcon}>📥</Text>
                                <Text style={styles.downloadText}>Download Card</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.detailsContainer}>
                            <Text style={styles.detailLabel}>ABHA Number:</Text>
                            <Text style={styles.detailValue}>{abhaNumber}</Text>

                            <Text style={styles.detailLabel}>ABHA Address:</Text>
                            <Text style={styles.detailValue}>{abhaAddress}</Text>

                            <Text style={styles.qrLabel}>QR code:</Text>
                            <View style={styles.qrContainer}>
                                <Text style={styles.qrPlaceholder}>QR</Text>
                            </View>
                        </View>

                        <View style={styles.swipeMoreContainer}>
                            <Text style={styles.swipeIcon}>👉</Text>
                            <Text style={styles.swipeMoreText}>Swipe for more</Text>
                        </View>
                    </View>
                </View>

                {/* Page 3: Actions */}
                <View style={[styles.page, { width }]}>
                    <View style={styles.actionsPage}>
                        <Text style={styles.actionsTitle}>What's Next?</Text>

                        <View style={styles.actionsList}>
                            <TouchableOpacity style={styles.actionCard}>
                                <Text style={styles.actionIcon}>🏥</Text>
                                <Text style={styles.actionTitle}>Find Hospitals</Text>
                                <Text style={styles.actionSubtitle}>Discover ABDM-enabled facilities</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionCard}>
                                <Text style={styles.actionIcon}>📱</Text>
                                <Text style={styles.actionTitle}>Link Health Records</Text>
                                <Text style={styles.actionSubtitle}>Connect your medical history</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionCard}>
                                <Text style={styles.actionIcon}>👨‍⚕️</Text>
                                <Text style={styles.actionTitle}>Consult Doctors</Text>
                                <Text style={styles.actionSubtitle}>Access telemedicine services</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.doneButton}
                            onPress={() => navigation.navigate('PatientDashboard')}
                        >
                            <Text style={styles.doneButtonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Page Indicator */}
            <View style={styles.pageIndicatorContainer}>
                {[0, 1, 2].map((index) => (
                    <View
                        key={index}
                        style={[
                            styles.pageIndicator,
                            currentPage === index && styles.pageIndicatorActive,
                        ]}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollView: {
        flex: 1
    },
    page: {
        flex: 1,
    },

    // Page 1: Success Page
    successPage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 100,
    },
    logoContainer: {
        marginBottom: 80,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoSlash: {
        fontSize: 60,
        color: '#fff',
        fontWeight: '600',
    },
    successMessageContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    celebrationIcon: {
        fontSize: 40,
        marginBottom: 16,
    },
    successText: {
        fontSize: 32,
        color: '#000',
        fontWeight: '400',
        textAlign: 'center',
    },
    abhaText: {
        color: '#ff3b30',
        fontWeight: '600',
    },
    swipeHintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    swipeIcon: {
        fontSize: 24,
    },
    swipeText: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500',
    },

    // Page 2: Credentials Page
    credentialsPage: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 100,
    },
    cardContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    card: {
        width: width - 100,
        height: 200,
        backgroundColor: '#bbb',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardLabel: {
        fontSize: 24,
        color: '#000',
        fontWeight: '600',
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    downloadIcon: {
        fontSize: 20,
    },
    downloadText: {
        fontSize: 18,
        color: '#000',
        fontWeight: '600',
    },
    detailsContainer: {
        marginBottom: 40,
    },
    detailLabel: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        marginTop: 16,
    },
    detailValue: {
        fontSize: 18,
        color: '#000',
        fontWeight: '500',
    },
    qrLabel: {
        fontSize: 16,
        color: '#000',
        marginTop: 24,
        marginBottom: 12,
        textAlign: 'center',
    },
    qrContainer: {
        width: 180,
        height: 180,
        backgroundColor: '#bbb',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    qrPlaceholder: {
        fontSize: 48,
        color: '#000',
        fontWeight: '700',
    },
    swipeMoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        marginTop: 20,
    },
    swipeMoreText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },

    // Page 3: Actions Page
    actionsPage: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 100,
    },
    actionsTitle: {
        fontSize: 32,
        fontWeight: '600',
        color: '#000',
        marginBottom: 30,
        textAlign: 'center',
    },
    actionsList: {
        flex: 1,
        gap: 16,
    },
    actionCard: {
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    doneButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#000',
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    doneButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },

    // Page Indicator
    pageIndicatorContainer: {
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    pageIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
    },
    pageIndicatorActive: {
        backgroundColor: '#000',
        width: 24,
    },

    // Corner decorations
    cornerTopLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
        zIndex: 10,
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
        zIndex: 10,
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
        zIndex: 10,
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
        zIndex: 10,
    },
});
