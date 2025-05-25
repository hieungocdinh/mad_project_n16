import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    FlatList,
    Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types/root-stack-param';

import CustomDialog from '../../components/CustomDialog';

import AlbumResponse from '../../types/response/album-response';
import albumApi from '../../api/albumApi';

type ListAlbumViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ListAlbumView'>;
    route: RouteProp<RootStackParamList, 'ListAlbumView'>;
};

const ListAlbumView: React.FC<ListAlbumViewProps> = ({ route, navigation }) => {
    const { familyId } = route.params;
    const { t } = useTranslation();
    const [albums, setAlbums] = useState<AlbumResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'DESC' | 'ASC'>('DESC');
    const [isSetNameDialogVisible, setSetNameDialogVisible] = useState(false);


    const fetchAlbums = async () => {
        try {
            setLoading(true);
            const response = await albumApi.getListAlbum(familyId);
            setAlbums(response.data);
            setLoading(false);
        } catch (error) {
            // TODO: Thông báo lỗi cho người dùng - Alert
            console.error('Error fetching albums:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchAlbums();
        }, [])
    );

    // Xử lý khi nhấn nút sắp xếp
    const handleSortPress = () => {
        // Đảo ngược thứ tự sắp xếp
        const newSortOrder = sortOrder === 'DESC' ? 'ASC' : 'DESC';

        // Sắp xếp lại albums theo thứ tự mới
        const sortedAlbums = [...albums].sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();

            return newSortOrder === 'ASC'
                ? dateA - dateB
                : dateB - dateA;
        });

        // Cập nhật cả hai state trong một lần xử lý
        setSortOrder(newSortOrder);
        setAlbums(sortedAlbums);
    };

    // Xử lý khi nhấn vào album
    const handleAlbumPress = (album: AlbumResponse) => {
        navigation.navigate('AlbumDetailView', { albumId: album.id, familyId });
    };

    // Xử lý khi nhấn nút thêm album
    const handleAddAlbum = () => {
        setSetNameDialogVisible(true);
    };

    // Xử lý khi chuyển đổi tab
    const handleTabChange = (tab: string) => {
        if (tab === 'images') {
            navigation.replace('ListImageView', { familyId });
        }
    };

    // Xử lý khi nhấn nút back
    const handleBack = () => {
        navigation.goBack();
    };

    // Render mỗi item trong lưới
    const renderAlbumItem = ({ item }: { item: AlbumResponse }) => (
        <TouchableOpacity
            style={styles.albumItem}
            onPress={() => handleAlbumPress(item)}
        >
            <View style={styles.albumCover}>
                <Image
                    source={{ uri: item.coverImageUrl }}
                    style={styles.albumCoverImage}
                />
            </View>
            <Text style={styles.albumName} numberOfLines={1}>{item.albumName}</Text>
            <Text style={styles.albumCount}>{item.totalImages} {t('image')}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header với khoảng cách bảo vệ khỏi thanh trạng thái */}
            <View style={styles.headerContainer}>
                <View style={styles.statusBarSpace} />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => handleTabChange('images')}
                        >
                            <Text style={styles.tabText}>{t('image')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.tabActive}
                            onPress={() => handleTabChange('albums')}
                        >
                            <Text style={styles.tabTextActive}>{t('album')}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.menuButton} onPress={handleSortPress}>
                        <Ionicons
                            name={sortOrder === 'DESC' ? "arrow-down" : "arrow-up"}
                            size={22}
                            color="#000"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nội dung chính */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.loadingText}>{t('loading')}</Text>
                </View>
            ) : (
                <FlatList
                    data={albums}
                    renderItem={renderAlbumItem}
                    keyExtractor={item => item.id.toString()}
                    numColumns={3}
                    contentContainerStyle={styles.albumList}
                />
            )}

            {/* Nút thêm album (+) ở góc dưới bên phải */}
            <TouchableOpacity
                style={styles.floatingAddButton}
                onPress={handleAddAlbum}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Dialog đặt tên */}
            <CustomDialog
                visible={isSetNameDialogVisible}
                title={t('set_name_album_title')}
                showInput={true}
                confirmText={t('set')}
                cancelText={t('cancel')}
                onConfirm={(name) => {
                    navigation.navigate('SelectImageForAlbumView', { type: 'create_images_in_album', familyId, albumRequest: { albumName: name } });
                    setSetNameDialogVisible(false);
                }}
                onCancel={() => setSetNameDialogVisible(false)}
                inputValue=""
            />
        </SafeAreaView>
    );
};

export default ListAlbumView;

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
        padding: 10,
        height: 50,
        paddingHorizontal: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 15,
    },
    tab: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    tabActive: {
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#2196F3',
    },
    tabText: {
        fontSize: 16,
    },
    tabTextActive: {
        fontSize: 16,
        color: '#2196F3',
        fontWeight: 'bold',
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
    albumList: {
        padding: 10,
    },
    albumItem: {
        width: '33.33%',
        padding: 10,
        alignItems: 'center',
    },
    albumCover: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    albumCoverImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    },
    coverPlaceholder: {
        fontSize: 14,
        color: '#888',
    },
    albumName: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 2,
    },
    albumCount: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
    floatingAddButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1e88e5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});