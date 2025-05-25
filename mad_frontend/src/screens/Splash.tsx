import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/root-stack-param";
import Logo from "../components/Logo";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

const Splash: React.FC<Props> = ({ navigation }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Login");
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.splash}>
            <Logo />
        </View>
    );
};

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});

export default Splash;
