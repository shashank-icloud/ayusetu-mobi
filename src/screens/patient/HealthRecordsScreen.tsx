import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { phrService, HealthRecord } from '../../services/phrService';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthRecords'>;

export default function HealthRecordsScreen({ navigation }: Props) {
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', 'prescription', 'lab_report', 'discharge_summary', 'vaccination', 'imaging'];
    const categoryLabels: Record<string, string> = {
        all: 'All Records',
        prescription: '💊 Prescriptions',
        lab_report: '🧪 Lab Reports',
        discharge_summary: '📄 Discharge',
        vaccination: '💉 Vaccinations',
        imaging: '📷 Imaging',
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const data = await phrService.getHealthRecords('12-3456-7890-1234');
            setRecords(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchRecords();
        setRefreshing(false);
    };

    const filteredRecords = selectedCategory === 'all' 
        ? records 
        : records.filter(r => r.type === selectedCategory);

    const getRecordIcon = (type: string) => {
        const icons: Record<string, string> = {
            prescription: '💊',
            lab_report: '🧪',
            discharge_summary: '📄',
            vaccination: '💉',
            imaging: '📷',
            other: '📋',
        };
        return icons[type] || '📋';
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Health Records</Text>
                <TouchableOpacity onPress={() => console.log('Search')}>
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>

            {/* Category Filters */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContainer}
            >
                {categories.map(category => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryChip,
                            selectedCategory === category && styles.categoryChipActive
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryText,
                            selectedCategory === category && styles.categoryTextActive
                        ]}>
                            {categoryLabels[category]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Records List */}
            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading records...</Text>
                    </View>
                ) : filteredRecords.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyText}>No records found</Text>
                        <Text style={styles.emptySubtext}>Your health records will appear here</Text>
                    </View>
                ) : (
                    <View style={styles.recordsList}>
                        {filteredRecords.map(record => (
                            <TouchableOpacity 
                                key={record.id} 
                                style={styles.recordCard}
                                onPress={() => console.log('View record:', record.id)}
                            >
                                <View style={styles.recordIcon}>
                                    <Text style={styles.recordIconText}>{getRecordIcon(record.type)}</Text>
                                </View>
                                <View style={styles.recordContent}>
                                    <Text style={styles.recordTitle}>{record.title}</Text>
                                    <Text style={styles.recordSubtitle}>{record.hospitalName}</Text>
                                    <View style={styles.recordMeta}>
                                        <Text style={styles.recordDate}>📅 {record.date}</Text>
                                        {record.doctorName && (
                                            <Text style={styles.recordDoctor}>👨‍⚕️ {record.doctorName}</Text>
                                        )}
                                    </View>
                                    <View style={styles.tagsContainer}>
                                        {record.tags.map((tag, index) => (
                                            <View key={index} style={styles.tag}>
                                                <Text style={styles.tagText}>{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.downloadButton}>
                                    <Text style={styles.downloadIcon}>📥</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Upload Button */}
            <TouchableOpacity 
                style={styles.uploadButton}
                onPress={() => console.log('Upload record')}
            >
                <Text style={styles.uploadIcon}>📤</Text>
                <Text style={styles.uploadText}>Upload Record</Text>
            </TouchableOpacity>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        fontSize: 28,
        color: '#000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
    },
    searchIcon: {
        fontSize: 22,
    },
    categoryScroll: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    categoryContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: '#000',
    },
    categoryText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
    },
    recordsList: {
        padding: 16,
    },
    recordCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    recordIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    recordIconText: {
        fontSize: 24,
    },
    recordContent: {
        flex: 1,
    },
    recordTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    recordSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    recordMeta: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    recordDate: {
        fontSize: 12,
        color: '#888',
        marginRight: 12,
    },
    recordDoctor: {
        fontSize: 12,
        color: '#888',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 6,
        marginBottom: 4,
    },
    tagText: {
        fontSize: 11,
        color: '#1976d2',
    },
    downloadButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadIcon: {
        fontSize: 24,
    },
    uploadButton: {
        flexDirection: 'row',
        backgroundColor: '#000',
        marginHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 16,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    uploadText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});
