// Predictive Insights Screen - Category 16
// AI-powered health predictions and risk assessments (non-diagnostic)

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
import { futureReadyService } from '../services/futureReadyService';
import {
    PredictiveInsight,
    HealthScore,
    PersonalizedRecommendation,
    RiskAssessment,
} from '../../backend/types/futureReady';

type Props = NativeStackScreenProps<RootStackParamList, 'PredictiveInsights'>;

export default function PredictiveInsightsScreen({ navigation }: Props) {
    const [insights, setInsights] = useState<PredictiveInsight[]>([]);
    const [healthScore, setHealthScore] = useState<HealthScore | null>(null);
    const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingRisk, setLoadingRisk] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [insightsData, scoreData, recsData] = await Promise.all([
                futureReadyService.getPredictiveInsights('user-123'),
                futureReadyService.getHealthScore('user-123'),
                futureReadyService.getPersonalizedRecommendations('user-123'),
            ]);
            setInsights(insightsData);
            setHealthScore(scoreData);
            setRecommendations(recsData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load predictive insights');
        } finally {
            setLoading(false);
        }
    };

    const handleViewRiskDetails = async (category: string) => {
        setSelectedCategory(category);
        setLoadingRisk(true);
        try {
            const assessment = await futureReadyService.getRiskAssessment('user-123', category);
            setRiskAssessment(assessment);
        } catch (error) {
            Alert.alert('Error', 'Failed to load risk assessment');
        } finally {
            setLoadingRisk(false);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'low': return '#4caf50';
            case 'moderate': return '#ff9800';
            case 'high': return '#f44336';
            case 'very_high': return '#b71c1c';
            default: return '#999';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return '#4caf50';
        if (score >= 60) return '#ff9800';
        return '#f44336';
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2196f3" />
                <Text style={styles.loadingText}>Analyzing your health data...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Health Score Overview */}
            {healthScore && (
                <View style={styles.scoreSection}>
                    <Text style={styles.sectionTitle}>Your Health Score</Text>
                    
                    <View style={styles.scoreCard}>
                        <View style={styles.scoreCircle}>
                            <Text style={[styles.scoreValue, { color: getScoreColor(healthScore.overall) }]}>
                                {healthScore.overall}
                            </Text>
                            <Text style={styles.scoreLabel}>/ 100</Text>
                        </View>
                        
                        <View style={styles.scoreTrend}>
                            <Text style={styles.scoreTrendIcon}>
                                {healthScore.trend === 'improving' ? '📈' : healthScore.trend === 'declining' ? '📉' : '➡️'}
                            </Text>
                            <Text style={styles.scoreTrendText}>
                                {healthScore.trend.charAt(0).toUpperCase() + healthScore.trend.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.scoreCategories}>
                        {Object.entries(healthScore.categories).map(([category, score]) => (
                            <View key={category} style={styles.scoreCategoryItem}>
                                <Text style={styles.scoreCategoryLabel}>
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </Text>
                                <View style={styles.scoreCategoryBar}>
                                    <View
                                        style={[
                                            styles.scoreCategoryBarFill,
                                            { width: `${score}%`, backgroundColor: getScoreColor(score) }
                                        ]}
                                    />
                                </View>
                                <Text style={styles.scoreCategoryValue}>{score}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Predictive Insights */}
            <View style={styles.insightsSection}>
                <Text style={styles.sectionTitle}>Predictive Health Insights</Text>
                <Text style={styles.sectionSubtitle}>
                    Based on your health trends and risk factors
                </Text>

                {insights.map((insight) => (
                    <View key={insight.id} style={styles.insightCard}>
                        <View style={styles.insightHeader}>
                            <View>
                                <Text style={styles.insightTitle}>{insight.title}</Text>
                                <Text style={styles.insightCategory}>
                                    {insight.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </Text>
                            </View>
                            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(insight.riskLevel) }]}>
                                <Text style={styles.riskBadgeText}>{insight.riskLevel.toUpperCase()}</Text>
                            </View>
                        </View>

                        <Text style={styles.insightDescription}>{insight.description}</Text>

                        <View style={styles.insightMeta}>
                            <View style={styles.insightMetaItem}>
                                <Text style={styles.insightMetaLabel}>Probability:</Text>
                                <Text style={styles.insightMetaValue}>{(insight.probability * 100).toFixed(0)}%</Text>
                            </View>
                            <View style={styles.insightMetaItem}>
                                <Text style={styles.insightMetaLabel}>Timeframe:</Text>
                                <Text style={styles.insightMetaValue}>{insight.timeframe}</Text>
                            </View>
                            <View style={styles.insightMetaItem}>
                                <Text style={styles.insightMetaLabel}>Confidence:</Text>
                                <Text style={styles.insightMetaValue}>{(insight.confidence * 100).toFixed(0)}%</Text>
                            </View>
                        </View>

                        {insight.preventiveActions.length > 0 && (
                            <View style={styles.preventiveBox}>
                                <Text style={styles.preventiveLabel}>🛡️ Preventive Actions:</Text>
                                {insight.preventiveActions.map((action, index) => (
                                    <Text key={index} style={styles.preventiveAction}>• {action}</Text>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => handleViewRiskDetails(insight.category)}
                        >
                            <Text style={styles.detailsButtonText}>View Risk Details</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Risk Assessment Detail */}
            {selectedCategory && riskAssessment && (
                <View style={styles.riskSection}>
                    <Text style={styles.sectionTitle}>Risk Assessment Details</Text>
                    
                    {loadingRisk ? (
                        <ActivityIndicator size="large" color="#2196f3" />
                    ) : (
                        <View style={styles.riskCard}>
                            <View style={styles.riskScore}>
                                <Text style={[styles.riskScoreValue, { color: getRiskColor(riskAssessment.riskLevel) }]}>
                                    {riskAssessment.riskScore}
                                </Text>
                                <Text style={styles.riskScoreLabel}>Risk Score</Text>
                            </View>

                            <Text style={styles.riskFactorsTitle}>Contributing Factors:</Text>
                            {riskAssessment.factors.map((factor, index) => (
                                <View key={index} style={styles.factorItem}>
                                    <View style={styles.factorHeader}>
                                        <Text style={styles.factorName}>{factor.name}</Text>
                                        <Text style={styles.factorContribution}>{factor.contribution}%</Text>
                                    </View>
                                    <Text style={styles.factorValue}>{factor.value}</Text>
                                    {factor.isModifiable && (
                                        <Text style={styles.modifiableBadge}>✏️ Modifiable</Text>
                                    )}
                                </View>
                            ))}

                            {riskAssessment.estimatedImpact && (
                                <View style={styles.impactBox}>
                                    <Text style={styles.impactText}>💪 {riskAssessment.estimatedImpact}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}

            {/* Personalized Recommendations */}
            <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>Personalized Recommendations</Text>
                <Text style={styles.sectionSubtitle}>
                    AI-powered suggestions to improve your health
                </Text>

                {recommendations.map((rec) => (
                    <View key={rec.id} style={styles.recommendationCard}>
                        <View style={styles.recommendationHeader}>
                            <Text style={styles.recommendationTitle}>{rec.title}</Text>
                            <View style={[
                                styles.priorityBadge,
                                rec.priority === 'high' && styles.priorityBadgeHigh,
                                rec.priority === 'medium' && styles.priorityBadgeMedium,
                            ]}>
                                <Text style={styles.priorityBadgeText}>{rec.priority.toUpperCase()}</Text>
                            </View>
                        </View>

                        <Text style={styles.recommendationCategory}>📁 {rec.category}</Text>
                        <Text style={styles.recommendationDescription}>{rec.description}</Text>

                        <View style={styles.recommendationMeta}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Expected Benefit:</Text>
                                <Text style={styles.metaValue}>{rec.expectedBenefit}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Difficulty:</Text>
                                <Text style={styles.metaValue}>{rec.difficulty}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Time:</Text>
                                <Text style={styles.metaValue}>{rec.timeCommitment}</Text>
                            </View>
                        </View>

                        {rec.resources && rec.resources.length > 0 && (
                            <View style={styles.resourcesBox}>
                                <Text style={styles.resourcesLabel}>📚 Resources:</Text>
                                {rec.resources.map((resource, index) => (
                                    <Text key={index} style={styles.resourceItem}>
                                        • {resource.title}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
                <Text style={styles.disclaimerIcon}>⚠️</Text>
                <Text style={styles.disclaimerText}>
                    These predictions are based on statistical models and should not be used for self-diagnosis.
                    Always consult healthcare professionals for medical advice.
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
    scoreSection: {
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
    scoreCard: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 20,
    },
    scoreCircle: {
        alignItems: 'center',
        marginBottom: 12,
    },
    scoreValue: {
        fontSize: 56,
        fontWeight: 'bold',
    },
    scoreLabel: {
        fontSize: 16,
        color: '#999',
    },
    scoreTrend: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    scoreTrendIcon: {
        fontSize: 20,
    },
    scoreTrendText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    scoreCategories: {
        gap: 12,
    },
    scoreCategoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    scoreCategoryLabel: {
        fontSize: 13,
        color: '#666',
        width: 100,
    },
    scoreCategoryBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    scoreCategoryBarFill: {
        height: '100%',
    },
    scoreCategoryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        width: 30,
        textAlign: 'right',
    },
    insightsSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    insightCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    insightHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    insightCategory: {
        fontSize: 12,
        color: '#666',
    },
    riskBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    riskBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    insightDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    insightMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 12,
    },
    insightMetaItem: {
        flex: 1,
        minWidth: '30%',
    },
    insightMetaLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    insightMetaValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    preventiveBox: {
        backgroundColor: '#e8f5e9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    preventiveLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2e7d32',
        marginBottom: 8,
    },
    preventiveAction: {
        fontSize: 13,
        color: '#388e3c',
        marginBottom: 4,
        lineHeight: 18,
    },
    detailsButton: {
        backgroundColor: '#2196f3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    riskSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    riskCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    riskScore: {
        alignItems: 'center',
        marginBottom: 20,
    },
    riskScoreValue: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    riskScoreLabel: {
        fontSize: 14,
        color: '#666',
    },
    riskFactorsTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    factorItem: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    factorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    factorName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    factorContribution: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2196f3',
    },
    factorValue: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },
    modifiableBadge: {
        fontSize: 11,
        color: '#4caf50',
        fontWeight: '600',
    },
    impactBox: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    impactText: {
        fontSize: 14,
        color: '#1976d2',
        lineHeight: 20,
    },
    recommendationsSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    recommendationCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    recommendationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    recommendationTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#4caf50',
    },
    priorityBadgeHigh: {
        backgroundColor: '#f44336',
    },
    priorityBadgeMedium: {
        backgroundColor: '#ff9800',
    },
    priorityBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    recommendationCategory: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    recommendationDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12,
    },
    recommendationMeta: {
        gap: 8,
        marginBottom: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: 13,
        color: '#999',
        marginRight: 6,
    },
    metaValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    resourcesBox: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
    },
    resourcesLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    resourceItem: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    disclaimer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff3e0',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    disclaimerIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 13,
        color: '#e65100',
        lineHeight: 20,
    },
});
