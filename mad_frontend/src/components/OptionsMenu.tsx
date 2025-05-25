import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';

interface MenuItem {
    label: string;
    onPress: () => void;
    isDestructive?: boolean;
}

interface OptionsMenuProps {
    visible: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
    position?: { top: number; right: number };
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({
    visible,
    onClose,
    menuItems,
    position = { top: 60, right: 15 }
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.menuContainer, { top: position.top, right: position.right }]}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.menuItem}
                                onPress={() => {
                                    onClose();
                                    item.onPress();
                                }}
                            >
                                <Text style={[styles.menuItemText, item.isDestructive && styles.destructiveText]}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default OptionsMenu;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    menuContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        minWidth: 170
    },

    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 16
    },

    menuItemText: {
        fontSize: 16,
        color: '#000'
    },

    destructiveText: {
        color: 'red'
    }
});