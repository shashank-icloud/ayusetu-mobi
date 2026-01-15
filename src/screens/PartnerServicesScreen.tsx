// Partner Services Screen - Category 15
// ABDM-verified partner services (labs, pharmacies, ambulances)

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { monetizationService } from '../services/monetizationService';
import {
    PartnerService,
    LabTest,
    PartnerOffer,
    PartnerServiceType,
} from '../../backend/types/monetization';

type Props = NativeStackScreenProps<RootStackParamList, 'PartnerServices'>;

export default function PartnerServicesScreen({ navigation }: Props) {
    const [services, setServices] = useState<PartnerService[]>([]);
    const [labTests, setLabTests] = useState<LabTest[]>([]);
    const [offers, setOffers] = useState<PartnerOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<PartnerServiceType | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, [selectedType]);

    const loadData = async () => {
        setLoading(true);
        try {
            const type = selectedType === 'all' ? undefined : selectedType;
            const [servicesData, labTestsData, offersData] = await Promise.all([
                monetizationService.getPartnerServices(type),
                monetizationService.getLabTests(),
                monetizationService.getPartnerOffers(),
            ]);
            setServices(servicesData);
            setLabTests(labTestsData);
            setOffers(offersData);
        } catch (error) {
            Alert.alert('Error', 'Failed to load partner services');
        } finally {
            setLoading(false);
        }
    };

    const handleBookService = (service: PartnerService) => {
        Alert.alert(
            service.name,
            'Would you like to book this service?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Book Now',
                    onPress: () => {
                        Alert.alert('Success', `Booking request sent to ${service.name}`);
                    },
                },
            ]
        );
    };

    const handleApplyOffer = (offer: PartnerOffer) => {
        Alert.alert(
            'Apply Offer',
            `Use code ${offer.code} to get ${offer.discountPercentage ? `${offer.discountPercentage}% off` : `₹${offer.discountAmount} off`}`,
            [
                { text: 'OK' },
            ]
        );
    };

    const getServiceTypeIcon = (type: PartnerServiceType) => {
        switch (type) {
            case 'lab_testing': return '🧪';
            case 'pharmacy': return '💊';
            case 'ambulance': return '🚑';
            case 'home_healthcare': return '🏥';
            case 'diagnostics': return '🔬';
            case 'wellness': return '🧘';
            case 'telemedicine': return '👨‍⚕️';
            default: return '🏢';
        }
    };

    const getServiceTypeLabel = (type: PartnerServiceType) => {
        return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const serviceTypes: Array<{ type: PartnerServiceType | 'all', label: string }> = [
        { type: 'all', label: 'All' },
        { type: 'lab_testing', label: 'Labs' },
        { type: 'pharmacy', label: 'Pharmacy' },
        { type: 'ambulance', label: 'Ambulance' },
        { type: 'home_healthcare', label: 'Home Care' },
        { type: 'diagnostics', label: 'Diagnostics' },
        { type: 'wellness', label: 'Wellness' },
        { type: 'telemedicine', label: 'Telemedicine' },
    ];

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search services..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Service Type Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContent}
            >
                {serviceTypes.map((item) => (
                    <TouchableOpacity
                        key={item.type}
                        style={[
                            styles.filterChip,
                            selectedType === item.type && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedType(item.type)}
                    >
                        <Text style={[
                            styles.filterChipText,
                            selectedType === item.type && styles.filterChipTextActive,
                        ]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.content}>
                {/* Active Offers */}
                {offers.length > 0 && (
                    <View style={styles.offersSection}>
                        <Text style={styles.sectionTitle}>🎉 Active Offers</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.offersScroll}
                        >
                            {offers.map((offer) => (
                                <TouchableOpacity
                                    key={offer.id}
                                    style={styles.offerCard}
                                    onPress={() => handleApplyOffer(offer)}
                                >
                                    <View style={styles.offerHeader}>
                                        <Text style={styles.offerBadge}>
                                            {offer.discountPercentage ? `${offer.discountPercentage}% OFF` : `₹${offer.discountAmount} OFF`}
                                        </Text>
                                    </View>
                                    <Text style={styles.offerTitle} numberOfLines={2}>{offer.title}</Text>
                                    <Text style={styles.offerDescription} numberOfLines={2}>
                                        {offer.description}
                                    </Text>
                                    <View style={styles.offerFooter}>
                                        <Text style={styles.offerCode}>Code: {offer.code}</Text>
                                        <Text style={styles.offerExpiry}>
                                            Valid till {new Date(offer.validUntil).toLocaleDateString('en-IN')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Partner Services */}
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>
                        {selectedType === 'all' ? 'All Services' : getServiceTypeLabel(selectedType as PartnerServiceType)}
                    </Text>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#2196f3" />
                            <Text style={styles.loadingText}>Loading services...</Text>
                        </View>
                    ) : filteredServices.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🏢</Text>
                            <Text style={styles.emptyText}>No services found</Text>
                        </View>
                    ) : (
                        filteredServices.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                style={styles.serviceCard}
                                onPress={() => handleBookService(service)}
                            >
                                <View style={styles.serviceHeader}>
                                    <View style={styles.serviceLeft}>
                                        <Text style={styles.serviceLogo}>{service.logo}</Text>
                                        <View style={styles.serviceInfo}>
                                            <View style={styles.serviceTitleRow}>
                                                <Text style={styles.serviceName}>{service.name}</Text>
                                                {service.isABDMVerified && (
                                                    <Text style={styles.verifiedBadge}>✓ ABDM</Text>
                                                )}
                                            </View>
                                            <Text style={styles.serviceType}>
                                                {getServiceTypeIcon(service.type)} {getServiceTypeLabel(service.type)}
                                            </Text>
                                        </View>
                                    </View>
                                    {service.isPopular && (
                                        <View style={styles.popularBadge}>
                                            <Text style={styles.popularBadgeText}>Popular</Text>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.serviceDescription} numberOfLines={2}>
                                    {service.description}
                                </Text>

                                <View style={styles.serviceDetails}>
                                    <View style={styles.serviceRating}>
                                        <Text style={styles.serviceRatingStars}>⭐</Text>
                                        <Text style={styles.serviceRatingText}>
                                            {service.rating.toFixed(1)} ({service.reviewCount.toLocaleString('en-IN')} reviews)
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.serviceStatus,
                                        service.status === 'active' && styles.serviceStatusActive,
                                        service.status === 'maintenance' && styles.serviceStatusMaintenance,
                                    ]}>
                                        <Text style={styles.serviceStatusText}>
                                            {service.status === 'active' ? '● Available' : '● Maintenance'}
                                        </Text>
                                    </View>
                                </View>

                                {service.operatingHours && (
                                    <Text style={styles.serviceHours}>
                                        🕐 {service.operatingHours.open} - {service.operatingHours.close}
                                    </Text>
                                )}

                                {service.locations && service.locations.length > 0 && (
                                    <Text style={styles.serviceLocations}>
                                        📍 {service.locations.slice(0, 3).join(', ')}
                                        {service.locations.length > 3 && ` +${service.locations.length - 3} more`}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    style={[
                                        styles.bookButton,
                                        service.status !== 'active' && styles.bookButtonDisabled,
                                    ]}
                                    onPress={() => handleBookService(service)}
                                    disabled={service.status !== 'active'}
                                >
                                    <Text style={styles.bookButtonText}>Book Service</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* Popular Lab Tests (for lab services) */}
                {selectedType === 'all' || selectedType === 'lab_testing' ? (
                    <View style={styles.labTestsSection}>
                        <Text style={styles.sectionTitle}>Popular Lab Tests</Text>
                        {labTests.slice(0, 3).map((test) => (
                            <View key={test.id} style={styles.labTestCard}>
                                <View style={styles.labTestHeader}>
                                    <Text style={styles.labTestName}>{test.name}</Text>
                                    {test.isPopular && (
                                        <Text style={styles.popularTag}>🔥</Text>
                                    )}
                                </View>
                                <Text style={styles.labTestDescription}>{test.description}</Text>
                                <View style={styles.labTestDetails}>
                                    <View style={styles.labTestDetail}>
                                        <Text style={styles.labTestDetailIcon}>💉</Text>
                                        <Text style={styles.labTestDetailText}>{test.sampleType}</Text>
                                    </View>
                                    <View style={styles.labTestDetail}>
                                        <Text style={styles.labTestDetailIcon}>⏱️</Text>
                                        <Text style={styles.labTestDetailText}>{test.reportDelivery}</Text>
                                    </View>
                                    {test.isFasting && (
                                        <View style={styles.fastingBadge}>
                                            <Text style={styles.fastingBadgeText}>Fasting Required</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.labTestPricing}>
                                    {test.discountedPrice ? (
                                        <>
                                            <Text style={styles.labTestOriginalPrice}>₹{test.price}</Text>
                                            <Text style={styles.labTestPrice}>₹{test.discountedPrice}</Text>
                                            <Text style={styles.labTestDiscount}>
                                                {Math.round((1 - test.discountedPrice / test.price) * 100)}% off
                                            </Text>
                                        </>
                                    ) : (
                                        <Text style={styles.labTestPrice}>₹{test.price}</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                ) : null}

                {/* ABDM Compliance Notice */}
                <View style={styles.complianceNotice}>
                    <Text style={styles.complianceIcon}>✓</Text>
                    <Text style={styles.complianceText}>
                        All partner services are ABDM verified and comply with data privacy standards.
                        Your health data is secure and never shared without consent.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    clearIcon: {
        fontSize: 18,
        color: '#999',
        padding: 4,
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
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    content: {
        flex: 1,
    },
    offersSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    offersScroll: {
        gap: 12,
    },
    offerCard: {
        width: 280,
        padding: 16,
        backgroundColor: '#fff5e6',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ff9800',
    },
    offerHeader: {
        marginBottom: 8,
    },
    offerBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#ff9800',
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    offerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    offerDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    offerFooter: {
        borderTopWidth: 1,
        borderTopColor: '#ffe0b2',
        paddingTop: 8,
    },
    offerCode: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ff9800',
        marginBottom: 4,
    },
    offerExpiry: {
        fontSize: 12,
        color: '#999',
    },
    servicesSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
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
    serviceCard: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    serviceLeft: {
        flexDirection: 'row',
        flex: 1,
    },
    serviceLogo: {
        fontSize: 40,
        marginRight: 12,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    serviceName: {
        fontSize: 16,
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
    serviceType: {
        fontSize: 13,
        color: '#666',
    },
    popularBadge: {
        backgroundColor: '#ff9800',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    serviceDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    serviceDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    serviceRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceRatingStars: {
        fontSize: 14,
        marginRight: 4,
    },
    serviceRatingText: {
        fontSize: 13,
        color: '#666',
    },
    serviceStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    serviceStatusActive: {
        backgroundColor: '#e8f5e9',
    },
    serviceStatusMaintenance: {
        backgroundColor: '#fff3e0',
    },
    serviceStatusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4caf50',
    },
    serviceHours: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },
    serviceLocations: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    bookButton: {
        backgroundColor: '#2196f3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonDisabled: {
        backgroundColor: '#ccc',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    labTestsSection: {
        padding: 16,
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    labTestCard: {
        padding: 14,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    labTestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    labTestName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    popularTag: {
        fontSize: 18,
    },
    labTestDescription: {
        fontSize: 13,
        color: '#666',
        marginBottom: 10,
    },
    labTestDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        flexWrap: 'wrap',
        gap: 8,
    },
    labTestDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    labTestDetailIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    labTestDetailText: {
        fontSize: 12,
        color: '#666',
    },
    fastingBadge: {
        backgroundColor: '#fff3e0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    fastingBadgeText: {
        fontSize: 11,
        color: '#f57c00',
        fontWeight: '600',
    },
    labTestPricing: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labTestOriginalPrice: {
        fontSize: 14,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    labTestPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196f3',
        marginRight: 8,
    },
    labTestDiscount: {
        fontSize: 12,
        color: '#4caf50',
        fontWeight: '600',
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
        fontSize: 24,
        color: '#4caf50',
        marginRight: 12,
    },
    complianceText: {
        flex: 1,
        fontSize: 13,
        color: '#388e3c',
        lineHeight: 20,
    },
});
