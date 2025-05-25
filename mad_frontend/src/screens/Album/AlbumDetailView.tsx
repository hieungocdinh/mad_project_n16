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
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types/root-stack-param';

import OptionsMenu from '../../components/OptionsMenu';
import CustomDialog from '../../components/CustomDialog';

import albumApi from '../../api/albumApi';
import AlbumResponse from '../../types/response/album-response';
import ImageResponse from '../../types/response/image-response';

type AlbumDetailViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AlbumDetailView'>;
    route: RouteProp<RootStackParamList, 'AlbumDetailView'>;
};

const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({ route, navigation }) => {
    const { familyId, albumId } = route.params;
    const { t } = useTranslation();
    const [album, setAlbum] = useState<AlbumResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOptionsMenuVisible, setOptionsMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const [isDeleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [isRenameDialogVisible, setRenameDialogVisible] = useState(false);

    const fetchAlbumDetail = async () => {
        try {
            setLoading(true);
            const response = await albumApi.getAlbumDetail(albumId);
            setAlbum(response.data);
            setLoading(false);
        } catch (error) {
            // TODO: Thông báo lỗi cho người dùng - Alert
            console.error('Error fetching album detail:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchAlbumDetail();
        }, [])
    );

    // Xử lý khi nhấn vào hình ảnh
    const handleImagePress = (image: ImageResponse) => {
        navigation.navigate('ImageDetailView', { imageId: image.id, albumId });
    };

    // Xử lý khi nhấn nút back
    const handleBack = () => {
        navigation.goBack();
    };

    // Xử lý menu options (nút 3 chấm)
    const handleShowOptions = () => {
        const headerHeight = 50;
        setMenuPosition({
            top: headerHeight + 4,
            right: 4,
        });
        setOptionsMenuVisible(true);
    };

    // Xử lý khi nhấn nút thêm ảnh
    const handleAddImage = () => {
        navigation.navigate('SelectImageForAlbumView', { type: 'add_images_to_album', familyId, albumId, albumRequest: {} });
    };

    // Render mỗi item trong lưới
    const renderImageItem = ({ item }: { item: ImageResponse }) => (
        <TouchableOpacity
            style={styles.imageItem}
            onPress={() => handleImagePress(item)}
        >
            <Image
                source={{ uri: item.url }}
                style={styles.image}
                resizeMode="cover"
            />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header với khoảng cách bảo vệ khỏi thanh trạng thái */}
            <View style={styles.headerContainer}>
                <View style={styles.statusBarSpace} />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle} numberOfLines={1}>
                            {album?.albumName || ''}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.headerButton} onPress={handleShowOptions}>
                        <Ionicons name="ellipsis-vertical" size={22} color="#000" />
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
                    data={album?.images}
                    renderItem={renderImageItem}
                    keyExtractor={item => item.id.toString()}
                    numColumns={4}
                />
            )}

            {/* Nút thêm ảnh (+) ở góc dưới bên phải */}
            <TouchableOpacity
                style={styles.floatingAddButton}
                onPress={handleAddImage}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Menu tùy chọn */}
            <OptionsMenu
                visible={isOptionsMenuVisible}
                onClose={() => setOptionsMenuVisible(false)}
                position={menuPosition}
                menuItems={[
                    {
                        label: "Thông tin album",
                        onPress: () => {
                            navigation.navigate('AlbumDetailInfoView', { albumId });
                            setOptionsMenuVisible(false);
                        }
                    },
                    {
                        label: "Đổi tên album",
                        onPress: () => {
                            setRenameDialogVisible(true);
                            setOptionsMenuVisible(false);
                        }
                    },
                    {
                        label: "Đổi bìa album",
                        onPress: () => {
                            navigation.navigate('SelectImageForAlbumView', { type: 'update_cover', familyId, albumId, albumRequest: {} });
                            setOptionsMenuVisible(false);
                        }
                    },
                    {
                        label: "Xóa album",
                        onPress: () => {
                            setDeleteDialogVisible(true);
                            setOptionsMenuVisible(false);
                        },
                        isDestructive: true
                    }
                ]}
            />

            {/* Dialog đổi tên */}
            <CustomDialog
                visible={isRenameDialogVisible}
                title={t('rename_album_title')}
                showInput={true}
                confirmText={t('change')}
                cancelText={t('cancel')}
                onConfirm={async (newName) => {
                    try {
                        await albumApi.updateAlbum(albumId, { albumName: newName });
                        fetchAlbumDetail();
                        setRenameDialogVisible(false);
                    } catch (error) {
                        console.error('Error deleting image in album:', error);
                        Alert.alert(t('update_error_title'), t('update_error_message'));
                    }
                }}
                onCancel={() => setRenameDialogVisible(false)}
                inputValue={album?.albumName || ''}
            />

            {/* Dialog xác nhận xóa */}
            <CustomDialog
                visible={isDeleteDialogVisible}
                title={t('delete_album_title')}
                message={t('delete_album_message')}
                confirmText={t('delete')}
                cancelText={t('cancel')}
                isDestructive={true}
                onConfirm={async () => {
                    try {
                        await albumApi.deleteAlbum(albumId);
                        navigation.goBack();
                    } catch (error) {
                        console.error('Error deleting album:', error);
                        Alert.alert(t('delete_error_title'), t('delete_error_message'));
                    }
                }}
                onCancel={() => setDeleteDialogVisible(false)}
            />
        </SafeAreaView>
    );
};

export default AlbumDetailView;

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
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 15,
        height: 50,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    headerDate: {
        fontSize: 12,
        color: '#888',
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
    imageItem: {
        width: '25%',
        aspectRatio: 1,
        padding: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
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
    },
});