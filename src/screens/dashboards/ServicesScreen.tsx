import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/AppNavigator';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = BottomTabScreenProps<TabParamList, 'Services'>;

interface QuickAction {
    id: string;
    title: string;
    icon: string;
    color: string;
    screen: keyof RootStackParamList;
}

interface CategorySection {
    title: string;
    actions: QuickAction[];
}

export default function ServicesScreen({ navigation }: Props) {
    const rootNavigation = useNavigation<NavigationProp<RootStackParamList>>();

    const categories: CategorySection[] = [
        {
            title: 'Emergency',
            actions: [
                { id: 'sos', title: 'SOS', icon: '🚨', color: '#ef4444', screen: 'SOS' },
                { id: 'emergencyAccess', title: 'Emergency Access', icon: '🚑', color: '#dc2626', screen: 'EmergencyAccess' },
                { id: 'emergencyCard', title: 'Emergency Card', icon: '🆘', color: '#b91c1c', screen: 'EmergencyCard' },
            ],
        },
        {
            title: 'Health Records',
            actions: [
                { id: 'records', title: 'My Records', icon: '📄', color: '#3b82f6', screen: 'HealthRecords' },
                { id: 'upload', title: 'Upload', icon: '📤', color: '#2563eb', screen: 'ManualUpload' },
                { id: 'organize', title: 'Organize', icon: '📁', color: '#1d4ed8', screen: 'RecordManagement' },
                { id: 'timeline', title: 'Timeline', icon: '📊', color: '#1e40af', screen: 'HealthRecords' },
                { id: 'labs', title: 'Lab Tests', icon: '🧪', color: '#1e3a8a', screen: 'HealthRecords' },
            ],
        },
        {
            title: 'Consent & Privacy',
            actions: [
                { id: 'consent', title: 'Manage Consent', icon: '🔒', color: '#f59e0b', screen: 'ConsentManagement' },
                { id: 'consentInbox', title: 'Consent Inbox', icon: '📬', color: '#d97706', screen: 'ConsentInbox' },
                { id: 'consentTemplates', title: 'Templates', icon: '📝', color: '#b45309', screen: 'ConsentTemplates' },
                { id: 'auditTrail', title: 'Audit Trail', icon: '📋', color: '#92400e', screen: 'ConsentAudit' },
            ],
        },
        {
            title: 'Family & Insurance',
            actions: [
                { id: 'family', title: 'Family Health', icon: '👨‍👩‍👧‍👦', color: '#10b981', screen: 'FamilyHealthDashboard' },
                { id: 'familyManagement', title: 'Manage Family', icon: '👨‍👩‍👧‍👦', color: '#059669', screen: 'FamilyManagement' },
                { id: 'insurance', title: 'Insurance', icon: '💰', color: '#047857', screen: 'InsurancePolicies' },
            ],
        },
        {
            title: 'Smart Features',
            actions: [
                { id: 'aiAssistant', title: 'AI Assistant', icon: '🤖', color: '#6366f1', screen: 'AIAssistant' },
                { id: 'wearables', title: 'Wearables', icon: '⌚', color: '#4f46e5', screen: 'Wearables' },
                { id: 'predictions', title: 'Health Insights', icon: '🔮', color: '#4338ca', screen: 'PredictiveInsights' },
                { id: 'autoSync', title: 'Auto-Sync', icon: '🔄', color: '#3730a3', screen: 'AutoSync' },
            ],
        },
        {
            title: 'Premium Services',
            actions: [
                { id: 'premium', title: 'Premium', icon: '⭐', color: '#f97316', screen: 'PremiumFeatures' },
                { id: 'storage', title: 'Cloud Storage', icon: '☁️', color: '#ea580c', screen: 'CloudStorage' },
                { id: 'partners', title: 'Partner Services', icon: '🏥', color: '#c2410c', screen: 'PartnerServices' },
            ],
        },
        {
            title: 'Settings & More',
            actions: [
                { id: 'notifications', title: 'Notifications', icon: '🔔', color: '#64748b', screen: 'NotificationInbox' },
                { id: 'dataExport', title: 'Export Data', icon: '📤', color: '#475569', screen: 'DataExport' },
                { id: 'security', title: 'Security', icon: '🔒', color: '#334155', screen: 'SecuritySettings' },
                { id: 'language', title: 'Language', icon: '🌍', color: '#1e293b', screen: 'LanguageSettings' },
                { id: 'accessibility', title: 'Accessibility', icon: '♿', color: '#0f172a', screen: 'AccessibilitySettings' },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image
                        source={require('../../../assets/images/Images/ayusetu-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.headerTitle}>Services</Text>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {categories.map((category, index) => (
                    <View key={index} style={styles.categorySection}>
                        <View style={styles.categoryHeader}>
                            <Text style={styles.categoryTitle}>{category.title}</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAllText}>see all</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.actionsScroll}
                            contentContainerStyle={styles.actionsScrollContent}
                        >
                            {category.actions.map((action) => (
                                <TouchableOpacity
                                    key={action.id}
                                    style={[styles.actionCard, { backgroundColor: action.color }]}
                                    onPress={() => rootNavigation.navigate(action.screen as any)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.actionIcon}>{action.icon}</Text>
                                    <Text style={styles.actionTitle}>{action.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        width: 40,
        height: 40,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    searchButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIcon: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 24,
        paddingBottom: 100,
    },
    categorySection: {
        marginBottom: 28,
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    seeAllText: {
        fontSize: 14,
        color: '#3b82f6',
        fontWeight: '600',
    },
    actionsScroll: {
        marginHorizontal: -4,
    },
    actionsScrollContent: {
        paddingHorizontal: 4,
        gap: 12,
    },
    actionCard: {
        width: 140,
        height: 140,
        borderRadius: 20,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionIcon: {
        fontSize: 40,
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
});
