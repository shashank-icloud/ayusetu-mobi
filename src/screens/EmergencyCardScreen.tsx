import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Share,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { emergencyService, EmergencyCard } from '../services/emergencyService';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyCard'>;

const EmergencyCardScreen: React.FC<Props> = ({ navigation }) => {
    const [card, setCard] = useState<EmergencyCard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmergencyCard();
    }, []);

    const loadEmergencyCard = async () => {
        setLoading(true);
        try {
            const data = await emergencyService.getEmergencyCard();
            setCard(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load emergency card');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateQR = async () => {
        Alert.alert(
            'Regenerate QR Code',
            'This will invalidate the old QR code. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Regenerate',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await emergencyService.regenerateQRCode();
                            Alert.alert('Success', 'QR code regenerated successfully');
                            loadEmergencyCard();
                        } catch (error) {
                            Alert.alert('Error', 'Failed to regenerate QR code');
                        }
                    },
                },
            ]
        );
    };

    const handleShare = async () => {
        if (!card) return;

        try {
            await Share.share({
                message: `Emergency Card - ${card.fullName}\nABHA: ${card.abhaAddress}\nBlood Group: ${card.bloodGroup}\nShort Code: ${card.shortCode}\n\nIn case of emergency, scan the QR code or use short code to access medical information.`,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const getExpiryStatus = () => {
        if (!card) return null;

        const expiryDate = new Date(card.expiresAt);
        const now = new Date();
        const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) {
            return { text: 'Expired', color: '#FF3B30', urgent: true };
        } else if (daysLeft < 30) {
            return { text: `Expires in ${daysLeft} days`, color: '#FF9500', urgent: true };
        } else {
            return { text: `Valid for ${daysLeft} days`, color: '#34C759', urgent: false };
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading emergency card...</Text>
            </View>
        );
    }

    if (!card) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backArrow}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Emergency Card</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>🆘</Text>
                    <Text style={styles.emptyTitle}>No Emergency Card</Text>
                    <Text style={styles.emptyText}>
                        Create your emergency card to enable quick access to critical medical information during emergencies.
                    </Text>
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('CreateEmergencyCard')}
                    >
                        <Text style={styles.createButtonText}>Create Emergency Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const expiryStatus = getExpiryStatus();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Emergency Card</Text>
                <TouchableOpacity onPress={handleShare}>
                    <Text style={styles.shareIcon}>📤</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Emergency Banner */}
                <View style={styles.emergencyBanner}>
                    <Text style={styles.bannerEmoji}>🚨</Text>
                    <Text style={styles.bannerTitle}>Emergency Medical Card</Text>
                    <Text style={styles.bannerSubtitle}>Quick access during emergencies</Text>
                </View>

                {/* Expiry Status */}
                {expiryStatus && (
                    <View style={[styles.expiryBanner, { backgroundColor: expiryStatus.color + '20' }]}>
                        <Text style={[styles.expiryText, { color: expiryStatus.color }]}>
                            {expiryStatus.urgent ? '⚠️ ' : '✓ '}
                            {expiryStatus.text}
                        </Text>
                    </View>
                )}

                {/* QR Code Section */}
                <View style={styles.qrSection}>
                    <View style={styles.qrPlaceholder}>
                        <Text style={styles.qrEmoji}>📱</Text>
                        <Text style={styles.qrText}>QR Code</Text>
                        <Text style={styles.qrSubtext}>Scan for instant access</Text>
                    </View>
                    <View style={styles.shortCodeContainer}>
                        <Text style={styles.shortCodeLabel}>Short Code</Text>
                        <Text style={styles.shortCode}>{card.shortCode}</Text>
                    </View>
                    <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerateQR}>
                        <Text style={styles.regenerateButtonText}>🔄 Regenerate QR</Text>
                    </TouchableOpacity>
                </View>

                {/* Personal Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👤 Personal Information</Text>
                    <View style={styles.card}>
                        <InfoRow label="Name" value={card.fullName} />
                        <InfoRow label="ABHA Number" value={card.abhaNumber} />
                        <InfoRow label="ABHA Address" value={card.abhaAddress} />
                        <InfoRow label="Age" value={`${card.age} years`} />
                        <InfoRow label="Gender" value={card.gender === 'M' ? 'Male' : card.gender === 'F' ? 'Female' : 'Other'} />
                        <InfoRow label="Blood Group" value={card.bloodGroup} important />
                    </View>
                </View>

                {/* Critical Medical Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚕️ Critical Medical Information</Text>

                    {card.allergies.length > 0 && (
                        <View style={[styles.card, styles.criticalCard]}>
                            <Text style={styles.criticalLabel}>🚨 Allergies</Text>
                            {card.allergies.map((allergy, index) => (
                                <Text key={index} style={styles.criticalItem}>• {allergy}</Text>
                            ))}
                        </View>
                    )}

                    {card.chronicConditions.length > 0 && (
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Chronic Conditions</Text>
                            {card.chronicConditions.map((condition, index) => (
                                <Text key={index} style={styles.listItem}>• {condition}</Text>
                            ))}
                        </View>
                    )}

                    {card.currentMedications.length > 0 && (
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Current Medications</Text>
                            {card.currentMedications.map((med, index) => (
                                <Text key={index} style={styles.listItem}>• {med}</Text>
                            ))}
                        </View>
                    )}

                    {card.implants && card.implants.length > 0 && (
                        <View style={styles.card}>
                            <Text style={styles.cardLabel}>Implants/Devices</Text>
                            {card.implants.map((implant, index) => (
                                <Text key={index} style={styles.listItem}>• {implant}</Text>
                            ))}
                        </View>
                    )}

                    <View style={styles.card}>
                        <InfoRow label="Organ Donor" value={card.organDonor ? 'Yes ✓' : 'No'} />
                    </View>
                </View>

                {/* Emergency Contacts */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📞 Emergency Contacts</Text>
                    {card.emergencyContacts.map(contact => (
                        <View key={contact.id} style={[styles.card, contact.isPrimary && styles.primaryContact]}>
                            {contact.isPrimary && (
                                <View style={styles.primaryBadge}>
                                    <Text style={styles.primaryBadgeText}>PRIMARY</Text>
                                </View>
                            )}
                            <Text style={styles.contactName}>{contact.name}</Text>
                            <Text style={styles.contactRelation}>{contact.relationship}</Text>
                            <Text style={styles.contactPhone}>{contact.phone}</Text>
                            {contact.email && <Text style={styles.contactEmail}>{contact.email}</Text>}
                            <View style={styles.contactPermissions}>
                                {contact.notifyOnEmergency && (
                                    <View style={styles.permissionTag}>
                                        <Text style={styles.permissionText}>🔔 Auto-notify</Text>
                                    </View>
                                )}
                                {contact.canAccessRecords && (
                                    <View style={styles.permissionTag}>
                                        <Text style={styles.permissionText}>🔓 Can access records</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                {/* Card Metadata */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ℹ️ Card Information</Text>
                    <View style={styles.card}>
                        <InfoRow label="Last Updated" value={new Date(card.lastUpdated).toLocaleDateString()} />
                        <InfoRow label="Version" value={`v${card.version}`} />
                        <InfoRow label="Status" value={card.isActive ? 'Active ✓' : 'Inactive'} />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('CreateEmergencyCard')}
                >
                    <Text style={styles.editButtonText}>✏️ Edit Emergency Card</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const InfoRow: React.FC<{ label: string; value: string; important?: boolean }> = ({
    label,
    value,
    important,
}) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, important && styles.infoValueImportant]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backArrow: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
        marginLeft: 16,
    },
    shareIcon: {
        fontSize: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    emptyText: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    createButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    emergencyBanner: {
        backgroundColor: '#FF3B30',
        padding: 24,
        alignItems: 'center',
    },
    bannerEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
    },
    expiryBanner: {
        padding: 12,
        alignItems: 'center',
    },
    expiryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    qrSection: {
        backgroundColor: '#fff',
        padding: 20,
        margin: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    qrPlaceholder: {
        width: 200,
        height: 200,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    qrEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    qrText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    qrSubtext: {
        fontSize: 13,
        color: '#666',
    },
    shortCodeContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    shortCodeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    shortCode: {
        fontSize: 28,
        fontWeight: '700',
        color: '#007AFF',
        letterSpacing: 4,
    },
    regenerateButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    regenerateButtonText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    criticalCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF3B30',
    },
    criticalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FF3B30',
        marginBottom: 8,
    },
    criticalItem: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    cardLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    listItem: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    infoValueImportant: {
        fontSize: 18,
        color: '#FF3B30',
        fontWeight: '700',
    },
    primaryContact: {
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    primaryBadge: {
        position: 'absolute',
        top: -8,
        right: 12,
        backgroundColor: '#007AFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    primaryBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    contactName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    contactRelation: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 8,
    },
    contactPhone: {
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    contactEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    contactPermissions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    permissionTag: {
        backgroundColor: '#f0f8ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    permissionText: {
        fontSize: 12,
        color: '#007AFF',
    },
    editButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        margin: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EmergencyCardScreen;
