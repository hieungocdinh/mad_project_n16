import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    StatusBar
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/root-stack-param";
import { useAuth } from "../../context/authContext";
import authApi from "../../api/authApi";
import profileApi from "../../api/profileApi";
import Logo from "../../components/Logo";
import { Ionicons } from '@expo/vector-icons';
import LoginRequest from "../../types/request/login-request";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../../components/LanguageToggle";
import { getToken } from "../../store/storages";
import UserResponse from "../../types/response/user-response";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const Login: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { login, setUser } = useAuth();
    const { t, i18n } = useTranslation();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const loginRequest: LoginRequest = {
                email,
                password
            };

            const response = await authApi.login(loginRequest);

            if (response.code === 200) {
                const token = response.data.toString();
                login(token);
                const user: UserResponse = await authApi.getCurrentUser();
                setUser(user);
                const profileResponse = await profileApi.getProfileDetail(user.profileId);
                if (profileResponse.code !== 200) {
                    alert(t('login_failed'));
                    return;
                }

                if (profileResponse.data.profileSetting) {
                    navigation.navigate("Tab");
                }
                else {
                    navigation.navigate('ProfileUpdateView', { profileId: user.profileId, isFirstLogin: true });
                }
            } else {
                alert(t('login_failed'));
            }
        } catch (error) {
            alert(t('login_error'));
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigation.navigate("Register");
    };

    const handleForgotPassword = () => {
        navigation.navigate("ForgotPassword");
    };

    return (
        <View style={styles.container}>
            <LanguageToggle />
            <Logo />

            <Text style={styles.greeting}>{t('welcome')}</Text>
            <Text style={styles.subtitle}>{t('login_to_continue')}</Text>

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={t('email')}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={t('password')}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <View style={styles.rememberForgotContainer}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                >
                    <View style={styles.checkbox}>
                        {rememberMe && (
                            <Ionicons name="checkmark" size={16} color="#1e88e5" />
                        )}
                    </View>
                    <Text style={styles.rememberMeText}>{t('remember_me')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>{t('forgot_password')}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={email === '' || password === '' || loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.loginButtonText}>{t('login')}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerText}>
                    {t('no_account')} <Text style={styles.registerLink}>{t('register')}</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        backgroundColor: "#fff",
    },
    languageToggle: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#1e88e5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        zIndex: 999,
    },
    languageText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40,
    },
    logoTextBlack: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
    },
    logoTextBlueContainer: {
        backgroundColor: "#1e88e5",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 5,
    },
    logoTextBlue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    greeting: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
        alignSelf: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#1e88e5",
        marginBottom: 30,
        alignSelf: "center",
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        paddingVertical: 10,
    },
    rememberForgotContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: "#1e88e5",
        borderRadius: 4,
        marginRight: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    rememberMeText: {
        fontSize: 14,
        color: "#000",
    },
    forgotPassword: {
        fontSize: 14,
        color: "#1e88e5",
    },
    loginButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#1e88e5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 20,
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerText: {
        fontSize: 14,
        color: "#000",
    },
    registerLink: {
        color: "#1e88e5",
        fontWeight: "500",
    },
});

export default Login;