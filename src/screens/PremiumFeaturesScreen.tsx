// Premium Features Screen - Category 15
// ABDM-compliant premium features showcase (no paywall pressure)

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { monetizationService } from '../services/monetizationService';
import { SubscriptionPlan, UserSubscription, PremiumFeature } from '../../backend/types/monetization';

type Props = NativeStackScreenProps<RootStackParamList, 'PremiumFeatures'>;

export default function PremiumFeaturesScreen({ navigation }: Props) {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
    const [features, setFeatures] = useState<PremiumFeature[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [plansData, subData, featuresData] = await Promise.all([
                monetizationService.getSubscriptionPlans(),
                monetizationService.getCurrentSubscription('user-123'),
                monetizationService.getPremiumFeatures(),
            ]);
            setPlans(plansData);
            setCurrentSubscription(subData);
            setFeatures(featuresData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load subscription plans');
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (planId: string) => {
        if (!currentSubscription) return;

        const plan = plans.find(p => p.id === planId);
        if (!plan) return;

        Alert.alert(
            'Upgrade Plan',
            `Upgrade to ${plan.name} for ₹${plan.price}/${plan.billingPeriod}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Upgrade',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const updatedSub = await monetizationService.upgradePlan('user-123', planId);
                            setCurrentSubscription(updatedSub);
                            Alert.alert('Success', `Successfully upgraded to ${plan.name}!`);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to upgrade plan');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'free': return '#9e9e9e';
            case 'basic': return '#2196f3';
            case 'premium': return '#ff9800';
            case 'family': return '#9c27b0';
            default: return '#666';
        }
    };

    const formatStorage = (gb: number) => {
        return gb >= 1000 ? `${gb / 1000}TB` : `${gb}GB`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196f3" />
                <Text style={styles.loadingText}>Loading plans...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Current Plan */}
            <View style={styles.currentPlanSection}>
                <Text style={styles.sectionTitle}>Your Current Plan</Text>
                {currentSubscription && (
                    <View style={[
                        styles.currentPlanCard,
                        { borderLeftColor: getTierColor(currentSubscription.tier) }
                    ]}>
                        <View style={styles.currentPlanHeader}>
                            <Text style={styles.currentPlanName}>
                                {plans.find(p => p.id === currentSubscription.planId)?.name || 'Unknown'}
                            </Text>
                            <View style={[styles.statusBadge, { backgroundColor: '#4caf50' }]}>
                                <Text style={styles.statusBadgeText}>Active</Text>
                            </View>
                        </View>
                        <Text style={styles.currentPlanDescription}>
                            {plans.find(p => p.id === currentSubscription.planId)?.description}
                        </Text>
                        {currentSubscription.tier !== 'free' && (
                            <Text style={styles.currentPlanExpiry}>
                                Renews on {new Date(currentSubscription.nextBillingDate || currentSubscription.endDate).toLocaleDateString('en-IN')}
                            </Text>
                        )}
                    </View>
                )}
            </View>

            {/* Premium Features by Category */}
            <View style={styles.featuresSection}>
                <Text style={styles.sectionTitle}>Premium Features</Text>
                <Text style={styles.sectionSubtitle}>
                    Unlock powerful features to manage your health better
                </Text>

                {['storage', 'analytics', 'support', 'family', 'export', 'security'].map(category => {
                    const categoryFeatures = features.filter(f => f.category === category);
                    if (categoryFeatures.length === 0) return null;

                    return (
                        <View key={category} style={styles.featureCategory}>
                            <Text style={styles.featureCategoryTitle}>
                                {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                            </Text>
                            {categoryFeatures.map(feature => (
                                <View key={feature.id} style={styles.featureCard}>
                                    <Text style={styles.featureIcon}>{feature.icon}</Text>
                                    <View style={styles.featureInfo}>
                                        <Text style={styles.featureName}>{feature.name}</Text>
                                        <Text style={styles.featureDescription}>{feature.description}</Text>
                                        <View style={[styles.tierBadge, { backgroundColor: getTierColor(feature.tier) }]}>
                                            <Text style={styles.tierBadgeText}>
                                                {feature.tier.toUpperCase()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    );
                })}
            </View>

            {/* Subscription Plans */}
            <View style={styles.plansSection}>
                <Text style={styles.sectionTitle}>Choose Your Plan</Text>
                <Text style={styles.sectionSubtitle}>
                    No hidden charges. Cancel anytime. ABDM compliant.
                </Text>

                {plans.map(plan => {
                    const isCurrentPlan = currentSubscription?.planId === plan.id;
                    const canUpgrade = !isCurrentPlan && (
                        plan.tier !== 'free' &&
                        (currentSubscription?.tier === 'free' ||
                            (currentSubscription?.tier === 'basic' && (plan.tier === 'premium' || plan.tier === 'family')) ||
                            (currentSubscription?.tier === 'premium' && plan.tier === 'family'))
                    );

                    return (
                        <TouchableOpacity
                            key={plan.id}
                            style={[
                                styles.planCard,
                                isCurrentPlan && styles.planCardCurrent,
                                plan.isPopular && styles.planCardPopular,
                            ]}
                            onPress={() => canUpgrade && setSelectedPlanId(plan.id)}
                            disabled={isCurrentPlan || !canUpgrade}
                        >
                            {plan.isPopular && (
                                <View style={styles.popularBadge}>
                                    <Text style={styles.popularBadgeText}>⭐ POPULAR</Text>
                                </View>
                            )}

                            <View style={styles.planHeader}>
                                <Text style={[styles.planName, { color: getTierColor(plan.tier) }]}>
                                    {plan.name}
                                </Text>
                                {isCurrentPlan && (
                                    <View style={styles.currentBadge}>
                                        <Text style={styles.currentBadgeText}>Current</Text>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.planDescription}>{plan.description}</Text>

                            <View style={styles.planPricing}>
                                <Text style={styles.planPrice}>₹{plan.price}</Text>
                                <Text style={styles.planPeriod}>/{plan.billingPeriod}</Text>
                            </View>

                            <View style={styles.planHighlights}>
                                <Text style={styles.planHighlight}>
                                    💾 {formatStorage(plan.storageLimit)} storage
                                </Text>
                                <Text style={styles.planHighlight}>
                                    📤 {plan.exportLimit === -1 ? 'Unlimited' : plan.exportLimit} exports/month
                                </Text>
                                <Text style={styles.planHighlight}>
                                    🎧 {plan.supportLevel.charAt(0).toUpperCase() + plan.supportLevel.slice(1)} support
                                </Text>
                                {plan.maxFamilyMembers && (
                                    <Text style={styles.planHighlight}>
                                        👨‍👩‍👧‍👦 Up to {plan.maxFamilyMembers} family members
                                    </Text>
                                )}
                            </View>

                            <View style={styles.planFeatures}>
                                {plan.features.map((feature, index) => (
                                    <View key={index} style={styles.planFeatureItem}>
                                        <Text style={styles.planFeatureCheck}>✓</Text>
                                        <Text style={styles.planFeatureText}>{feature}</Text>
                                    </View>
                                ))}
                            </View>

                            {canUpgrade && (
                                <TouchableOpacity
                                    style={[
                                        styles.upgradeButton,
                                        selectedPlanId === plan.id && styles.upgradeButtonSelected,
                                    ]}
                                    onPress={() => handleUpgrade(plan.id)}
                                >
                                    <Text style={styles.upgradeButtonText}>
                                        Upgrade to {plan.name}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {isCurrentPlan && (
                                <View style={styles.currentPlanButton}>
                                    <Text style={styles.currentPlanButtonText}>Current Plan</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* ABDM Compliance Notice */}
            <View style={styles.complianceNotice}>
                <Text style={styles.complianceIcon}>🔒</Text>
                <Text style={styles.complianceTitle}>ABDM Compliant Monetization</Text>
                <Text style={styles.complianceText}>
                    • Your health data is never sold to third parties{'\n'}
                    • No health data is used for advertising{'\n'}
                    • Transparent pricing with no hidden charges{'\n'}
                    • Full data control remains with you{'\n'}
                    • All transactions are encrypted
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    currentPlanSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    currentPlanCard: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    currentPlanHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    currentPlanName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    currentPlanDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    currentPlanExpiry: {
        fontSize: 12,
        color: '#999',
    },
    featuresSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    featureCategory: {
        marginBottom: 20,
    },
    featureCategoryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2196f3',
        marginBottom: 12,
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 8,
    },
    featureIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    featureInfo: {
        flex: 1,
    },
    featureName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    tierBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    tierBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    plansSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    planCard: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        marginBottom: 16,
        position: 'relative',
    },
    planCardCurrent: {
        borderColor: '#4caf50',
        backgroundColor: '#f1f8e9',
    },
    planCardPopular: {
        borderColor: '#ff9800',
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        right: 16,
        backgroundColor: '#ff9800',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    planName: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    currentBadge: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    currentBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    planDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    planPricing: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    planPrice: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
    },
    planPeriod: {
        fontSize: 16,
        color: '#666',
        marginLeft: 4,
    },
    planHighlights: {
        marginBottom: 12,
    },
    planHighlight: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    planFeatures: {
        marginBottom: 16,
    },
    planFeatureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    planFeatureCheck: {
        color: '#4caf50',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    planFeatureText: {
        flex: 1,
        fontSize: 14,
        color: '#555',
    },
    upgradeButton: {
        backgroundColor: '#2196f3',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    upgradeButtonSelected: {
        backgroundColor: '#1976d2',
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    currentPlanButton: {
        backgroundColor: '#e0e0e0',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    currentPlanButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
    },
    complianceNotice: {
        margin: 16,
        padding: 16,
        backgroundColor: '#e8f5e9',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4caf50',
    },
    complianceIcon: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 8,
    },
    complianceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e7d32',
        textAlign: 'center',
        marginBottom: 8,
    },
    complianceText: {
        fontSize: 13,
        color: '#388e3c',
        lineHeight: 20,
    },
});
