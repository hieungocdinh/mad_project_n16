import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';

// Định nghĩa các loại alert
export enum AlertType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
    CONFIRM = 'confirm', // Add confirmation type
}

// Định nghĩa interface cho context
interface AlertContextProps {
    showAlert: (title: string, message: string, type?: AlertType, duration?: number) => void;
    showConfirm: (
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void,
        confirmText?: string,
        cancelText?: string
    ) => void;
    hideAlert: () => void;
    isVisible: boolean;
}

// Tạo context
const AlertContext = createContext<AlertContextProps>({
    showAlert: () => {},
    showConfirm: () => {},
    hideAlert: () => {},
    isVisible: false,
});

// Hook custom để sử dụng alert
export const useAlert = () => useContext(AlertContext);

// Provider component
export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [alertType, setAlertType] = useState<AlertType>(AlertType.INFO);
    const [autoHide, setAutoHide] = useState<boolean>(true);
    const [duration, setDuration] = useState<number>(3000);

    // For confirmation dialog
    const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
    const [cancelCallback, setCancelCallback] = useState<(() => void) | null>(null);
    const [confirmText, setConfirmText] = useState<string>('Xác nhận');
    const [cancelText, setCancelText] = useState<string>('Hủy');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Hiển thị alert
    const showAlert = (
        title: string,
        message: string,
        type: AlertType = AlertType.INFO,
        duration: number = 3000
    ) => {
        // Xóa timer cũ nếu có
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setTitle(title);
        setMessage(message);
        setAlertType(type);
        setDuration(duration);
        setVisible(true);

        // Reset confirmation callbacks
        setConfirmCallback(null);
        setCancelCallback(null);

        // Thiết lập autoHide dựa vào duration
        if (duration > 0) {
            setAutoHide(true);
        } else {
            setAutoHide(false);
        }

        // Kích hoạt animation fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Thiết lập timer tự động ẩn nếu cần
        if (duration > 0) {
            timerRef.current = setTimeout(() => {
                hideAlert();
            }, duration);
        }
    };

    // Hiển thị confirm dialog
    const showConfirm = (
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void,
        confirmButtonText: string = 'Xác nhận',
        cancelButtonText: string = 'Hủy'
    ) => {
        // Xóa timer cũ nếu có
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        setTitle(title);
        setMessage(message);
        setAlertType(AlertType.CONFIRM);
        setAutoHide(false);
        setConfirmCallback(() => onConfirm);
        setCancelCallback(() => onCancel || hideAlert);
        setConfirmText(confirmButtonText);
        setCancelText(cancelButtonText);
        setVisible(true);

        // Kích hoạt animation fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    // Ẩn alert
    const hideAlert = () => {
        // Kích hoạt animation fade out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);
        });

        // Xóa timer nếu có
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Handle confirm action
    const handleConfirm = () => {
        // Lưu callback để gọi sau khi đóng modal
        const callback = confirmCallback;

        // Ẩn alert trước
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setVisible(false);

            // Gọi callback sau khi đã đóng hoàn toàn
            if (callback) {
                callback();
            }
        });

        // Xóa timer nếu có
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    // Handle cancel action
    const handleCancel = () => {
        hideAlert();
        if (cancelCallback) {
            cancelCallback();
        }
    };

    // Clean up timer khi component unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // Hàm xác định icon và màu sắc dựa vào loại alert
    const getAlertConfig = () => {
        switch (alertType) {
            case AlertType.SUCCESS:
                return {
                    iconName: 'checkmark-circle',
                    color: '#4CAF50',
                    buttonColor: '#4CAF50',
                };
            case AlertType.ERROR:
                return {
                    iconName: 'alert-circle',
                    color: '#F44336',
                    buttonColor: '#F44336',
                };
            case AlertType.WARNING:
                return {
                    iconName: 'warning',
                    color: '#FF9800',
                    buttonColor: '#FF9800',
                };
            case AlertType.CONFIRM:
                return {
                    iconName: 'help-circle',
                    color: '#673AB7',
                    buttonColor: '#673AB7',
                    cancelColor: '#999',
                };
            case AlertType.INFO:
            default:
                return {
                    iconName: 'information-circle',
                    color: '#2196F3',
                    buttonColor: '#2196F3',
                };
        }
    };

    const alertConfig = getAlertConfig();

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm, hideAlert, isVisible: visible }}>
            {children}

            <Modal
                transparent={true}
                visible={visible}
                animationType="none"
                onRequestClose={hideAlert}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            { opacity: fadeAnim }
                        ]}
                    >
                        <View style={styles.modalContent}>
                            <IonIcons
                                name={alertConfig.iconName}
                                size={50}
                                color={alertConfig.color}
                                style={styles.modalIcon}
                            />

                            <Text style={styles.modalTitle}>{title}</Text>

                            <Text style={styles.modalMessage}>{message}</Text>

                            {!autoHide && alertType !== AlertType.CONFIRM && (
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: alertConfig.buttonColor }]}
                                    onPress={hideAlert}
                                >
                                    <Text style={styles.modalButtonText}>OK</Text>
                                </TouchableOpacity>
                            )}

                            {alertType === AlertType.CONFIRM && (
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton, { backgroundColor: alertConfig.cancelColor }]}
                                        onPress={handleCancel}
                                    >
                                        <Text style={styles.modalButtonText}>{cancelText}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: alertConfig.buttonColor }]}
                                        onPress={handleConfirm}
                                    >
                                        <Text style={styles.modalButtonText}>{confirmText}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </AlertContext.Provider>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: width * 0.8,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalContent: {
        alignItems: 'center',
    },
    modalIcon: {
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        marginRight: 12,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AlertContext;