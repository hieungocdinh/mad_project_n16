import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    Image,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types/root-stack-param';

import images from '../../utils/images';

import profileApi from '../../api/profileApi';
import ProfileResponse from '../../types/response/profile-response';

type ListProfileViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ListProfileView'>;
    route: RouteProp<RootStackParamList, 'ListProfileView'>;
};

const ListProfileView: React.FC<ListProfileViewProps> = ({ route, navigation }) => {
    const { familyId } = route.params;
    const { t } = useTranslation();
    const [originalProfileData, setOriginalProfileData] = useState<ProfileResponse[]>([]);
    const [profileData, setProfileData] = useState<ProfileResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'NULL' | 'ASC' | 'DESC'>('NULL');

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            const response = await profileApi.getListProfile(familyId);

            setOriginalProfileData(response.data);
            setProfileData(response.data);
            setLoading(false);
        } catch (error) {
            // TODO: Thông báo lỗi cho người dùng
            console.error('Error fetching profile data:', error);
            setLoading(false);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchProfileData();
        }, [])
    );

    // Xử lý sự kiện quay lại
    const handleBack = () => {
        navigation.goBack();
    };

    // Xử lý sự kiện bấm vào 1 hồ sơ
    const navigateToProfileDetail = (item: ProfileResponse) => {
        navigation.navigate('ProfileDetailView', { profileId: item.id });
    }

    // Xử lý sự kiện tìm kiếm
    const handleSearch = (text: string) => {
        setSortOrder('NULL');
        if (text.trim() === '') {
            setProfileData(originalProfileData);
        } else {
            const filtered = originalProfileData.filter(profile =>
                profile.fullName.toLowerCase().includes(text.toLowerCase())
            );
            setProfileData(filtered);
        }
    };

    // Xử lý sự kiện sắp xếp
    const handleSort = () => {
        let nextSortOrder: 'NULL' | 'ASC' | 'DESC' = 'ASC';
        if (sortOrder === 'ASC') {
            nextSortOrder = 'DESC';
        } else if (sortOrder === 'DESC') {
            nextSortOrder = 'ASC';
        }

        setSortOrder(nextSortOrder);

        if (nextSortOrder === 'ASC') {
            const sorted = [...profileData].sort((a, b) =>
                a.fullName.localeCompare(b.fullName)
            );
            setProfileData(sorted);
        } else if (nextSortOrder === 'DESC') {
            const sorted = [...profileData].sort((a, b) =>
                b.fullName.localeCompare(a.fullName)
            );
            setProfileData(sorted);
        }
    };

    // Render item trong danh sách
    const renderProfileItem = ({ item }: { item: ProfileResponse }) => {
        return (
            <TouchableOpacity
                style={styles.memberItem}
                onPress={() => navigateToProfileDetail(item)}
            >
                <Image
                    source={item.avatarUrl ? { uri: item.avatarUrl } : images.defaultAvatar}
                    style={styles.avatar}
                />
                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.fullName}</Text>
                    <Text style={styles.memberDetails}>{t(item.gender.toLowerCase())} - {item.age} {t('age')}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.statusBarSpace} />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('list_profile')}</Text>
                    <View style={styles.rightPlaceholder} />
                </View>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={22} color="#888" />

                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('input_name_to_search')}
                        multiline={false}
                        numberOfLines={1}
                        onChangeText={handleSearch}
                    />

                    <TouchableOpacity onPress={handleSort}>
                        {sortOrder === 'NULL' && <Ionicons name="swap-vertical" size={22} color="#000" />}
                        {sortOrder === 'ASC' && (
                            <View style={styles.iconWrapper}>
                                <Ionicons name="arrow-up" size={22} color="#000" />
                                <Text style={styles.sortLabelUp}>A</Text>
                                <Text style={styles.sortLabelDown}>Z</Text>
                            </View>
                        )}
                        {sortOrder === 'DESC' && (
                            <View style={styles.iconWrapper}>
                                <Ionicons name="arrow-down" size={22} color="#000" />
                                <Text style={styles.sortLabelUp}>A</Text>
                                <Text style={styles.sortLabelDown}>Z</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nội dung chính */}
            {loading ?
                (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2196F3" />
                        <Text style={styles.loadingText}>{t('loading')}</Text>
                    </View>
                ) :
                (<FlatList
                    data={profileData}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderProfileItem}
                    contentContainerStyle={styles.listContent}
                />
                )
            }
        </SafeAreaView>
    );
};

export default ListProfileView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    statusBarSpace: {
        height: StatusBar.currentHeight || 20,
    },
    headerContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        height: 50,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    rightPlaceholder: {
        width: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
        marginTop: 0,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
        height: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    memberItem: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        backgroundColor: '#ccc',
        marginRight: 20,
    },
    memberInfo: {
        flex: 1,
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    memberDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    iconWrapper: {
        position: 'relative',
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sortLabelUp: {
        position: 'absolute',
        top: 0,
        right: -3,
        fontSize: 10,
        color: '#000',
        zIndex: 1,
    },
    sortLabelDown: {
        position: 'absolute',
        top: 12,
        right: -3,
        fontSize: 10,
        color: '#000',
        zIndex: 1,
    }
});
