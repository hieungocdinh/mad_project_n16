import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import userApi from "../../api/userApi";
import familyApi from "../../api/familyApi";
import profileApi from "../../api/profileApi";

const SuggestConnectScreen: React.FC<any> = ({ navigation }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<{ [key: number]: any }>({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [suggestedFamilies, setSuggestedFamilies] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await userApi.getUsersWithoutFamily();
                const userList = (res.data || []).filter((u: any) => u && u.userId !== undefined && u.userId !== null);
                if (isMounted) setUsers(userList);

                const profileIds = userList
                    .map((u: any) => u.profileId)
                    .filter((id: any) => id !== undefined && id !== null);

                const profilesMap: { [key: number]: any } = {};
                await Promise.all(
                    profileIds.map(async (pid: number) => {
                        try {
                            const res = await profileApi.getProfileDetail(pid);
                            profilesMap[pid] = res.data;
                        } catch (e) {}
                    })
                );

                if (isMounted) setProfiles(profilesMap);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchUsers();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleSuggest = async (user: any) => {
        setSelectedUser(user);
        const res = await familyApi.suggestFamiliesForUser(user.userId);
        setSuggestedFamilies(res.data || []);
        setModalVisible(true);
    };

    const renderUserName = (item: any) => {
    if (item.profileId && profiles[item.profileId]) {
        const profile = profiles[item.profileId];
        return `${profile.lastName || ""} ${profile.firstName || ""}`.trim() || (item.username || "");
    }
    return item.username || "";
    }; 

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                {loading ? (
                    <ActivityIndicator size="large" color="#1e88e5" />
                ) : (
                    <FlatList
                        data={users}
                        keyExtractor={item => (item?.userId ? item.userId.toString() : Math.random().toString())}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.userItem}
                                onPress={() => handleSuggest(item)}
                            >
                                <Text style={styles.userName}>{renderUserName(item)}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#bbb" style={{ marginLeft: 8 }} />
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t("suggest_connect_family")}</Text>
                        {suggestedFamilies.length === 0 ? (
                            <Text style={styles.noSuggest}>{t("no_suggestion")}</Text>
                        ) : (
                            suggestedFamilies.map((familyName, idx) => (
                                <Text key={idx} style={styles.familyName}>{familyName}</Text>
                            ))
                        )}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={{ color: "#1e88e5", fontWeight: "bold" }}>{t("close")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SuggestConnectScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fa",
        padding: 12
    },
    userItem: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 18,
        marginHorizontal: 16,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        shadowColor: "#1e88e5",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: "#e3eafc",
    },
    userName: {
        fontSize: 16,
        color: "#222",
        flex: 1
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.2)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 24,
        width: "80%",
        alignItems: "center"
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1e88e5",
        marginBottom: 14
    },
    familyName: {
        fontSize: 16,
        color: "#333",
        marginBottom: 6
    },
    noSuggest: {
        fontSize: 16,
        color: "#888",
        marginBottom: 10
    },
    closeBtn: {
        marginTop: 18,
        padding: 8
    },
});