// Messaging Screen - Category 14
// Secure messaging with doctors and healthcare providers

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { notificationsService } from '../services/notificationsService';
import { Conversation, Message } from '../../backend/types/notifications';

type Props = NativeStackScreenProps<RootStackParamList, 'Messaging'>;

export default function MessagingScreen({ navigation, route }: Props) {
    const conversationId = route.params?.conversationId;
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        loadConversations();
    }, []);

    useEffect(() => {
        if (conversationId) {
            const conv = conversations.find(c => c.id === conversationId);
            if (conv) {
                handleSelectConversation(conv);
            }
        }
    }, [conversationId, conversations]);

    const loadConversations = async () => {
        try {
            const data = await notificationsService.getConversations();
            setConversations(data);

            // Auto-select first conversation if no conversation selected
            if (!selectedConversation && data.length > 0) {
                handleSelectConversation(data[0]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = async (conversation: Conversation) => {
        setSelectedConversation(conversation);

        try {
            const msgs = await notificationsService.getMessages(conversation.id);
            setMessages(msgs);
        } catch (error) {
            Alert.alert('Error', 'Failed to load messages');
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedConversation) return;

        const recipient = selectedConversation.participants.find(
            p => p.userType !== 'patient'
        );

        if (!recipient) return;

        setSending(true);
        try {
            const newMessage = await notificationsService.sendMessage({
                conversationId: selectedConversation.id,
                recipientId: recipient.userId,
                recipientType: recipient.userType,
                content: messageText.trim(),
            });

            setMessages(prev => [...prev, newMessage]);
            setMessageText('');
        } catch (error) {
            Alert.alert('Error', 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const getTimeDisplay = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / 3600000);

        if (hours < 24) {
            return date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        return date.toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
        });
    };

    const renderConversationItem = (conversation: Conversation) => {
        const otherParticipant = conversation.participants.find(
            p => p.userType !== 'patient'
        );

        return (
            <TouchableOpacity
                key={conversation.id}
                style={[
                    styles.conversationItem,
                    selectedConversation?.id === conversation.id && styles.conversationItemActive,
                ]}
                onPress={() => handleSelectConversation(conversation)}
            >
                <View style={styles.conversationHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {otherParticipant?.name.charAt(0) || '?'}
                        </Text>
                    </View>
                    <View style={styles.conversationInfo}>
                        <View style={styles.conversationTopRow}>
                            <Text style={styles.conversationName} numberOfLines={1}>
                                {otherParticipant?.name || 'Unknown'}
                            </Text>
                            {conversation.lastMessage && (
                                <Text style={styles.conversationTime}>
                                    {getTimeDisplay(conversation.lastMessage.sentAt)}
                                </Text>
                            )}
                        </View>
                        {otherParticipant?.hospital && (
                            <Text style={styles.conversationHospital} numberOfLines={1}>
                                {otherParticipant.hospital}
                            </Text>
                        )}
                        {conversation.lastMessage && (
                            <Text style={styles.conversationLastMessage} numberOfLines={1}>
                                {conversation.lastMessage.content}
                            </Text>
                        )}
                    </View>
                </View>
                {conversation.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>{conversation.unreadCount}</Text>
                    </View>
                )}
                {conversation.isPinned && (
                    <Text style={styles.pinnedIcon}>📌</Text>
                )}
            </TouchableOpacity>
        );
    };

    const renderMessage = (message: Message) => {
        const isOwnMessage = message.senderType === 'patient';

        return (
            <View
                key={message.id}
                style={[
                    styles.messageContainer,
                    isOwnMessage ? styles.messageContainerOwn : styles.messageContainerOther,
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isOwnMessage ? styles.messageBubbleOwn : styles.messageBubbleOther,
                    ]}
                >
                    {!isOwnMessage && (
                        <Text style={styles.messageSender}>{message.senderName}</Text>
                    )}
                    <Text
                        style={[
                            styles.messageText,
                            isOwnMessage ? styles.messageTextOwn : styles.messageTextOther,
                        ]}
                    >
                        {message.content}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text
                            style={[
                                styles.messageTime,
                                isOwnMessage ? styles.messageTimeOwn : styles.messageTimeOther,
                            ]}
                        >
                            {getTimeDisplay(message.sentAt)}
                        </Text>
                        {isOwnMessage && message.status === 'read' && (
                            <Text style={styles.readStatus}>✓✓</Text>
                        )}
                        {isOwnMessage && message.status === 'delivered' && (
                            <Text style={styles.deliveredStatus}>✓✓</Text>
                        )}
                        {isOwnMessage && message.status === 'sent' && (
                            <Text style={styles.sentStatus}>✓</Text>
                        )}
                    </View>
                    {message.isEncrypted && (
                        <Text style={styles.encryptedBadge}>🔒 Encrypted</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.container}>
                {/* Conversations List */}
                <View style={styles.conversationsList}>
                    <View style={styles.conversationsHeader}>
                        <Text style={styles.conversationsTitle}>Messages</Text>
                        <Text style={styles.conversationsSubtitle}>
                            {conversations.reduce((sum, c) => sum + c.unreadCount, 0)} unread
                        </Text>
                    </View>
                    <ScrollView style={styles.conversationsScroll}>
                        {loading ? (
                            <Text style={styles.loadingText}>Loading conversations...</Text>
                        ) : conversations.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>💬</Text>
                                <Text style={styles.emptyText}>No conversations yet</Text>
                            </View>
                        ) : (
                            conversations.map(renderConversationItem)
                        )}
                    </ScrollView>
                </View>

                {/* Messages Panel */}
                {selectedConversation ? (
                    <View style={styles.messagesPanel}>
                        {/* Chat Header */}
                        <View style={styles.chatHeader}>
                            <View>
                                <Text style={styles.chatHeaderName}>
                                    {selectedConversation.participants.find(p => p.userType !== 'patient')?.name}
                                </Text>
                                {selectedConversation.subject && (
                                    <Text style={styles.chatHeaderSubject}>
                                        {selectedConversation.subject}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.encryptionBadge}>
                                <Text style={styles.encryptionIcon}>🔒</Text>
                                <Text style={styles.encryptionText}>End-to-end encrypted</Text>
                            </View>
                        </View>

                        {/* Messages */}
                        <ScrollView
                            style={styles.messagesScroll}
                            contentContainerStyle={styles.messagesContent}
                        >
                            {messages.map(renderMessage)}
                        </ScrollView>

                        {/* Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={messageText}
                                onChangeText={setMessageText}
                                placeholder="Type a message..."
                                placeholderTextColor="#999"
                                multiline
                                maxLength={1000}
                            />
                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    (!messageText.trim() || sending) && styles.sendButtonDisabled,
                                ]}
                                onPress={handleSendMessage}
                                disabled={!messageText.trim() || sending}
                            >
                                <Text style={styles.sendButtonText}>➤</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.noConversationSelected}>
                        <Text style={styles.noConversationIcon}>💬</Text>
                        <Text style={styles.noConversationText}>
                            Select a conversation to start messaging
                        </Text>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
    },
    conversationsList: {
        width: '35%',
        backgroundColor: '#fff',
        borderRightWidth: 1,
        borderRightColor: '#e0e0e0',
    },
    conversationsHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    conversationsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    conversationsSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    conversationsScroll: {
        flex: 1,
    },
    conversationItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        position: 'relative',
    },
    conversationItemActive: {
        backgroundColor: '#e3f2fd',
    },
    conversationHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    conversationInfo: {
        flex: 1,
    },
    conversationTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    conversationName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    conversationTime: {
        fontSize: 11,
        color: '#999',
    },
    conversationHospital: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    conversationLastMessage: {
        fontSize: 13,
        color: '#999',
    },
    unreadBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#2196f3',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    pinnedIcon: {
        position: 'absolute',
        top: 16,
        right: 16,
        fontSize: 14,
    },
    messagesPanel: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    chatHeader: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatHeaderName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    chatHeaderSubject: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    encryptionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    encryptionIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    encryptionText: {
        fontSize: 11,
        color: '#4caf50',
    },
    messagesScroll: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 16,
    },
    messageContainerOwn: {
        alignItems: 'flex-end',
    },
    messageContainerOther: {
        alignItems: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    messageBubbleOwn: {
        backgroundColor: '#2196f3',
        borderBottomRightRadius: 4,
    },
    messageBubbleOther: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    messageSender: {
        fontSize: 12,
        fontWeight: '600',
        color: '#2196f3',
        marginBottom: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    messageTextOwn: {
        color: '#fff',
    },
    messageTextOther: {
        color: '#333',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    messageTime: {
        fontSize: 11,
    },
    messageTimeOwn: {
        color: '#e3f2fd',
    },
    messageTimeOther: {
        color: '#999',
    },
    readStatus: {
        fontSize: 12,
        color: '#e3f2fd',
    },
    deliveredStatus: {
        fontSize: 12,
        color: '#e3f2fd',
    },
    sentStatus: {
        fontSize: 12,
        color: '#e3f2fd',
    },
    encryptedBadge: {
        fontSize: 10,
        color: '#e3f2fd',
        marginTop: 4,
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
    noConversationSelected: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noConversationIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    noConversationText: {
        fontSize: 16,
        color: '#666',
    },
    loadingText: {
        padding: 20,
        textAlign: 'center',
        color: '#666',
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
});
