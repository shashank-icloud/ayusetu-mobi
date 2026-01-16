// AI Health Assistant Screen - Category 16
// Non-diagnostic AI insights and health trends analysis

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { futureReadyService } from '../services/futureReadyService';
import { AIInsight, AIResponse, AI_HEALTH_DISCLAIMER } from '../../backend/types/futureReady';

type Props = NativeStackScreenProps<RootStackParamList, 'AIAssistant'>;

export default function AIAssistantScreen({ navigation }: Props) {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [query, setQuery] = useState('');
    const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'ai'; content: string; timestamp: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [asking, setAsking] = useState(false);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        try {
            const data = await futureReadyService.getAIInsights('user-123');
            setInsights(data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load AI insights');
        } finally {
            setLoading(false);
        }
    };

    const handleAskAI = async () => {
        if (!query.trim()) return;

        const userMessage = query.trim();
        setQuery('');

        setChatHistory(prev => [...prev, {
            type: 'user',
            content: userMessage,
            timestamp: new Date().toISOString(),
        }]);

        setAsking(true);
        try {
            const response = await futureReadyService.askAI({ question: userMessage });
            setChatHistory(prev => [...prev, {
                type: 'ai',
                content: response.answer,
                timestamp: response.timestamp,
            }]);
        } catch (error) {
            Alert.alert('Error', 'Failed to get AI response');
        } finally {
            setAsking(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return '#f44336';
            case 'high': return '#ff9800';
            case 'medium': return '#2196f3';
            case 'low': return '#4caf50';
            default: return '#999';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'trend': return '📈';
            case 'recommendation': return '💡';
            case 'alert': return '⚠️';
            case 'educational': return '📚';
            default: return 'ℹ️';
        }
    };

    return (
        <View style={styles.container}>
            {/* Disclaimer Modal */}
            <Modal
                visible={showDisclaimer}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDisclaimer(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.disclaimerModal}>
                        <Text style={styles.disclaimerTitle}>⚠️ Important Notice</Text>
                        <ScrollView style={styles.disclaimerScroll}>
                            <Text style={styles.disclaimerText}>{AI_HEALTH_DISCLAIMER}</Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.disclaimerButton}
                            onPress={() => setShowDisclaimer(false)}
                        >
                            <Text style={styles.disclaimerButtonText}>I Understand</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <ScrollView style={styles.content}>
                {/* AI Insights Section */}
                <View style={styles.insightsSection}>
                    <Text style={styles.sectionTitle}>🤖 AI Health Insights</Text>
                    <Text style={styles.sectionSubtitle}>
                        Personalized insights based on your health data
                    </Text>

                    {loading ? (
                        <ActivityIndicator size="large" color="#2196f3" style={{ marginTop: 20 }} />
                    ) : insights.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>💭</Text>
                            <Text style={styles.emptyText}>No insights available yet</Text>
                        </View>
                    ) : (
                        insights.map((insight) => (
                            <View
                                key={insight.id}
                                style={[
                                    styles.insightCard,
                                    { borderLeftColor: getPriorityColor(insight.priority) }
                                ]}
                            >
                                <View style={styles.insightHeader}>
                                    <Text style={styles.insightIcon}>{getTypeIcon(insight.type)}</Text>
                                    <View style={styles.insightHeaderText}>
                                        <Text style={styles.insightTitle}>{insight.title}</Text>
                                        <Text style={styles.insightTime}>
                                            {new Date(insight.generatedAt).toLocaleDateString('en-IN')}
                                        </Text>
                                    </View>
                                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(insight.priority) }]}>
                                        <Text style={styles.priorityBadgeText}>{insight.priority.toUpperCase()}</Text>
                                    </View>
                                </View>

                                <Text style={styles.insightDescription}>{insight.description}</Text>

                                {insight.recommendation && (
                                    <View style={styles.recommendationBox}>
                                        <Text style={styles.recommendationLabel}>💡 Recommendation:</Text>
                                        <Text style={styles.recommendationText}>{insight.recommendation}</Text>
                                    </View>
                                )}

                                {insight.actionItems && insight.actionItems.length > 0 && (
                                    <View style={styles.actionItemsBox}>
                                        <Text style={styles.actionItemsLabel}>Action Items:</Text>
                                        {insight.actionItems.map((item, index) => (
                                            <Text key={index} style={styles.actionItem}>
                                                • {item}
                                            </Text>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>

                {/* Chat with AI Section */}
                <View style={styles.chatSection}>
                    <Text style={styles.sectionTitle}>💬 Ask AI Assistant</Text>
                    <Text style={styles.sectionSubtitle}>
                        Ask questions about your health trends (not for diagnosis)
                    </Text>

                    <View style={styles.chatContainer}>
                        {chatHistory.length === 0 ? (
                            <View style={styles.chatEmpty}>
                                <Text style={styles.chatEmptyIcon}>💬</Text>
                                <Text style={styles.chatEmptyText}>Start a conversation with the AI assistant</Text>
                                <View style={styles.suggestedQuestions}>
                                    <Text style={styles.suggestedQuestionsTitle}>Suggested questions:</Text>
                                    {[
                                        'How is my blood pressure trending?',
                                        'What can I do to improve my sleep?',
                                        'Am I getting enough physical activity?',
                                    ].map((q, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={styles.suggestedQuestion}
                                            onPress={() => setQuery(q)}
                                        >
                                            <Text style={styles.suggestedQuestionText}>{q}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ) : (
                            <ScrollView style={styles.chatMessages}>
                                {chatHistory.map((message, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.chatMessage,
                                            message.type === 'user' ? styles.chatMessageUser : styles.chatMessageAI,
                                        ]}
                                    >
                                        <Text style={styles.chatMessageText}>{message.content}</Text>
                                        <Text style={styles.chatMessageTime}>
                                            {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </Text>
                                    </View>
                                ))}
                                {asking && (
                                    <View style={styles.typingIndicator}>
                                        <Text style={styles.typingText}>AI is thinking...</Text>
                                        <ActivityIndicator size="small" color="#2196f3" />
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </View>
                </View>

                {/* Disclaimer Notice */}
                <View style={styles.disclaimerNotice}>
                    <Text style={styles.disclaimerNoticeIcon}>⚠️</Text>
                    <Text style={styles.disclaimerNoticeText}>
                        This AI assistant provides informational insights only. Always consult qualified healthcare professionals for medical advice.
                    </Text>
                </View>
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Ask about your health trends..."
                    placeholderTextColor="#999"
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!query.trim() || asking) && styles.sendButtonDisabled]}
                    onPress={handleAskAI}
                    disabled={!query.trim() || asking}
                >
                    <Text style={styles.sendButtonText}>➤</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    disclaimerModal: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
        width: '100%',
    },
    disclaimerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f44336',
        marginBottom: 16,
        textAlign: 'center',
    },
    disclaimerScroll: {
        maxHeight: 400,
        marginBottom: 16,
    },
    disclaimerText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
    },
    disclaimerButton: {
        backgroundColor: '#2196f3',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    disclaimerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    insightsSection: {
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
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
    },
    insightCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    insightIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    insightHeaderText: {
        flex: 1,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    insightTime: {
        fontSize: 12,
        color: '#999',
    },
    priorityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    priorityBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    insightDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
    recommendationBox: {
        backgroundColor: '#e3f2fd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    recommendationLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976d2',
        marginBottom: 6,
    },
    recommendationText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    actionItemsBox: {
        backgroundColor: '#fff3e0',
        padding: 12,
        borderRadius: 8,
    },
    actionItemsLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#f57c00',
        marginBottom: 8,
    },
    actionItem: {
        fontSize: 13,
        color: '#555',
        marginBottom: 4,
        lineHeight: 18,
    },
    chatSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    chatContainer: {
        minHeight: 200,
        maxHeight: 400,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    chatEmpty: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    chatEmptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    chatEmptyText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    suggestedQuestions: {
        width: '100%',
    },
    suggestedQuestionsTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    suggestedQuestion: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    suggestedQuestionText: {
        fontSize: 13,
        color: '#2196f3',
    },
    chatMessages: {
        flex: 1,
    },
    chatMessage: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        maxWidth: '80%',
    },
    chatMessageUser: {
        backgroundColor: '#2196f3',
        alignSelf: 'flex-end',
    },
    chatMessageAI: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    chatMessageText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    chatMessageTime: {
        fontSize: 11,
        color: '#999',
        marginTop: 6,
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 8,
    },
    typingText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
    disclaimerNotice: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fff3e0',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    disclaimerNoticeIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    disclaimerNoticeText: {
        flex: 1,
        fontSize: 13,
        color: '#e65100',
        lineHeight: 20,
    },
    inputContainer: {
        backgroundColor: '#fff',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 20,
    },
});
