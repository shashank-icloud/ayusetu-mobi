import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { appointmentsService, Doctor, Hospital, Lab, TimeSlot, AppointmentBookingRequest, AppointmentBookingResponse, LabTest } from '../services/appointmentsService';

type Props = NativeStackScreenProps<RootStackParamList, 'BookAppointment'>;

type AppointmentType = 'doctor' | 'lab' | 'hospital';

const BookAppointmentScreen: React.FC<Props> = ({ navigation, route }) => {
    const [step, setStep] = useState(1); // 1=type, 2=search, 3=provider, 4=slot, 5=confirm
    const [appointmentType, setAppointmentType] = useState<AppointmentType>('doctor');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Provider lists
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [labs, setLabs] = useState<Lab[]>([]);
    const [labTests, setLabTests] = useState<LabTest[]>([]);

    // Selections
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [selectedLab, setSelectedLab] = useState<Lab | null>(null);
    const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
    const [homeCollection, setHomeCollection] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    // Patient details
    const [patientName, setPatientName] = useState('John Doe');
    const [patientAge, setPatientAge] = useState('35');
    const [patientContact, setPatientContact] = useState('+91 98765 43210');

    useEffect(() => {
        // Auto-select type if passed via route params
        if (route.params?.type) {
            setAppointmentType(route.params.type as AppointmentType);
            setStep(2);
        }
    }, [route.params]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (appointmentType === 'doctor') {
                const result = await appointmentsService.searchDoctors({
                    specialization: searchQuery,
                });
                setDoctors(result);
            } else if (appointmentType === 'hospital') {
                const result = await appointmentsService.searchHospitals(searchQuery);
                setHospitals(result);
            } else if (appointmentType === 'lab') {
                const result = await appointmentsService.searchLabs(searchQuery);
                setLabs(result);
                const tests = await appointmentsService.getLabTests(selectedLab?.id || '');
                setLabTests(tests);
            }
            setStep(3);
        } catch (error) {
            Alert.alert('Error', 'Failed to search. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDoctorSelect = async (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setLoading(true);
        try {
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            setSelectedDate(dateStr);
            const slots = await appointmentsService.getDoctorAvailability(doctor.id, dateStr);
            setAvailableSlots(slots);
            setStep(4);
        } catch (error) {
            Alert.alert('Error', 'Failed to load availability');
        } finally {
            setLoading(false);
        }
    };

    const handleHospitalSelect = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        setStep(4);
        // Generate time slots for hospital
        const slots: TimeSlot[] = [];
        for (let hour = 9; hour < 17; hour++) {
            slots.push({
                id: `slot-${hour}`,
                startTime: `${hour}:00`,
                endTime: `${hour + 1}:00`,
                isAvailable: Math.random() > 0.3,
                consultationType: 'both' as const,
            });
        }
        setAvailableSlots(slots);
    };

    const handleLabSelect = (lab: Lab) => {
        setSelectedLab(lab);
        setStep(4);
    };

    const toggleTestSelection = (test: LabTest) => {
        if (selectedTests.find(t => t.id === test.id)) {
            setSelectedTests(selectedTests.filter(t => t.id !== test.id));
        } else {
            setSelectedTests([...selectedTests, test]);
        }
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        if (slot.isAvailable) {
            setSelectedSlot(slot);
            setStep(5);
        }
    };

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            let request: AppointmentBookingRequest;

            if (appointmentType === 'doctor' && selectedDoctor && selectedSlot) {
                request = {
                    type: 'doctor',
                    doctorId: selectedDoctor.id,
                    slotId: selectedSlot.id,
                    consultationType: 'in-person',
                };
            } else if (appointmentType === 'hospital' && selectedHospital && selectedSlot) {
                request = {
                    type: 'hospital_opd',
                    hospitalId: selectedHospital.id,
                    slotId: selectedSlot.id,
                    consultationType: 'in-person',
                };
            } else if (appointmentType === 'lab' && selectedLab && selectedTests.length > 0) {
                request = {
                    type: 'lab',
                    labId: selectedLab.id,
                    testIds: selectedTests.map(t => t.id),
                    slotId: selectedSlot?.id || '',
                    consultationType: 'in-person',
                    homeCollection,
                };
            } else {
                Alert.alert('Error', 'Please complete all required fields');
                setLoading(false);
                return;
            }

            const response = await appointmentsService.bookAppointment(request);

            Alert.alert(
                'Success!',
                `Appointment booked successfully!\n\nAppointment ID: ${response.appointmentId}\n${response.message}
                }`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Appointments'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            {[1, 2, 3, 4, 5].map(num => (
                <View key={num} style={styles.stepItem}>
                    <View style={[styles.stepCircle, step >= num && styles.stepCircleActive]}>
                        <Text style={[styles.stepNumber, step >= num && styles.stepNumberActive]}>
                            {num}
                        </Text>
                    </View>
                    {num < 5 && <View style={[styles.stepLine, step > num && styles.stepLineActive]} />}
                </View>
            ))}
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Appointment Type</Text>

            <TouchableOpacity
                style={[styles.typeCard, appointmentType === 'doctor' && styles.typeCardSelected]}
                onPress={() => setAppointmentType('doctor')}
            >
                <Text style={styles.typeEmoji}>👨‍⚕️</Text>
                <Text style={styles.typeTitle}>Doctor Consultation</Text>
                <Text style={styles.typeDesc}>Book appointment with specialist doctors</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.typeCard, appointmentType === 'lab' && styles.typeCardSelected]}
                onPress={() => setAppointmentType('lab')}
            >
                <Text style={styles.typeEmoji}>🔬</Text>
                <Text style={styles.typeTitle}>Lab Tests</Text>
                <Text style={styles.typeDesc}>Book diagnostic tests & health checkups</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.typeCard, appointmentType === 'hospital' && styles.typeCardSelected]}
                onPress={() => setAppointmentType('hospital')}
            >
                <Text style={styles.typeEmoji}>🏥</Text>
                <Text style={styles.typeTitle}>Hospital OPD</Text>
                <Text style={styles.typeDesc}>Schedule hospital outpatient visits</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={() => setStep(2)}>
                <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
                Search {appointmentType === 'doctor' ? 'by Specialty' : appointmentType === 'lab' ? 'Labs' : 'Hospitals'}
            </Text>

            <TextInput
                style={styles.searchInput}
                placeholder={
                    appointmentType === 'doctor'
                        ? 'e.g., Cardiologist, Dermatologist'
                        : appointmentType === 'lab'
                            ? 'e.g., City Lab, Apollo Diagnostics'
                            : 'e.g., Apollo Hospital, AIIMS'
                }
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearch}
                disabled={loading || !searchQuery.trim()}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.searchButtonText}>Search</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    const renderStep3 = () => {
        if (appointmentType === 'doctor') {
            return (
                <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Select Doctor</Text>
                    <ScrollView>
                        {doctors.map(doctor => (
                            <TouchableOpacity
                                key={doctor.id}
                                style={styles.providerCard}
                                onPress={() => handleDoctorSelect(doctor)}
                            >
                                <Text style={styles.providerName}>{doctor.name}</Text>
                                <Text style={styles.providerSpecialty}>{doctor.specialization}</Text>
                                <Text style={styles.providerQualification}>{doctor.qualification}</Text>
                                <Text style={styles.providerExperience}>{doctor.experience} years experience</Text>
                                <Text style={styles.providerFee}>₹{doctor.consultationFee}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            );
        } else if (appointmentType === 'hospital') {
            return (
                <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Select Hospital</Text>
                    <ScrollView>
                        {hospitals.map(hospital => (
                            <TouchableOpacity
                                key={hospital.id}
                                style={styles.providerCard}
                                onPress={() => handleHospitalSelect(hospital)}
                            >
                                <Text style={styles.providerName}>{hospital.name}</Text>
                                <Text style={styles.providerLocation}>{hospital.address}</Text>
                                <Text style={styles.providerContact}>{hospital.phone}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            );
        } else {
            return (
                <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>Select Lab & Tests</Text>

                    <Text style={styles.sectionLabel}>Diagnostic Lab</Text>
                    {labs.map(lab => (
                        <TouchableOpacity
                            key={lab.id}
                            style={[styles.labCard, selectedLab?.id === lab.id && styles.labCardSelected]}
                            onPress={() => handleLabSelect(lab)}
                        >
                            <Text style={styles.providerName}>{lab.name}</Text>
                            <Text style={styles.providerLocation}>{lab.address}</Text>
                        </TouchableOpacity>
                    ))}

                    {selectedLab && (
                        <>
                            <Text style={styles.sectionLabel}>Select Tests</Text>
                            {labTests.map(test => (
                                <TouchableOpacity
                                    key={test.id}
                                    style={[styles.testCard, selectedTests.find(t => t.id === test.id) && styles.testCardSelected]}
                                    onPress={() => toggleTestSelection(test)}
                                >
                                    <Text style={styles.testName}>{test.name}</Text>
                                    <Text style={styles.testPrice}>₹{test.price}</Text>
                                </TouchableOpacity>
                            ))}

                            <View style={styles.homeCollectionContainer}>
                                <TouchableOpacity
                                    style={styles.checkbox}
                                    onPress={() => setHomeCollection(!homeCollection)}
                                >
                                    <Text>{homeCollection ? '☑️' : '⬜'}</Text>
                                </TouchableOpacity>
                                <Text style={styles.homeCollectionText}>Home Sample Collection (+₹100)</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => {
                                    if (selectedTests.length > 0) {
                                        setSelectedDate(new Date().toISOString().split('T')[0]);
                                        setStep(5);
                                    } else {
                                        Alert.alert('Error', 'Please select at least one test');
                                    }
                                }}
                                disabled={selectedTests.length === 0}
                            >
                                <Text style={styles.nextButtonText}>Continue</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            );
        }
    };

    const renderStep4 = () => (
        <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Time Slot</Text>
            <Text style={styles.dateText}>Date: {selectedDate}</Text>

            <ScrollView>
                <View style={styles.slotsGrid}>
                    {availableSlots.map(slot => (
                        <TouchableOpacity
                            key={slot.id}
                            style={[
                                styles.slotCard,
                                !slot.isAvailable && styles.slotCardDisabled,
                                selectedSlot?.id === slot.id && styles.slotCardSelected,
                            ]}
                            onPress={() => handleSlotSelect(slot)}
                            disabled={!slot.isAvailable}
                        >
                            <Text style={[styles.slotTime, !slot.isAvailable && styles.slotTimeDisabled]}>
                                {slot.startTime}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );

    const renderStep5 = () => {
        const totalAmount =
            appointmentType === 'doctor'
                ? selectedDoctor?.consultationFee || 0
                : appointmentType === 'hospital'
                    ? 300
                    : selectedTests.reduce((sum, test) => sum + test.price, 0) + (homeCollection ? 100 : 0);

        return (
            <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Confirm Booking</Text>

                <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Appointment Details</Text>

                    {appointmentType === 'doctor' && selectedDoctor && (
                        <>
                            <Text style={styles.summaryText}>Doctor: {selectedDoctor.name}</Text>
                            <Text style={styles.summaryText}>Specialty: {selectedDoctor.specialization}</Text>
                        </>
                    )}

                    {appointmentType === 'hospital' && selectedHospital && (
                        <>
                            <Text style={styles.summaryText}>Hospital: {selectedHospital.name}</Text>
                            <Text style={styles.summaryText}>Department: OPD</Text>
                        </>
                    )}

                    {appointmentType === 'lab' && selectedLab && (
                        <>
                            <Text style={styles.summaryText}>Lab: {selectedLab.name}</Text>
                            <Text style={styles.summaryText}>Tests: {selectedTests.map(t => t.name).join(', ')}</Text>
                            {homeCollection && <Text style={styles.summaryText}>Home Collection: Yes</Text>}
                        </>
                    )}

                    {selectedSlot && (
                        <>
                            <Text style={styles.summaryText}>Date: {selectedDate}</Text>
                            <Text style={styles.summaryText}>Time: {selectedSlot.startTime}</Text>
                        </>
                    )}

                    <View style={styles.divider} />

                    <Text style={styles.summaryText}>Patient: {patientName}</Text>
                    <Text style={styles.summaryText}>Age: {patientAge}</Text>
                    <Text style={styles.summaryText}>Contact: {patientContact}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.totalAmount}>Total: ₹{totalAmount}</Text>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirmBooking}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.confirmButtonText}>Confirm & Book</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Appointment</Text>
            </View>

            {renderStepIndicator()}

            <ScrollView style={styles.content}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
                {step === 5 && renderStep5()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backArrow: {
        fontSize: 24,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepCircleActive: {
        backgroundColor: '#007AFF',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    stepNumberActive: {
        color: '#fff',
    },
    stepLine: {
        width: 40,
        height: 2,
        backgroundColor: '#e0e0e0',
    },
    stepLineActive: {
        backgroundColor: '#007AFF',
    },
    content: {
        flex: 1,
    },
    stepContent: {
        padding: 16,
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
    },
    typeCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    typeCardSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    typeEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    typeTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    typeDesc: {
        fontSize: 14,
        color: '#666',
    },
    nextButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    searchInput: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 16,
    },
    searchButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    providerCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    providerName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    providerSpecialty: {
        fontSize: 14,
        color: '#007AFF',
        marginBottom: 4,
    },
    providerQualification: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    providerExperience: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    providerFee: {
        fontSize: 16,
        fontWeight: '700',
        color: '#34C759',
    },
    providerLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    providerContact: {
        fontSize: 14,
        color: '#666',
    },
    sectionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    labCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    labCardSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    testCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    testCardSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    testName: {
        fontSize: 15,
        flex: 1,
    },
    testPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: '#34C759',
    },
    homeCollectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    checkbox: {
        marginRight: 8,
    },
    homeCollectionText: {
        fontSize: 15,
    },
    dateText: {
        fontSize: 16,
        marginBottom: 16,
        color: '#666',
    },
    slotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    slotCard: {
        width: '31%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    slotCardSelected: {
        borderColor: '#007AFF',
        backgroundColor: '#f0f8ff',
    },
    slotCardDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#ddd',
    },
    slotTime: {
        fontSize: 14,
        fontWeight: '600',
    },
    slotTimeDisabled: {
        color: '#999',
    },
    summaryCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    summaryText: {
        fontSize: 15,
        marginBottom: 8,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#007AFF',
        marginTop: 8,
    },
    confirmButton: {
        backgroundColor: '#34C759',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BookAppointmentScreen;
