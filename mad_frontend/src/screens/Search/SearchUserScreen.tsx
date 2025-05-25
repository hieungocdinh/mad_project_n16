// src/screens/SearchUserScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import userApi from '../../api/userApi';
import UserResponse from '../../types/response/user-response';
import { RootStackParamList } from '../../types/root-stack-param';

type SearchUserRouteProp = RouteProp<RootStackParamList, 'SearchUser'>;
type SearchUserNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchUser'>;

const SearchUserScreen: React.FC = () => {
    const navigation = useNavigation<SearchUserNavigationProp>();
    const route = useRoute<SearchUserRouteProp>();
    const { role, onSelect } = route.params!;
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [page] = useState(0);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const res = await userApi.searchUsers(searchTerm, page, 10);
            // nếu API trả về { data: { content: UserResponse[] } }
            const list = res.data.content ?? res.data;
            setUsers(sortUsers(list));
        } catch (err) {
            console.error('Error searching users:', err);
            Alert.alert(t('error_loading_users'));
        } finally {
            setLoading(false);
        }
    };

    const sortUsers = (data: UserResponse[]) => {
        return [...data].sort((a, b) => {
            const nameA = a.username.toLowerCase();
            const nameB = b.username.toLowerCase();
            return sortOrder === 'asc'
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
        });
    };

    const handleSearch = () => {
        loadUsers();
    };

    const handleSortChange = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        setUsers(prev => sortUsers(prev));
    };

    const handleSelectUser = (user: UserResponse) => {
        onSelect(user);
        navigation.goBack();
    };

    const handleViewDetail = (user: UserResponse) => {
        Alert.alert(t('navigate_to_profile', { name: user.username }));
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={t('search_by_username')}
                value={searchTerm}
                onChangeText={setSearchTerm}
                returnKeyType="search"
                onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.button} onPress={handleSearch}>
                <Text style={styles.buttonText}>{t('search')}</Text>
            </TouchableOpacity>

            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>{t('sort_by_name')}</Text>
                <TouchableOpacity style={styles.sortButton} onPress={handleSortChange}>
                    <Text style={styles.sortText}>{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={users}
                keyExtractor={item => item.userId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.username}>{item.username}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.connectButton}
                                onPress={() => handleSelectUser(item)}
                            >
                                <Text style={styles.connectButtonText}>{t('connect')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.detailButton}
                                onPress={() => handleViewDetail(item)}
                            >
                                <Text style={styles.detailButtonText}>{t('detail')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#1e88e5',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    sortLabel: {
        marginRight: 8,
        fontSize: 16,
    },
    sortButton: {
        backgroundColor: '#eee',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    sortText: {
        fontSize: 16,
        color: '#333',
    },
    card: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    connectButton: {
        backgroundColor: '#e53935',
        padding: 8,
        borderRadius: 6,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    connectButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    detailButton: {
        backgroundColor: '#1e88e5',
        padding: 8,
        borderRadius: 6,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    detailButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SearchUserScreen;
