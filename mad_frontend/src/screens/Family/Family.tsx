import React, {useState, useEffect} from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    FlatList, StyleSheet, Image, ActivityIndicator
} from "react-native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../types/root-stack-param";
import Icon from "react-native-vector-icons/Ionicons";
import {useTranslation} from "react-i18next";
import FamilyResponse from "../../types/response/family-response";
import FamilyApi from "../../api/familyApi";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "Family">;
};

const FamilyScreen: React.FC<Props> = ({navigation}) => {
    const [searchText, setSearchText] = useState<string>("");
    const [families, setFamilies] = useState<FamilyResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const {t} = useTranslation();

    const fetchFamilies = async () => {
        setLoading(true);
        try {
            const data = await FamilyApi.searchFamilies(searchText);
            const familyResponses : FamilyResponse[] = data.data.content;
            setFamilies(familyResponses || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamilies();
    }, [searchText]);

    const handleSearch = (text: string) => {
        setSearchText(text);
        setPage(0);
    };

    const handleCardPress = (family: FamilyResponse) => {
        navigation.navigate("FamilyDetail", {family});
    };

    const renderCard = ({item}: { item: FamilyResponse }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
            <Image source={{uri: item.avatarUrl}} style={styles.cardImage}/>
            <Text style={styles.cardText}>
                {t("family_screen.family_of", {name: item.name})}
            </Text>
            <Icon name="chevron-forward-outline" size={20} color="#000"/>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>{t("family_screen.title")}</Text>
            </View>

            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder={t("family_screen.search_placeholder")}
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate("FamilyCreate")}
                >
                    <Icon name="add" size={24} color="#fff"/>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{marginTop: 20}} />
            ) : (
                <FlatList
                    data={families}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderCard}
                    contentContainerStyle={styles.cardContainer}
                />

            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 40
    },
    headerContainer: {
        backgroundColor: "#007bff",
        paddingVertical: 15,
        alignItems: "center",
    },
    header: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    cardContainer: {
        paddingHorizontal: 10,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ddd",
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    cardImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    cardText: {
        flex: 1,
        fontSize: 16,
    },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        marginBottom: 15,
        marginTop: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 15,
        marginRight: 10,
    },
    createButton: {
        backgroundColor: "#FF8C00",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default FamilyScreen;
