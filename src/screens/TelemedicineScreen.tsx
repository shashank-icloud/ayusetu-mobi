// Telemedicine Screen - Category 16
// ABDM-compliant video/audio consultations with doctors

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
import {
    Doctor,
    TelemedicineConsultation,
    ConsultationHistory,
    TELEMEDICINE_DISCLAIMER,
} from '../../backend/types/futureReady';

type Props = NativeStackScreenProps<RootStackParamList, 'Telemedicine'>;

export default function TelemedicineScreen({ navigation }: Props) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [history, setHistory] = useState<ConsultationHistory | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDisclaimer, setShowDisclaimer] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    useEffect(() => {
        loadData();
    }, [selectedSpecialization]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [doctorsData, historyData] = await Promise.all([
                futureReadyService.getDoctors(selectedSpecialization || undefined),
                futureReadyService.getConsultationHistory('user-123'),
            ]);
            setDoctors(doctorsData);
            setHistory(historyData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleBookConsultation = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setBookingModalVisible(true);
    };

    const confirmBooking = async (date: string, time: string, symptoms: string) => {
        if (!selectedDoctor) return;

        try {
            const consultation = await futureReadyService.bookConsultation({
                doctorId: selectedDoctor.id,
                patientId: 'user-123',
                type: 'video',
                scheduledDate: date,
                scheduledTime: time,
                symptoms,
                urgency: 'routine',
            });
            
            Alert.alert(
                'Booking Confirmed',
                `Your consultation with ${selectedDoctor.name} is scheduled for ${date} at ${time}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setBookingModalVisible(false);
                            loadData();
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to book consultation');
        }
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const specializations = ['General Physician', 'Cardiologist', 'Endocrinologist', 'Dermatologist', 'Pediatrician'];

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
                        <Text style={styles.disclaimerTitle}>⚠️ Telemedicine Notice</Text>
                        <ScrollView style={styles.disclaimerScroll}>
                            <Text style={styles.disclaimerText}>{TELEMEDICINE_DISCLAIMER}</Text>
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

            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search doctors or specialization..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            {/* Specialization Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
            >
                <TouchableOpacity
                    style={[styles.filterChip, !selectedSpecialization && styles.filterChipActive]}
                    onPress={() => setSelectedSpecialization(null)}
                >
                    <Text style={[styles.filterChipText, !selectedSpecialization && styles.filterChipTextActive]}>
                        All
                    </Text>
                </TouchableOpacity>
                {specializations.map((spec) => (
                    <TouchableOpacity
                        key={spec}
                        style={[styles.filterChip, selectedSpecialization === spec && styles.filterChipActive]}
                        onPress={() => setSelectedSpecialization(spec)}
                    >
                        <Text style={[styles.filterChipText, selectedSpecialization === spec && styles.filterChipTextActive]}>
                            {spec}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.content}>
                {/* Consultation History Summary */}
                {history && (
                    <View style={styles.historySection}>
                        <Text style={styles.sectionTitle}>Your Consultations</Text>
                        <View style={styles.historyCards}>
                            <View style={styles.historyCard}>
                                <Text style={styles.historyValue}>{history.upcomingCount}</Text>
                                <Text style={styles.historyLabel}>Upcoming</Text>
                            </View>
                            <View style={styles.historyCard}>
                                <Text style={styles.historyValue}>{history.completedCount}</Text>
                                <Text style={styles.historyLabel}>Completed</Text>
                            </View>
                            <View style={styles.historyCard}>
                                <Text style={styles.historyValue}>{history.totalConsultations}</Text>
                                <Text style={styles.historyLabel}>Total</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Doctors List */}
                <View style={styles.doctorsSection}>
                    <Text style={styles.sectionTitle}>Available Doctors</Text>
                    
                    {loading ? (
                        <ActivityIndicator size="large" color="#2196f3" style={{ marginTop: 20 }} />
                    ) : filteredDoctors.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>👨‍⚕️</Text>
                            <Text style={styles.emptyText}>No doctors found</Text>
                        </View>
                    ) : (
                        filteredDoctors.map((doctor) => (
                            <View key={doctor.id} style={styles.doctorCard}>
                                <View style={styles.doctorHeader}>
                                    <View style={styles.doctorAvatar}>
                                        <Text style={styles.doctorAvatarText}>
                                            {doctor.name.charAt(0)}
                                        </Text>
                                    </View>
                                    <View style={styles.doctorInfo}>
                                        <View style={styles.doctorTitleRow}>
                                            <Text style={styles.doctorName}>{doctor.name}</Text>
                                            {doctor.isABDMVerified && (
                                                <Text style={styles.verifiedBadge}>✓ ABDM</Text>
                                            )}
                                        </View>
                                        <Text style={styles.doctorSpecialization}>
                                            {doctor.specialization}
                                        </Text>
                                        {doctor.hospital && (
                                            <Text style={styles.doctorHospital}>
                                                🏥 {doctor.hospital}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <View style={styles.doctorDetails}>
                                    <View style={styles.doctorRating}>
                                        <Text style={styles.ratingStars}>⭐</Text>
                                        <Text style={styles.ratingText}>
                                            {doctor.rating.toFixed(1)} ({doctor.reviewCount.toLocaleString()} reviews)
                                        </Text>
                                    </View>
                                    <Text style={styles.doctorExperience}>
                                        {doctor.experience} years experience
                                    </Text>
                                </View>

                                <View style={styles.doctorQualifications}>
                                    {doctor.qualifications.map((qual, index) => (
                                        <View key={index} style={styles.qualificationBadge}>
                                            <Text style={styles.qualificationText}>{qual}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.doctorLanguages}>
                                    <Text style={styles.languagesLabel}>Languages:</Text>
                                    <Text style={styles.languagesText}>{doctor.languages.join(', ')}</Text>
                                </View>

                                <View style={styles.doctorFooter}>
                                    <View style={styles.feeContainer}>
                                        <Text style={styles.feeLabel}>Consultation Fee</Text>
                                        <Text style={styles.feeAmount}>₹{doctor.consultationFee}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.bookButton}
                                        onPress={() => handleBookConsultation(doctor)}
                                    >
                                        <Text style={styles.bookButtonText}>Book Now</Text>
                                    </TouchableOpacity>
                                </View>

                                {doctor.availableSlots && doctor.availableSlots.length > 0 && (
                                    <View style={styles.slotsPreview}>
                                        <Text style={styles.slotsLabel}>Next available:</Text>
                                        <Text style={styles.slotsText}>
                                            {new Date(doctor.availableSlots[0].date).toLocaleDateString('en-IN')} • {doctor.availableSlots[0].slots.slice(0, 2).join(', ')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))
                    )}
                </View>

                {/* ABDM Compliance Notice */}
                <View style={styles.complianceNotice}>
                    <Text style={styles.complianceIcon}>🔒</Text>
                    <Text style={styles.complianceText}>
                        All consultations are ABDM compliant with end-to-end encryption. Your consultation data is securely stored in your health records.
                    </Text>
                </View>
            </ScrollView>

            {/* Booking Modal */}
            <Modal
                visible={bookingModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setBookingModalVisible(false)}
            >
                <View style={styles.bookingModalOverlay}>
                    <View style={styles.bookingModal}>
                        {selectedDoctor && (
                            <>
                                <Text style={styles.bookingTitle}>Book Consultation</Text>
                                <Text style={styles.bookingDoctorName}>{selectedDoctor.name}</Text>
                                <Text style={styles.bookingSpecialization}>{selectedDoctor.specialization}</Text>
                                
                                <View style={styles.bookingForm}>
                                    <Text style={styles.formLabel}>Select Date & Time</Text>
                                    {selectedDoctor.availableSlots && selectedDoctor.availableSlots.length > 0 && (
                                        <View style={styles.slotsContainer}>
                                            {selectedDoctor.availableSlots[0].slots.slice(0, 4).map((slot, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.slotChip}
                                                    onPress={() => {
                                                        Alert.prompt(
                                                            'Describe Symptoms',
                                                            'Please describe your symptoms briefly',
                                                            (symptoms) => {
                                                                if (symptoms) {
                                                                    confirmBooking(
                                                                        selectedDoctor.availableSlots![0].date,
                                                                        slot,
                                                                        symptoms
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <Text style={styles.slotChipText}>{slot}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                    
                                    <View style={styles.feeRow}>
                                        <Text style={styles.feeRowLabel}>Consultation Fee:</Text>
                                        <Text style={styles.feeRowAmount}>₹{selectedDoctor.consultationFee}</Text>
                                    </View>
                                </View>

                                <View style={styles.bookingActions}>
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => setBookingModalVisible(false)}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    searchSection: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
    },
    filterScroll: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#2196f3',
    },
    filterChipText: {
        fontSize: 14,
        color: '#666',
    },
    filterChipTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    historySection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    historyCards: {
        flexDirection: 'row',
        gap: 12,
    },
    historyCard: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    historyValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2196f3',
        marginBottom: 4,
    },
    historyLabel: {
        fontSize: 13,
        color: '#666',
    },
    doctorsSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
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
    doctorCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    doctorHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    doctorAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#2196f3',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    doctorAvatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    doctorInfo: {
        flex: 1,
    },
    doctorTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    doctorName: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    verifiedBadge: {
        backgroundColor: '#4caf50',
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    doctorSpecialization: {
        fontSize: 14,
        color: '#2196f3',
        marginBottom: 4,
    },
    doctorHospital: {
        fontSize: 13,
        color: '#666',
    },
    doctorDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    doctorRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingStars: {
        fontSize: 14,
        marginRight: 4,
    },
    ratingText: {
        fontSize: 13,
        color: '#666',
    },
    doctorExperience: {
        fontSize: 13,
        color: '#666',
    },
    doctorQualifications: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 12,
    },
    qualificationBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    qualificationText: {
        fontSize: 12,
        color: '#1976d2',
        fontWeight: '600',
    },
    doctorLanguages: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    languagesLabel: {
        fontSize: 13,
        color: '#999',
        marginRight: 6,
    },
    languagesText: {
        fontSize: 13,
        color: '#666',
    },
    doctorFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    feeContainer: {
        flex: 1,
    },
    feeLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    feeAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    bookButton: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    slotsPreview: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    slotsLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    slotsText: {
        fontSize: 13,
        color: '#333',
    },
    complianceNotice: {
        margin: 16,
        padding: 16,
        backgroundColor: '#e8f5e9',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    complianceIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    complianceText: {
        flex: 1,
        fontSize: 13,
        color: '#388e3c',
        lineHeight: 20,
    },
    bookingModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bookingModal: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    bookingTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    bookingDoctorName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2196f3',
        marginBottom: 4,
    },
    bookingSpecialization: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    bookingForm: {
        marginBottom: 20,
    },
    formLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    slotsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    slotChip: {
        backgroundColor: '#2196f3',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    slotChipText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    feeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    feeRowLabel: {
        fontSize: 15,
        color: '#666',
    },
    feeRowAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    bookingActions: {
        gap: 12,
    },
    cancelButton: {
        padding: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});
