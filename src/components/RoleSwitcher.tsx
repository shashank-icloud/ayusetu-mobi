import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';

interface Role {
    id: string;
    name: string;
    icon: string;
}

interface RoleSwitcherProps {
    currentRole: string;
    availableRoles: Role[];
    onRoleChange: (roleId: string) => void;
}

export default function RoleSwitcher({ currentRole, availableRoles, onRoleChange }: RoleSwitcherProps) {
    const [modalVisible, setModalVisible] = useState(false);

    const getCurrentRoleData = () => {
        return availableRoles.find(role => role.id === currentRole);
    };

    const handleRoleSelect = (roleId: string) => {
        onRoleChange(roleId);
        setModalVisible(false);
    };

    if (availableRoles.length <= 1) {
        return null; // Don't show switcher if user has only one role
    }

    const currentRoleData = getCurrentRoleData();

    return (
        <>
            <TouchableOpacity
                style={styles.switcherButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.currentRoleIcon}>{currentRoleData?.icon}</Text>
                <View style={styles.roleInfo}>
                    <Text style={styles.roleLabel}>Current Role</Text>
                    <Text style={styles.roleName}>{currentRoleData?.name}</Text>
                </View>
                <Text style={styles.switchIcon}>🔄</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Switch Role</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.rolesList}>
                            {availableRoles.map((role) => (
                                <TouchableOpacity
                                    key={role.id}
                                    style={[
                                        styles.roleOption,
                                        currentRole === role.id && styles.roleOptionActive
                                    ]}
                                    onPress={() => handleRoleSelect(role.id)}
                                >
                                    <Text style={styles.roleOptionIcon}>{role.icon}</Text>
                                    <Text style={[
                                        styles.roleOptionName,
                                        currentRole === role.id && styles.roleOptionNameActive
                                    ]}>
                                        {role.name}
                                    </Text>
                                    {currentRole === role.id && (
                                        <Text style={styles.activeCheckmark}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.infoText}>
                            Each role has separate permissions and data access.
                        </Text>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    switcherButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#111',
        padding: 12,
        marginHorizontal: 24,
        marginBottom: 16,
    },
    currentRoleIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    roleInfo: {
        flex: 1,
    },
    roleLabel: {
        fontSize: 11,
        color: '#666',
        marginBottom: 2,
    },
    roleName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    switchIcon: {
        fontSize: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 300,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeText: {
        fontSize: 18,
        color: '#000',
    },
    rolesList: {
        marginBottom: 24,
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    roleOptionActive: {
        borderColor: '#000',
        backgroundColor: '#f8f9fa',
    },
    roleOptionIcon: {
        fontSize: 28,
        marginRight: 12,
    },
    roleOptionName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    roleOptionNameActive: {
        color: '#000',
        fontWeight: '700',
    },
    activeCheckmark: {
        fontSize: 20,
        color: '#4CAF50',
    },
    infoText: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
