import React from "react";
import {View, Text, StyleSheet} from "react-native";

const Logo: React.FC = () => {
    return (
        <View style={styles.logo}>
            <Text style={[styles.family]}>Family</Text>
            <View style={styles.title2}>
                <Text style={[styles.tree]}>Tree</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    logo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 40
    },
    family: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#000",
    },
    title2: {
        backgroundColor: "#1e88e5",
        borderRadius: 10,
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    tree: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default Logo;
