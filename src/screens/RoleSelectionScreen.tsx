import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import SponsorFooter from '../components/SponsorFooter';

type Props = NativeStackScreenProps<RootStackParamList, 'RoleSelection'>;

interface Role {
    id: string;
    title: string;
    icon: string;
    description: string;
    screen: keyof RootStackParamList;
}

const roles: Role[] = [
    {
        id: 'patient',
        title: 'Patient/Beneficiary',
        icon: '👤',
        description: 'Access health records, book appointments, consult doctors',
        screen: 'PatientDashboard',
    },
    {
        id: 'doctor',
        title: 'Doctor',
        icon: '👨‍⚕️',
        description: 'Manage appointments, consult patients, write prescriptions',
        screen: 'DoctorDashboard',
    },
    {
        id: 'hospital',
        title: 'Hospital/Healthcare Facility',
        icon: '🏥',
        description: 'Manage patients, appointments, staff, and billing',
        screen: 'HospitalDashboard',
    },
    {
        id: 'pharmacy',
        title: 'Pharmacy',
        icon: '💊',
        description: 'Manage prescriptions, inventory, and orders',
        screen: 'PharmacyDashboard',
    },
    {
        id: 'lab',
        title: 'Diagnostic Lab',
        icon: '🏢',
        description: 'Manage test bookings, reports, and equipment',
        screen: 'LabDashboard',
    },
    {
        id: 'ambulance',
        title: 'Ambulance Service',
        icon: '🚑',
        description: 'Manage bookings, fleet, and emergency requests',
        screen: 'AmbulanceDashboard',
    },
];

export default function RoleSelectionScreen({ navigation, route }: Props) {
    const identityType = route.params?.identityType;

    // Filter roles based on identity type
    const getAvailableRoles = () => {
        if (identityType === 'hfr') {
            // HFR login: Only Hospital, Lab, Pharmacy
            return roles.filter(role =>
                ['hospital', 'lab', 'pharmacy'].includes(role.id)
            );
        } else if (identityType === 'abha') {
            // ABHA signup: Only Patient role (ABHA is for citizens/patients only)
            return roles.filter(role => role.id === 'patient');
        }
        // Default: show all roles (should not reach here in normal flow)
        return roles;
    };

    const availableRoles = getAvailableRoles();

    const handleRoleSelect = (screen: keyof RootStackParamList) => {
        navigation.navigate(screen as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Corner decorations */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />

            <View style={styles.header}>
                <Text style={styles.title}>Choose Your Role</Text>
                <Text style={styles.subtitle}>Select how you want to use Ayusetu</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {availableRoles.map((role) => (
                    <TouchableOpacity
                        key={role.id}
                        style={styles.roleCard}
                        onPress={() => handleRoleSelect(role.screen)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.roleIconContainer}>
                            <Text style={styles.roleIcon}>{role.icon}</Text>
                        </View>
                        <View style={styles.roleInfo}>
                            <Text style={styles.roleTitle}>{role.title}</Text>
                            <Text style={styles.roleDescription}>{role.description}</Text>
                        </View>
                        <Text style={styles.arrowIcon}>→</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <SponsorFooter logoSource={require('../../assets/images/Images/SponserCPJLOGO.png')} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 20,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    content: {
        flex: 1
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingBottom: 120,
        paddingTop: 10,
    },
    roleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    roleIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#f5f5f5',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    roleIcon: {
        fontSize: 32,
    },
    roleInfo: {
        flex: 1,
    },
    roleTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    roleDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    arrowIcon: {
        fontSize: 24,
        color: '#000',
        marginLeft: 12,
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
    cornerTopRight: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        width: 30,
        height: 80,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 30,
        height: 80,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
        zIndex: 10,
    },
});
