import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    Keyboard,
} from 'react-native';

type CustomDialogProps = {
    visible: boolean;
    title: string;
    message?: string;
    inputValue?: string;
    showInput?: boolean;
    confirmText: string;
    cancelText: string;
    isDestructive?: boolean;
    onConfirm: (inputValue?: string) => void;
    onCancel: () => void;
};

const CustomDialog = ({
    visible,
    title,
    message,
    inputValue = '',
    showInput = false,
    confirmText,
    cancelText,
    isDestructive = false,
    onConfirm,
    onCancel,
}: CustomDialogProps) => {
    const [input, setInput] = useState(inputValue);

    useEffect(() => {
        if (inputValue !== input) {
            setInput(inputValue);
        }
    }, [inputValue]);

    const handleOutsidePress = () => {
        Keyboard.dismiss();
        onCancel();
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.dialog}>
                            <Text style={styles.title}>{title}</Text>
                            {showInput ? (
                                <TextInput
                                    value={input}
                                    onChangeText={setInput}
                                    style={styles.input}
                                    placeholder="Nhập nội dung..."
                                />
                            ) : (
                                <Text style={styles.message}>{message}</Text>
                            )}

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={onCancel}
                                >
                                    <Text>{cancelText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        {
                                            backgroundColor: isDestructive
                                                ? 'red'
                                                : '#2196F3',
                                        },
                                    ]}
                                    onPress={() => onConfirm(input)}
                                >
                                    <Text style={{ color: 'white' }}>
                                        {confirmText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default CustomDialog;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    dialog: {
        width: 300,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    message: {
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    confirmButton: {
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
});


