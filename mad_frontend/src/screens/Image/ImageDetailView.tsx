import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    ActivityIndicator,
    Share,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/root-stack-param';
import { useTranslation } from 'react-i18next';

import OptionsMenu from '../../components/OptionsMenu';
import CustomDialog from '../../components/CustomDialog';

import imageApi from '../../api/imageApi';
import albumApi from '../../api/albumApi';
import ImageResponse from '../../types/response/image-response';

type ImageDetailViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ImageDetailView'>;
    route: RouteProp<RootStackParamList, 'ImageDetailView'>;
};

const ImageDetailView: React.FC<ImageDetailViewProps> = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { imageId, albumId } = route.params;
    const [image, setImage] = useState<ImageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isOptionsMenuVisible, setOptionsMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 60, right: 15 });
    const [isCustomDialogVisible, setCustomDialogVisible] = useState(false);


    useEffect(() => {
        const fetchImageDetail = async () => {
            try {
                const response = await imageApi.getImageDetail(imageId);
                setImage(response.data);
                setLoading(false);
            } catch (error) {
                // TODO: Thông báo lỗi cho người dùng - Alert
                console.error('Error fetching image details:', error);
                setLoading(false);
            }
        };

        fetchImageDetail();
    }, [imageId]);

    // Lấy tên ảnh từ URL
    const getImageName = (url: string): string => {
        try {
            return url.split('/').pop() || 'image';
        } catch (e) {
            return 'image';
        }
    };

    // Xử lý sự kiện quay lại
    const handleBack = () => {
        navigation.goBack();
    };

    // Xử lý sự kiện chia sẻ ảnh
    const handleShare = async () => {
        if (!image) return;

        try {
            await Share.share({
                message: `Check out this image: ${getImageName(image.url)}`,
                url: image.url,
            });
        } catch (error) {
            Alert.alert('Error', 'Unable to share image');
        }
    };

    // TODO: Xử lý sự kiện thêm vào danh sách yêu thích
    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
    };

    // TODO: Xử lý sự kiện chỉnh sửa ảnh
    const handleEdit = () => {
        if (!image) return;
    };

    // Xử lý sự kiện xóa ảnh
    const handleDelete = () => {
        setCustomDialogVisible(true);
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.statusBarSpace} />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        {image && (
                            <Text style={styles.imageTitle} numberOfLines={1}>
                                {getImageName(image.url)}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity style={styles.menuButton} onPress={handleShowOptions}>
                        <Ionicons name="ellipsis-vertical" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nội dung chính */}
            <View style={styles.content}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#2196F3" />
                        <Text style={styles.loadingText}>{t('loading')}</Text>
                    </View>
                ) : (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: image?.url }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                )}
            </View>

            {/* Thanh công cụ dưới cùng */}
            <View style={styles.bottomToolbar}>
                <TouchableOpacity style={styles.toolbarButton} onPress={handleShare}>
                    <Ionicons name="share-outline" size={28} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolbarButton} onPress={handleToggleFavorite}>
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={28}
                        color={isFavorite ? "#FF6B6B" : "#333"}
                    />
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolbarButton} onPress={handleEdit}>
                    <Ionicons name="pencil-outline" size={28} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.toolbarButton} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Menu tùy chọn */}
            <OptionsMenu
                visible={isOptionsMenuVisible}
                onClose={() => setOptionsMenuVisible(false)}
                position={menuPosition}
                menuItems={[
                    {
                        label: t('image_info'),
                        onPress: () => {
                            navigation.navigate('ImageDetailInfoView', { imageId });
                        }
                    }
                ]}
            />

            {/* Dialog xác nhận xóa */}
            {albumId != null ?
                (<CustomDialog
                    visible={isCustomDialogVisible}
                    title={t('delete_image_in_album_title')}
                    message={t('delete_image_in_album_message')}
                    confirmText={t('delete')}
                    cancelText={t('cancel')}
                    isDestructive={true}
                    onConfirm={async () => {
                        try {
                            await albumApi.deleteImageInAlbum([imageId], albumId);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting image in album:', error);
                            Alert.alert(t('delete_error_title'), t('delete_error_message'));
                        }
                    }}
                    onCancel={() => setCustomDialogVisible(false)}
                />) :
                (<CustomDialog
                    visible={isCustomDialogVisible}
                    title={t('delete_image_title')}
                    message={t('delete_image_message')}
                    confirmText={t('delete')}
                    cancelText={t('cancel')}
                    isDestructive={true}
                    onConfirm={async () => {
                        try {
                            await imageApi.deleteImage([imageId]);
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error deleting image:', error);
                            Alert.alert(t('delete_error_title'), t('delete_error_message'));
                        }
                    }}
                    onCancel={() => setCustomDialogVisible(false)}
                />)}
        </SafeAreaView>
    );
};

export default ImageDetailView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    statusBarSpace: {
        height: StatusBar.currentHeight || 20,
    },
    headerContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
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
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    imageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageDate: {
        fontSize: 12,
        color: '#666',
    },
    menuButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        backgroundColor: '#f0f0f0',
        width: '100%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 24,
        color: '#888',
    },
    bottomToolbar: {
        flexDirection: 'row',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
    },
    toolbarButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});