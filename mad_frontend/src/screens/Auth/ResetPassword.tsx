import React, {useState} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView
} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RouteProp} from "@react-navigation/native";
import {RootStackParamList} from "../../types/root-stack-param";
import authApi from "../../api/authApi";
import {Ionicons} from '@expo/vector-icons';
import {useTranslation} from "react-i18next";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "ResetPassword">;
    route: RouteProp<RootStackParamList, "ResetPassword">;
};

const ResetPassword: React.FC<Props> = ({navigation, route}) => {
    const {t} = useTranslation();
    const {email} = route.params || {};
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            alert(t("fill_all_fields"));
            return;
        }

        if (password !== confirmPassword) {
            alert(t("password_mismatch"));
            return;
        }

        if (password.length < 6) {
            alert(t("password_length"));
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.resetPassword(
                email, password
            );

            if (response.code === 200) {
                alert(t("reset_password_success"));
                navigation.navigate("Login");
            } else {
                alert(t("reset_password_failed"));
            }
        } catch (error) {
            alert(t("reset_password_error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoTextBlack}>Family</Text>
                    <View style={styles.logoTextBlueContainer}>
                        <Text style={styles.logoTextBlue}>Tree</Text>
                    </View>
                </View>

                <Text style={styles.heading}>{t('reset_password')}</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t('password')}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Ionicons
                            name={showPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t('confirm_password')}
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <Ionicons
                            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                            size={20}
                            color="#777"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleResetPassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff"/>
                    ) : (
                        <Text style={styles.confirmButtonText}>{t('confirm')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>{t('back')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        backgroundColor: "#fff",
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
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 30,
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
    eyeIcon: {
        padding: 10,
    },
    confirmButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#1e88e5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    confirmButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        padding: 10,
    },
    backButtonText: {
        color: "#1e88e5",
        fontSize: 14,
    },
});

export default ResetPassword;
