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
import {RootStackParamList} from "../../types/root-stack-param";
import authApi from "../../api/authApi";
import {Ionicons} from '@expo/vector-icons';
import {useTranslation} from "react-i18next";
import Logo from "../../components/Logo";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "ForgotPassword">;
};

const ForgotPassword: React.FC<Props> = ({navigation}) => {
    const {t} = useTranslation();
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleRequestOTP = async () => {
        if (!email) {
            alert(t("fill_email"));
            return;
        }

        setLoading(true);
        try {
            const response = await authApi.forgotPassword(email);

            if (response.code === 200) {
                navigation.navigate("ConfirmAccount", {
                    email: email,
                    data: response.data
                });
            } else {
                alert(t("otp_send_failed"));
            }
        } catch (error) {
            alert(t("otp_send_error") + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Logo/>

                <View style={styles.envelopeContainer}>
                    <Ionicons name="mail-outline" size={50} color="#000"/>
                </View>

                <Text style={styles.instructionText}>
                    {t("enter_email_for_otp")}
                </Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t("enter_email")}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleRequestOTP}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff"/>
                    ) : (
                        <Text style={styles.continueButtonText}>{t('continue')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>{t('back_to_login')}</Text>
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
    envelopeContainer: {
        width: 80,
        height: 80,
        borderWidth: 2,
        borderColor: "#000",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    instructionText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 30,
        color: "#000",
    },
    inputContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
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
    continueButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#1e88e5",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginBottom: 20,
    },
    continueButtonText: {
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

export default ForgotPassword;
