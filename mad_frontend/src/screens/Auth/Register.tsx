import React, {useState} from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView
} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types/root-stack-param";
import authApi from "../../api/authApi";
import {Ionicons} from '@expo/vector-icons';
import Logo from "../../components/Logo";
import RegisterRequest from "../../types/request/register-requet";
import {useTranslation} from "react-i18next";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Register">;
};

const Register: React.FC<Props> = ({navigation}) => {
    const {t} = useTranslation();
    const [username, setUsername] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRegister = async () => {
        if (!username || !phoneNumber || !email || !password || !confirmPassword) {
            alert(t("fill_all_fields"));
            return;
        }

        if (password !== confirmPassword) {
            alert(t("password_mismatch"));
            return;
        }

        setLoading(true);

        try {
            const registerRequest: RegisterRequest = {username, password, email, phoneNumber};
            const response = await authApi.register(registerRequest);

            if (response.code === 201) {
                alert(t("registration_success"));
                navigation.navigate("Login");
            } else {
                alert(t("registration_failed"));
            }
        } catch (error) {
            alert(t("registration_error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <Logo/>
                <Text style={styles.heading}>{t("create_account")}</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t("username")}
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t("phone_number")}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t("email")}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t("password")}
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
                        placeholder={t("confirm_password")}
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
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff"/>
                    ) : (
                        <Text style={styles.registerButtonText}>{t("register")}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginText}>
                        {t("already_have_account")} <Text style={styles.loginLink}>{t("login")}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        backgroundColor: "#fff",
        paddingVertical: 40,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
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
    eyeIcon: {
        padding: 10,
    },
    registerButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#1e88e5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    loginText: {
        fontSize: 14,
        color: "#000",
    },
    loginLink: {
        color: "#1e88e5",
        fontWeight: "500",
    },
});

export default Register;
