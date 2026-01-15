import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { securityService } from '../services/securityService';
import type { TrustedDevice, DeviceApprovalRequest } from '../services/securityService';

const DeviceManagementScreen: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState<TrustedDevice[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<DeviceApprovalRequest[]>([]);
    const [maxDevices, setMaxDevices] = useState(5);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            setLoading(true);
            const [devicesData, approvalsData, settingsData] = await Promise.all([
                securityService.getTrustedDevices(),
                securityService.getPendingDeviceApprovals(),
                securityService.getSecuritySettings(),
            ]);
            setDevices(devicesData);
            setPendingApprovals(approvalsData);
            setMaxDevices(settingsData.maxTrustedDevices);
        } catch (error) {
            console.error('Error loading devices:', error);
            Alert.alert('Error', 'Failed to load devices');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveDevice = (device: TrustedDevice) => {
        Alert.alert(
            'Remove Device',
            `Are you sure you want to remove "${device.deviceName}"? This device will no longer have access to your health records.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await securityService.removeTrustedDevice({ deviceId: device.id });
                            await loadDevices();
                            Alert.alert('Success', 'Device removed successfully');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to remove device');
                        }
                    },
                },
            ]
        );
    };

    const handleApproveDevice = async (approval: DeviceApprovalRequest) => {
        try {
            await securityService.approveDevice(approval.id);
            await loadDevices();
            Alert.alert('Success', 'Device approved successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to approve device');
        }
    };

    const handleRejectDevice = async (approval: DeviceApprovalRequest) => {
        Alert.alert(
            'Reject Device',
            `Are you sure you want to reject access for "${approval.deviceName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await securityService.rejectDevice(approval.id);
                            await loadDevices();
                            Alert.alert('Success', 'Device access rejected');
                        } catch (error) {
                            Alert.alert('Error', 'Failed to reject device');
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDeviceIcon = (deviceType: string) => {
        switch (deviceType) {
            case 'mobile':
                return '📱';
            case 'tablet':
                return '📱';
            case 'desktop':
                return '💻';
            default:
                return '🔧';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Loading devices...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Pending Approvals */}
            {pendingApprovals.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pending Approvals</Text>
                    {pendingApprovals.map((approval) => (
                        <View key={approval.id} style={styles.approvalCard}>
                            <View style={styles.approvalHeader}>
                                <Text style={styles.deviceIcon}>{getDeviceIcon(approval.deviceType)}</Text>
                                <View style={styles.approvalInfo}>
                                    <Text style={styles.deviceName}>{approval.deviceName}</Text>
                                    <Text style={styles.deviceDetail}>{approval.platform}</Text>
                                    <Text style={styles.deviceDetail}>{approval.location}</Text>
                                    <Text style={styles.deviceDetail}>IP: {approval.ipAddress}</Text>
                                    <Text style={styles.timestamp}>
                                        Requested {formatDate(approval.requestedAt)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.approvalActions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.approveButton]}
                                    onPress={() => handleApproveDevice(approval)}
                                >
                                    <Text style={styles.actionButtonText}>Approve</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.rejectButton]}
                                    onPress={() => handleRejectDevice(approval)}
                                >
                                    <Text style={styles.actionButtonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}

            {/* Trusted Devices */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Trusted Devices</Text>
                    <Text style={styles.deviceCount}>
                        {devices.length} / {maxDevices}
                    </Text>
                </View>

                {devices.map((device) => (
                    <View key={device.id} style={styles.deviceCard}>
                        <View style={styles.deviceHeader}>
                            <Text style={styles.deviceIcon}>{getDeviceIcon(device.deviceType)}</Text>
                            <View style={styles.deviceInfo}>
                                <View style={styles.deviceNameRow}>
                                    <Text style={styles.deviceName}>{device.deviceName}</Text>
                                    {device.isCurrent && (
                                        <View style={styles.currentBadge}>
                                            <Text style={styles.currentBadgeText}>Current</Text>
                                        </View>
                                    )}
                                    {device.isVerified && (
                                        <Text style={styles.verifiedIcon}>✓</Text>
                                    )}
                                </View>
                                <Text style={styles.deviceDetail}>{device.platform}</Text>
                                <Text style={styles.deviceDetail}>{device.location}</Text>
                                <Text style={styles.deviceDetail}>IP: {device.ipAddress}</Text>
                            </View>
                        </View>

                        <View style={styles.deviceFooter}>
                            <View style={styles.deviceDates}>
                                <Text style={styles.dateLabel}>First seen:</Text>
                                <Text style={styles.dateValue}>{formatDate(device.firstSeen)}</Text>
                            </View>
                            <View style={styles.deviceDates}>
                                <Text style={styles.dateLabel}>Last seen:</Text>
                                <Text style={styles.dateValue}>{formatDate(device.lastSeen)}</Text>
                            </View>
                        </View>

                        {!device.isCurrent && (
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => handleRemoveDevice(device)}
                            >
                                <Text style={styles.removeButtonText}>Remove Device</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {devices.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🔒</Text>
                        <Text style={styles.emptyText}>No trusted devices</Text>
                        <Text style={styles.emptySubtext}>
                            Your devices will appear here once they're verified
                        </Text>
                    </View>
                )}
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>About Device Binding</Text>
                <Text style={styles.infoText}>
                    Device binding ensures that only your trusted devices can access your health
                    records. When a new device tries to login, you'll receive a notification to
                    approve or reject it.
                </Text>
                <Text style={styles.infoText}>
                    • Current device cannot be removed{'\n'}
                    • Maximum {maxDevices} devices allowed{'\n'}
                    • Remove unused devices for better security{'\n'}
                    • Verified devices have been confirmed via 2FA
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6b7280',
    },
    section: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    deviceCount: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
    },
    approvalCard: {
        borderWidth: 2,
        borderColor: '#fbbf24',
        backgroundColor: '#fffbeb',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    approvalHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    approvalInfo: {
        flex: 1,
        marginLeft: 12,
    },
    approvalActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    approveButton: {
        backgroundColor: '#10b981',
    },
    rejectButton: {
        backgroundColor: '#ef4444',
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    deviceCard: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    deviceHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    deviceIcon: {
        fontSize: 32,
    },
    deviceInfo: {
        flex: 1,
        marginLeft: 12,
    },
    deviceNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginRight: 8,
    },
    currentBadge: {
        backgroundColor: '#10b981',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 4,
    },
    currentBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '600',
    },
    verifiedIcon: {
        fontSize: 16,
        color: '#10b981',
    },
    deviceDetail: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 2,
    },
    deviceFooter: {
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 8,
        marginTop: 8,
    },
    deviceDates: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    dateLabel: {
        fontSize: 12,
        color: '#9ca3af',
    },
    dateValue: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    timestamp: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
    },
    removeButton: {
        marginTop: 12,
        backgroundColor: '#ef4444',
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    infoSection: {
        backgroundColor: '#eff6ff',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#bfdbfe',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#1e3a8a',
        marginBottom: 8,
        lineHeight: 20,
    },
});

export default DeviceManagementScreen;
