// src/screens/FamilyTreeScreen.tsx
import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from "../../types/root-stack-param";
import FamilyTreeResponse from "../../types/response/familyTree-response";
import FamilyTreeRequest from "../../types/request/familyTree-request";
import FamilyTreeApi from "../../api/familyTreeApi";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'FamilyTree'>
};

const FamilyTreeScreen: React.FC<Props> = ({navigation}) => {
    const {t} = useTranslation();

    const [searchText, setSearchText] = useState<string>('');
    const [trees, setTrees] = useState<FamilyTreeResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchTrees();
    }, []);

    const fetchTrees = async () => {
        setLoading(true);
        try {
            const req: FamilyTreeRequest = {};
            const res = await FamilyTreeApi.getListFamilyTree(req);
            setTrees(res.data);
        } catch (err) {
            console.error('Error fetching family trees', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchTrees();
    };

    const handleAdd = () => {
        navigation.navigate('FamilyTreeCreate');
    };

    const handleSelect = (familyTreeId: number) => {
        navigation.navigate('FamilyTreeDetailTab', { familyTreeId });
    };

    const renderItem = ({ item }: { item: FamilyTreeResponse }) => (
        <TouchableOpacity style={styles.card} onPress={() => handleSelect(item.id)}>
            <Image
                source={{ uri: item.avatarUrl ?? '../../../assets/images/default-avatar.jpg' }}
                style={styles.cardImage}
            />
            <Text style={styles.cardText}>{item.name}</Text>
            <Icon name="chevron-forward-outline" size={20} color="#000" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>
                    {t('family_tree_title')}
                </Text>
            </View>

            {/* Search + Add */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Icon
                        name="search-outline"
                        size={20}
                        color="#999"
                        style={{ marginLeft: 8 }}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t(
                            'family_tree.search_placeholder',
                            'Tìm kiếm gia phả'
                        )}
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                        onSubmitEditing={handleSearch}
                    />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" />
            ) : (
                <FlatList
                    data={trees}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={{padding: 20, alignItems: 'center'}}>
                            <Text>{t('family_tree.no_data', 'Không có gia phả nào')}</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 40
    },
    headerContainer: {
        backgroundColor: '#007bff',
        paddingVertical: 16,
        alignItems: 'center',
    },
    header: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },

    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    addButton: {
        backgroundColor: "#FF8C00",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    listContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
    },
    cardImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    cardText: {
        flex: 1,
        fontSize: 16,
    },
});

export default FamilyTreeScreen;
