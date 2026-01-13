import React, { useMemo, useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    RefreshControl,
    Alert,
    Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { phrService, HealthRecord, HealthTimeline } from '../../services/phrService';

type Props = NativeStackScreenProps<RootStackParamList, 'HealthRecords'>;

type ViewMode = 'list' | 'timeline';
type GroupBy = 'none' | 'condition' | 'visit' | 'provider' | 'episode';

export default function HealthRecordsScreen({ navigation, route }: Props) {
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [timeline, setTimeline] = useState<HealthTimeline[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const initialView: ViewMode = route.params?.initialView ?? 'list';

    const [viewMode, setViewMode] = useState<ViewMode>(initialView);
    const [groupBy, setGroupBy] = useState<GroupBy>('none');
    const [selectedType, setSelectedType] = useState<string>('all');
    const [unlockedSensitive, setUnlockedSensitive] = useState<Record<string, boolean>>({});

    const typeFilters = useMemo(
        () => [
            'all',
            'opd_prescription',
            'ipd_discharge_summary',
            'lab_report',
            'imaging',
            'vaccination',
            'surgery_note',
            'emergency_visit',
            'dental_record',
            'mental_health_record',
            'other',
        ],
        []
    );

    const typeLabels: Record<string, string> = {
        all: 'All',
        opd_prescription: 'OPD Rx',
        ipd_discharge_summary: 'IPD Discharge',
        lab_report: 'Lab',
        imaging: 'Imaging',
        vaccination: 'Vaccines',
        surgery_note: 'Surgery',
        emergency_visit: 'Emergency',
        dental_record: 'Dental',
        mental_health_record: 'Mental Health',
        other: 'Other',
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const abha = '12-3456-7890-1234';
            const [recordsData, timelineData] = await Promise.all([
                phrService.getHealthRecords(abha),
                phrService.getHealthTimeline(abha),
            ]);
            setRecords(recordsData);
            setTimeline(timelineData);
        } catch (error) {
            console.error('Error fetching PHR data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAll();
        setRefreshing(false);
    };

    const filteredRecords = useMemo(() => {
        const base = selectedType === 'all' ? records : records.filter(r => r.type === selectedType);
        // Keep sensitive records in the list, but gate content unless unlocked.
        return base;
    }, [records, selectedType]);

    const grouped = useMemo(() => {
        const groups: Array<{ key: string; title: string; items: HealthRecord[] }> = [];

        if (groupBy === 'none') {
            return [{ key: 'all', title: 'Records', items: [...filteredRecords].sort((a, b) => b.date.localeCompare(a.date)) }];
        }

        const map = new Map<string, { title: string; items: HealthRecord[] }>();

        const getKey = (r: HealthRecord) => {
            switch (groupBy) {
                case 'condition':
                    return r.conditionName || 'Unknown condition';
                case 'visit':
                    return r.visitId || 'Unknown visit';
                case 'provider':
                    return r.providerName || r.hospitalName || 'Unknown provider';
                case 'episode':
                    return r.episodeTitle || r.episodeId || 'Unknown episode';
                default:
                    return 'Records';
            }
        };

        for (const r of filteredRecords) {
            const k = getKey(r);
            if (!map.has(k)) map.set(k, { title: k, items: [] });
            map.get(k)!.items.push(r);
        }

        const keys = Array.from(map.keys()).sort();
        for (const k of keys) {
            const entry = map.get(k)!;
            entry.items.sort((a, b) => b.date.localeCompare(a.date));
            groups.push({ key: k, title: entry.title, items: entry.items });
        }

        return groups;
    }, [filteredRecords, groupBy]);

    const getRecordIcon = (type: string) => {
        const icons: Record<string, string> = {
            opd_prescription: '💊',
            ipd_discharge_summary: '📄',
            lab_report: '🧪',
            imaging: '📷',
            vaccination: '💉',
            surgery_note: '🩺',
            emergency_visit: '🚑',
            dental_record: '🦷',
            mental_health_record: '🧠',
            other: '📎',
        };
        return icons[type] || '📎';
    };

    const onPressRecord = (record: HealthRecord) => {
        if (record.type === 'mental_health_record' && record.requiresExplicitUnlock && !unlockedSensitive[record.id]) {
            Alert.alert(
                'Sensitive record',
                'This mental health record is marked confidential. Do you want to unlock it for this session?',
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Unlock',
                        style: 'default',
                        onPress: () => setUnlockedSensitive(prev => ({ ...prev, [record.id]: true })),
                    },
                ]
            );
            return;
        }

        // Basic record view (until a detail screen is added)
        Alert.alert(
            'Record Details',
            [
                `Title: ${record.title}`,
                `Type: ${record.type}`,
                `Date: ${record.date}`,
                `Provider: ${record.providerName || record.hospitalName}`,
                record.doctorName ? `Doctor: ${record.doctorName}` : undefined,
                record.conditionName ? `Condition: ${record.conditionName}` : undefined,
                record.episodeTitle ? `Episode: ${record.episodeTitle}` : undefined,
                record.visitId ? `Visit: ${record.visitId}` : undefined,
            ]
                .filter(Boolean)
                .join('\n'),
            [{ text: 'OK' }]
        );
    };

    const onPressOpenDICOM = async (record: HealthRecord) => {
        if (!record.dicomStudyUrl) {
            Alert.alert('No DICOM link', 'This imaging record has no DICOM viewer link.');
            return;
        }

        try {
            const supported = await Linking.canOpenURL(record.dicomStudyUrl);
            if (!supported) {
                Alert.alert('Cannot open link', 'Your device cannot open this DICOM viewer link.');
                return;
            }
            await Linking.openURL(record.dicomStudyUrl);
        } catch (e) {
            console.error('Failed to open DICOM URL:', e);
            Alert.alert('Open failed', 'Unable to open the DICOM viewer link.');
        }
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

            {/* View Mode Toggle */}
            <View style={styles.modeRow}>
                <TouchableOpacity
                    style={[styles.modeChip, viewMode === 'list' && styles.modeChipActive]}
                    onPress={() => setViewMode('list')}
                >
                    <Text style={[styles.modeText, viewMode === 'list' && styles.modeTextActive]}>List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeChip, viewMode === 'timeline' && styles.modeChipActive]}
                    onPress={() => setViewMode('timeline')}
                >
                    <Text style={[styles.modeText, viewMode === 'timeline' && styles.modeTextActive]}>Timeline</Text>
                </TouchableOpacity>

                {viewMode === 'list' && (
                    <View style={styles.groupByRow}>
                        {(['none', 'condition', 'visit', 'provider', 'episode'] as GroupBy[]).map(g => (
                            <TouchableOpacity
                                key={g}
                                style={[styles.groupChip, groupBy === g && styles.groupChipActive]}
                                onPress={() => setGroupBy(g)}
                            >
                                <Text style={[styles.groupText, groupBy === g && styles.groupTextActive]}>
                                    {g === 'none'
                                        ? 'No group'
                                        : g === 'condition'
                                            ? 'Condition'
                                            : g === 'visit'
                                                ? 'Visit'
                                                : g === 'provider'
                                                    ? 'Provider'
                                                    : 'Episode'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Type Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
                contentContainerStyle={styles.categoryContainer}
            >
                {typeFilters.map(t => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.categoryChip, selectedType === t && styles.categoryChipActive]}
                        onPress={() => setSelectedType(t)}
                    >
                        <Text style={[styles.categoryText, selectedType === t && styles.categoryTextActive]}>
                            {typeLabels[t]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Content */}
            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : viewMode === 'timeline' ? (
                    timeline.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyIcon}>📭</Text>
                            <Text style={styles.emptyText}>No timeline events</Text>
                            <Text style={styles.emptySubtext}>Your health timeline will appear here</Text>
                        </View>
                    ) : (
                        <View style={styles.recordsList}>
                            {timeline
                                .slice()
                                .sort((a, b) => b.date.localeCompare(a.date))
                                .map(day => (
                                    <View key={day.date} style={styles.groupSection}>
                                        <Text style={styles.groupTitle}>📅 {day.date}</Text>
                                        {day.events.map(evt => (
                                            <View key={evt.id} style={styles.timelineCard}>
                                                <View style={styles.timelineLeft}>
                                                    <Text style={styles.timelineDot}>•</Text>
                                                </View>
                                                <View style={styles.timelineContent}>
                                                    <Text style={styles.recordTitle}>{evt.title}</Text>
                                                    <Text style={styles.recordSubtitle}>{evt.location}</Text>
                                                    <Text style={styles.timelineDesc}>{evt.description}</Text>
                                                    {!!evt.recordId && (
                                                        <Text style={styles.timelineLink}>Linked record: {evt.recordId}</Text>
                                                    )}
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                        </View>
                    )
                ) : filteredRecords.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyText}>No records found</Text>
                        <Text style={styles.emptySubtext}>Try another filter</Text>
                    </View>
                ) : (
                    <View style={styles.recordsList}>
                        {grouped.map(section => (
                            <View key={section.key} style={styles.groupSection}>
                                {groupBy !== 'none' && (
                                    <Text style={styles.groupTitle}>{section.title}</Text>
                                )}

                                {section.items.map(record => {
                                    const isSensitive =
                                        record.type === 'mental_health_record' &&
                                        record.requiresExplicitUnlock &&
                                        !unlockedSensitive[record.id];

                                    return (
                                        <TouchableOpacity
                                            key={record.id}
                                            style={styles.recordCard}
                                            onPress={() => onPressRecord(record)}
                                            activeOpacity={0.8}
                                        >
                                            <View style={styles.recordIcon}>
                                                <Text style={styles.recordIconText}>{getRecordIcon(record.type)}</Text>
                                            </View>
                                            <View style={styles.recordContent}>
                                                <Text style={styles.recordTitle}>
                                                    {isSensitive ? 'Locked (Sensitive Record)' : record.title}
                                                </Text>
                                                <Text style={styles.recordSubtitle}>
                                                    {record.providerName || record.hospitalName}
                                                </Text>
                                                <View style={styles.recordMeta}>
                                                    <Text style={styles.recordDate}>📅 {record.date}</Text>
                                                    {record.doctorName && (
                                                        <Text style={styles.recordDoctor}>👨‍⚕️ {record.doctorName}</Text>
                                                    )}
                                                </View>

                                                {/* Show grouping metadata (small, responsive) */}
                                                <View style={styles.metaChipsRow}>
                                                    {!!record.conditionName && (
                                                        <View style={styles.metaChip}>
                                                            <Text style={styles.metaChipText}>🩻 {record.conditionName}</Text>
                                                        </View>
                                                    )}
                                                    {!!record.episodeTitle && (
                                                        <View style={styles.metaChip}>
                                                            <Text style={styles.metaChipText}>🧾 {record.episodeTitle}</Text>
                                                        </View>
                                                    )}
                                                </View>

                                                <View style={styles.tagsContainer}>
                                                    {record.tags.slice(0, 4).map((tag, index) => (
                                                        <View key={index} style={styles.tag}>
                                                            <Text style={styles.tagText}>{tag}</Text>
                                                        </View>
                                                    ))}
                                                </View>

                                                {record.type === 'imaging' && !!record.dicomStudyUrl && (
                                                    <TouchableOpacity
                                                        style={styles.dicomButton}
                                                        onPress={() => onPressOpenDICOM(record)}
                                                    >
                                                        <Text style={styles.dicomButtonText}>Open DICOM</Text>
                                                    </TouchableOpacity>
                                                )}

                                                {record.type === 'mental_health_record' && record.sensitivity === 'sensitive' && (
                                                    <Text style={styles.sensitiveHint}>
                                                        Sensitive: requires explicit unlock.
                                                    </Text>
                                                )}
                                            </View>

                                            <TouchableOpacity style={styles.downloadButton} onPress={() => console.log('Download:', record.id)}>
                                                <Text style={styles.downloadIcon}>📥</Text>
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Upload Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={() => console.log('Upload record')}>
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

    modeRow: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 10,
    },
    modeChip: {
        alignSelf: 'flex-start',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        marginBottom: 10,
    },
    modeChipActive: {
        backgroundColor: '#000',
    },
    modeText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
    },
    modeTextActive: {
        color: '#fff',
    },

    groupByRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 2,
    },
    groupChip: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
        marginBottom: 8,
    },
    groupChipActive: {
        backgroundColor: '#111',
    },
    groupText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '600',
    },
    groupTextActive: {
        color: '#fff',
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
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    categoryChipActive: {
        backgroundColor: '#000',
    },
    categoryText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '600',
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
    groupSection: {
        marginBottom: 14,
    },
    groupTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111',
        marginBottom: 10,
        paddingHorizontal: 4,
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
        fontWeight: '700',
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
        flexWrap: 'wrap',
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

    metaChipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 6,
    },
    metaChip: {
        backgroundColor: '#f1f3f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 6,
        marginBottom: 6,
    },
    metaChipText: {
        fontSize: 11,
        color: '#333',
        fontWeight: '600',
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
        fontWeight: '600',
    },

    dicomButton: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#111',
    },
    dicomButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    sensitiveHint: {
        marginTop: 8,
        fontSize: 12,
        color: '#8a6d3b',
        fontWeight: '600',
    },

    downloadButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadIcon: {
        fontSize: 22,
    },

    timelineCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    timelineLeft: {
        width: 20,
        alignItems: 'center',
        paddingTop: 2,
    },
    timelineDot: {
        fontSize: 22,
        color: '#111',
        lineHeight: 22,
    },
    timelineContent: {
        flex: 1,
    },
    timelineDesc: {
        fontSize: 13,
        color: '#333',
        marginTop: 4,
    },
    timelineLink: {
        fontSize: 12,
        color: '#666',
        marginTop: 6,
        fontWeight: '600',
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
        fontWeight: '700',
        color: '#fff',
    },
});
