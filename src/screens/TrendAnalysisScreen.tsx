import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { insightsService, HealthTrend, COMPLIANCE_DISCLAIMER } from '../services/insightsService';

/**
 * Trend Analysis Screen
 * 
 * Visualizes health metric trends over time:
 * - Blood pressure (systolic/diastolic)
 * - Blood sugar levels
 * - Body weight
 * - Other vitals
 * 
 * Shows trend direction, percentage change, and insights
 * ⚠️ Informational only, not diagnostic
 */

const SCREEN_WIDTH = Dimensions.get('window').width;

export const TrendAnalysisScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [trends, setTrends] = useState<HealthTrend[]>([]);
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

    useEffect(() => {
        loadTrends();
    }, []);

    const loadTrends = async () => {
        try {
            setLoading(true);
            const data = await insightsService.getHealthTrends();
            setTrends(data);
            if (data.length > 0) {
                setSelectedMetric(data[0].metric);
            }
        } catch (error) {
            console.error('Failed to load trends:', error);
            Alert.alert('Error', 'Failed to load trend data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend: string): string => {
        if (trend === 'improving') return '📈';
        if (trend === 'declining') return '📉';
        return '➡️';
    };

    const getTrendColor = (trend: string): string => {
        if (trend === 'improving') return '#10b981';
        if (trend === 'declining') return '#ef4444';
        return '#94a3b8';
    };

    const renderMiniChart = (trend: HealthTrend) => {
        const dataPoints = trend.dataPoints;
        if (dataPoints.length === 0) return null;

        const values = dataPoints.map(dp => dp.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const range = maxValue - minValue || 1;

        const chartWidth = SCREEN_WIDTH - 64;
        const chartHeight = 180;
        const pointSpacing = chartWidth / Math.max(dataPoints.length - 1, 1);

        // Calculate points
        const points = dataPoints.map((dp, index) => {
            const x = index * pointSpacing;
            const normalizedValue = (dp.value - minValue) / range;
            const y = chartHeight - normalizedValue * (chartHeight - 40) - 20;
            return { x, y, value: dp.value, date: dp.date };
        });

        return (
            <View style={styles.chartContainer}>
                <View style={[styles.chart, { height: chartHeight }]}>
                    {/* Normal range indicator */}
                    {trend.normalRange && (
                        <View
                            style={[
                                styles.normalRangeBox,
                                {
                                    top:
                                        chartHeight -
                                        ((trend.normalRange.max - minValue) / range) * (chartHeight - 40) -
                                        20,
                                    height:
                                        ((trend.normalRange.max - trend.normalRange.min) / range) *
                                        (chartHeight - 40),
                                },
                            ]}
                        />
                    )}

                    {/* Data points and line */}
                    {points.map((point, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <View
                                    style={[
                                        styles.chartLine,
                                        {
                                            left: points[index - 1].x,
                                            top: points[index - 1].y,
                                            width: Math.sqrt(
                                                Math.pow(point.x - points[index - 1].x, 2) +
                                                Math.pow(point.y - points[index - 1].y, 2)
                                            ),
                                            transform: [
                                                {
                                                    rotate: `${Math.atan2(
                                                        point.y - points[index - 1].y,
                                                        point.x - points[index - 1].x
                                                    )}rad`,
                                                },
                                            ],
                                        },
                                    ]}
                                />
                            )}
                            <View style={[styles.chartDot, { left: point.x - 4, top: point.y - 4 }]} />
                        </React.Fragment>
                    ))}

                    {/* X-axis labels */}
                    {points.map((point, index) => (
                        <Text
                            key={`label-${index}`}
                            style={[styles.chartLabel, { left: point.x - 20, top: chartHeight - 18 }]}
                        >
                            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Text>
                    ))}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading trend analysis...</Text>
            </View>
        );
    }

    if (trends.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyText}>No trend data available yet</Text>
                <Text style={styles.emptySubtext}>Start tracking your health metrics to see trends</Text>
            </View>
        );
    }

    const selectedTrend = trends.find(t => t.metric === selectedMetric) || trends[0];

    return (
        <ScrollView style={styles.container}>
            {/* Disclaimer */}
            <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerIcon}>ℹ️</Text>
                <Text style={styles.disclaimerText}>{COMPLIANCE_DISCLAIMER.text}</Text>
            </View>

            {/* Metric Selector */}
            <View style={styles.selectorContainer}>
                <Text style={styles.selectorTitle}>Select Metric</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selector}>
                    {trends.map(trend => (
                        <TouchableOpacity
                            key={trend.metric}
                            style={[
                                styles.selectorButton,
                                selectedMetric === trend.metric && styles.selectorButtonActive,
                            ]}
                            onPress={() => setSelectedMetric(trend.metric)}
                        >
                            <Text
                                style={[
                                    styles.selectorButtonText,
                                    selectedMetric === trend.metric && styles.selectorButtonTextActive,
                                ]}
                            >
                                {trend.displayName}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Selected Trend Card */}
            <View style={styles.trendCard}>
                <View style={styles.trendHeader}>
                    <View>
                        <Text style={styles.trendTitle}>{selectedTrend.displayName}</Text>
                        <Text style={styles.trendSubtitle}>
                            Last {selectedTrend.dataPoints.length} readings
                        </Text>
                    </View>
                    <View style={styles.currentValueBox}>
                        <Text style={styles.currentValue}>
                            {selectedTrend.currentValue} {selectedTrend.unit}
                        </Text>
                        <Text style={styles.currentLabel}>Current</Text>
                    </View>
                </View>

                {/* Trend Indicator */}
                <View
                    style={[
                        styles.trendIndicator,
                        { backgroundColor: getTrendColor(selectedTrend.trend) + '20' },
                    ]}
                >
                    <Text style={styles.trendIcon}>{getTrendIcon(selectedTrend.trend)}</Text>
                    <View style={styles.trendInfo}>
                        <Text style={[styles.trendText, { color: getTrendColor(selectedTrend.trend) }]}>
                            {selectedTrend.trend.charAt(0).toUpperCase() + selectedTrend.trend.slice(1)}
                        </Text>
                        {selectedTrend.trendPercentage !== undefined && (
                            <Text style={styles.trendPercentage}>
                                {selectedTrend.trendPercentage > 0 ? '+' : ''}
                                {selectedTrend.trendPercentage.toFixed(1)}%
                            </Text>
                        )}
                    </View>
                </View>

                {/* Normal Range */}
                {selectedTrend.normalRange && (
                    <View style={styles.normalRangeInfo}>
                        <Text style={styles.normalRangeLabel}>Normal Range:</Text>
                        <Text style={styles.normalRangeValue}>
                            {selectedTrend.normalRange.min} - {selectedTrend.normalRange.max} {selectedTrend.unit}
                        </Text>
                    </View>
                )}

                {/* Chart */}
                {renderMiniChart(selectedTrend)}

                {/* Insight */}
                {selectedTrend.insight && (
                    <View style={styles.insightBox}>
                        <Text style={styles.insightIcon}>💡</Text>
                        <Text style={styles.insightText}>{selectedTrend.insight}</Text>
                    </View>
                )}

                {/* Data Points Table */}
                <View style={styles.dataTable}>
                    <Text style={styles.dataTableTitle}>Recent Readings</Text>
                    {selectedTrend.dataPoints
                        .slice()
                        .reverse()
                        .map((dp, index) => (
                            <View key={index} style={styles.dataRow}>
                                <Text style={styles.dataDate}>
                                    {new Date(dp.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </Text>
                                <Text style={styles.dataValue}>
                                    {dp.value} {dp.unit}
                                </Text>
                                {dp.source && <Text style={styles.dataSource}>{dp.source}</Text>}
                            </View>
                        ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#64748b',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
    disclaimerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fef3c7',
        padding: 12,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
    },
    disclaimerIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    disclaimerText: {
        flex: 1,
        fontSize: 12,
        color: '#92400e',
        lineHeight: 18,
    },
    selectorContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    selectorTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 8,
    },
    selector: {
        flexDirection: 'row',
    },
    selectorButton: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    selectorButtonActive: {
        backgroundColor: '#0ea5e9',
        borderColor: '#0ea5e9',
    },
    selectorButtonText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '500',
    },
    selectorButtonTextActive: {
        color: '#ffffff',
    },
    trendCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 20,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    trendHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    trendTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    trendSubtitle: {
        fontSize: 13,
        color: '#94a3b8',
    },
    currentValueBox: {
        alignItems: 'flex-end',
    },
    currentValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0ea5e9',
    },
    currentLabel: {
        fontSize: 12,
        color: '#94a3b8',
    },
    trendIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    trendIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    trendInfo: {
        flex: 1,
    },
    trendText: {
        fontSize: 16,
        fontWeight: '600',
    },
    trendPercentage: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    normalRangeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
    },
    normalRangeLabel: {
        fontSize: 13,
        color: '#64748b',
        marginRight: 8,
    },
    normalRangeValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    chartContainer: {
        marginBottom: 20,
    },
    chart: {
        position: 'relative',
        marginTop: 10,
    },
    normalRangeBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: '#10b98120',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#10b98140',
    },
    chartLine: {
        position: 'absolute',
        height: 2,
        backgroundColor: '#0ea5e9',
    },
    chartDot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0ea5e9',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    chartLabel: {
        position: 'absolute',
        fontSize: 10,
        color: '#94a3b8',
        width: 40,
        textAlign: 'center',
    },
    insightBox: {
        flexDirection: 'row',
        backgroundColor: '#eff6ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: '#0ea5e9',
    },
    insightIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    insightText: {
        flex: 1,
        fontSize: 14,
        color: '#1e40af',
        lineHeight: 20,
    },
    dataTable: {
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 16,
    },
    dataTableTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 12,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    dataDate: {
        fontSize: 13,
        color: '#475569',
        flex: 1,
    },
    dataValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
        textAlign: 'center',
    },
    dataSource: {
        fontSize: 11,
        color: '#94a3b8',
        flex: 1,
        textAlign: 'right',
    },
});
