import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Ionicons";
import images from "../utils/images";

import { RootStackParamList } from '../types/root-stack-param';
import { useTranslation } from 'react-i18next';

import FamilyResponse from "../types/response/family-response";
import FamilyApi from "../api/familyApi";

type SelectFamilyViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SelectFamily'>;
    route: RouteProp<RootStackParamList, 'SelectFamily'>;
};

const SelectFamilyView: React.FC<SelectFamilyViewProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const { type } = route.params;
    const [families, setFamilies] = useState<FamilyResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchFamilies = async () => {
        setLoading(true);
        try {
            const data = await FamilyApi.searchFamilies("");
            const familyResponses: FamilyResponse[] = data.data.content;
            setFamilies(familyResponses || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamilies();
    }, []);

    const handleSelect = (familyId: number) => {
        switch (type) {
            case 'image':
                navigation.navigate('ListImageView', { familyId });
                break;
            case 'album':
                navigation.navigate('ListAlbumView', { familyId });
                break;
            case 'profile':
                navigation.navigate('ListProfileView', { familyId });
                break;
            default:
                console.log('Unknown type selected');
        }
    };

    const renderCard = ({ item }: { item: FamilyResponse }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleSelect(item.id)}>
            <Image
                source={item.avatarUrl?.trim() ? { uri: item.avatarUrl } : images.defaultFamily}
                style={styles.cardImage}
            />
            <Text style={styles.cardText}>
                {t("family_screen.family_of", { name: item.name })}
            </Text>
            <Icon name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <FlatList
                        data={families}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCard}
                        contentContainerStyle={styles.cardContainer}
                    />
                </>
            )}
        </View>
    );
};

export default SelectFamilyView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    cardContainer: {
        paddingHorizontal: 0,
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
});