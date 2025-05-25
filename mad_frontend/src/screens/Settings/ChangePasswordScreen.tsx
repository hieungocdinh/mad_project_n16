import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import authApi from '../../api/authApi'; 
import UserResponse from '../../types/response/user-response';

const ChangePasswordScreen: React.FC = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const user: UserResponse = await authApi.getCurrentUser();
                setEmail(user.email);
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            setLoading(true);
            await authApi.changePassword(email, oldPassword, newPassword);
            Alert.alert('Thành công', 'Đổi mật khẩu thành công');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Lỗi', error?.response?.data?.message || 'Đổi mật khẩu thất bại');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#3478f6" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Mật khẩu cũ</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Nhập mật khẩu cũ"
                    secureTextEntry={!showOld}
                    style={styles.input}
                    value={oldPassword}
                    onChangeText={setOldPassword}
                />
                <Pressable onPress={() => setShowOld(!showOld)}>
                    <Ionicons
                        name={showOld ? 'eye-off' : 'eye'}
                        size={22}
                        color="gray"
                        style={styles.icon}
                    />
                </Pressable>
            </View>

            <Text style={styles.label}>Mật khẩu mới</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Nhập mật khẩu mới"
                    secureTextEntry={!showNew}
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <Pressable onPress={() => setShowNew(!showNew)}>
                    <Ionicons
                        name={showNew ? 'eye-off' : 'eye'}
                        size={22}
                        color="gray"
                        style={styles.icon}
                    />
                </Pressable>
            </View>

            <TouchableOpacity
                style={[styles.button, loading && {backgroundColor: '#a0a0a0'}]}
                onPress={handleChangePassword}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    icon: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#1e88e5',
        paddingVertical: 14,
        borderRadius: 8,
        marginTop: 30,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
