import React, {useState, useEffect, useRef} from "react";
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
import Logo from "../../components/Logo";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "ConfirmAccount">;
    route: RouteProp<RootStackParamList, "ConfirmAccount">;
};

const ConfirmAccount: React.FC<Props> = ({navigation, route}) => {
    const {t} = useTranslation();
    const {email, data} = route.params || {};
    const [otp, setOtp] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(60);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        startTimer();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [data]);

    const startTimer = () => {
        setTimeLeft(60);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const handleResendOTP = async () => {
        if (timeLeft > 0) return;

        try {
            const response = await authApi.forgotPassword(email);

            if (response.code === 200) {
                startTimer();
                alert(t("otp_sent"));
            } else {
                alert(t("otp_resend_failed"));
            }
        } catch (error) {
            alert(t("otp_error"));
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 4) {
            alert(t("otp_invalid"));
            return;
        }

        setLoading(true);
        try {
            if (otp === data) {
                navigation.navigate("ResetPassword", {
                    email
                });
            } else {
                alert(t("otp_mismatch"));
            }
        } catch (error) {
            alert(t("otp_error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Logo/>

                <Text style={styles.heading}>{t('account_confirmation')}</Text>

                <View style={styles.lockContainer}>
                    <Ionicons name="lock-closed" size={40} color="#000"/>
                </View>

                <Text style={styles.instructionText}>
                    {t('otp_sent_instruction')}
                </Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon}/>
                    <TextInput
                        style={styles.input}
                        placeholder={t('enter_otp')}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otp}
                        onChangeText={setOtp}
                    />
                </View>

                {timeLeft > 0 ? (
                    <Text style={styles.resendText}>
                        {t('resend_otp_after', {seconds: timeLeft})}
                    </Text>
                ) : (
                    <TouchableOpacity onPress={handleResendOTP}>
                        <Text style={styles.resendActiveText}>
                            {t('resend_otp')}
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleVerifyOTP}
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
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 30,
    },
    lockContainer: {
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
    resendText: {
        fontSize: 14,
        color: "#777",
        marginBottom: 20,
    },
    resendActiveText: {
        fontSize: 14,
        color: "#1e88e5",
        marginBottom: 20,
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

export default ConfirmAccount;
