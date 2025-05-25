import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/root-stack-param';

import imageApi from '../../api/imageApi';
import albumApi from '../../api/albumApi';
import ImageResponse from '../../types/response/image-response';

type SelectImageForAlbumViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SelectImageForAlbumView'>;
    route: RouteProp<RootStackParamList, 'SelectImageForAlbumView'>;
};

const SelectImageForAlbumView: React.FC<SelectImageForAlbumViewProps> = ({ route, navigation }) => {
    const { type, familyId, albumId, albumRequest } = route.params;
    const { t } = useTranslation();

    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<ImageResponse[]>([]);
    const [selectedImages, setSelectedImages] = useState<ImageResponse[]>([]);

    useEffect(() => {
        const fetchImageDetail = async () => {
            try {
                setLoading(true);

                let listImage: ImageResponse[] = [];
                switch (type) {
                    case 'create_cover': {
                        const response = await imageApi.getListImageForAlbum(familyId);
                        const selectedIds = albumRequest.images?.map(item => item.id) || [];
                        listImage = response.data.filter(image => selectedIds.includes(image.id));
                        break;
                    }
                    case 'update_cover': {
                        const response = await imageApi.getListImageForAlbum(familyId, albumId, true);
                        listImage = response.data;
                        break;
                    }
                    case 'create_images_in_album': {
                        const response = await imageApi.getListImageForAlbum(familyId);
                        listImage = response.data;
                        break;
                    }
                    case 'add_images_to_album': {
                        const response = await imageApi.getListImageForAlbum(familyId, albumId, false);
                        listImage = response.data;
                        break;
                    }
                    default:
                        break;
                }

                setImages(listImage);
                setLoading(false);
            } catch (error) {
                // TODO: Thông báo lỗi cho người dùng - Alert
                console.error('Error fetching image details:', error);
                setLoading(false);
            }
        };

        fetchImageDetail();
    }, [albumRequest, type]);

    // Xử lý sự kiện quay lại
    const handleBack = () => {
        navigation.goBack();
    };

    // Xử lý sự kiện next
    const handleNext = () => {
        switch (type) {
            case 'create_cover':
                albumRequest.coverImageUrl = selectedImages[0].url;
                albumApi.createAlbum(familyId, albumRequest)
                    .then(() => {
                        navigation.pop(2);
                    })
                    .catch(error => {
                        console.error('Error creating album cover:', error);
                        Alert.alert(t('create_error_title'), t('create_error_message'));
                    });
                break;
            case 'update_cover':
                if (!albumId) {
                    return; // Dừng lại nếu albumId không có
                }
                albumRequest.coverImageUrl = selectedImages[0].url;
                albumApi.updateAlbum(albumId, albumRequest)
                    .then(() => {
                        navigation.pop(2);
                    })
                    .catch(error => {
                        console.error('Error updating album cover:', error);
                        Alert.alert(t('update_error_title'), t('update_error_message'));
                    });
                break;
            case 'create_images_in_album':
                albumRequest.images = selectedImages.map(item => ({ id: item.id }));
                navigation.push('SelectImageForAlbumView', { type: 'create_cover', familyId, albumRequest });
                break;
            case 'add_images_to_album':
                if (!albumId) {
                    return; // Dừng lại nếu albumId không có
                }
                albumRequest.images = selectedImages.map(item => ({ id: item.id }));
                albumApi.updateAlbum(albumId, albumRequest)
                    .then(() => {
                        navigation.goBack();
                    })
                    .catch(error => {
                        console.error('Error adding images to album:', error);
                        Alert.alert(t('update_error_title'), t('update_error_message'));
                    });

                break;
            default:
                break;
        }
    };

    // Xử lý sự kiện chọn ảnh
    const handleSelect = (image: ImageResponse) => {
        if (type === 'create_cover' || type === 'update_cover') {
            setSelectedImages([image]);
        } else {
            if (selectedImages.includes(image)) {
                setSelectedImages(selectedImages.filter(item => item !== image));
            } else {
                setSelectedImages([...selectedImages, image]);
            }
        }
    };

    // Render mỗi item trong lưới
    const renderImageItem = ({ item }: { item: ImageResponse }) => {
        const isSelected = selectedImages.includes(item);
        return (
            <TouchableOpacity
                style={[styles.imageItem]}
                onPress={() => handleSelect(item)}
            >
                <Image
                    source={{ uri: item.url }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.iconWrapper}>
                    {isSelected ? (
                        <Ionicons name="checkmark-circle" size={26} color="#1e88e5" />
                    ) : (
                        <Ionicons name="ellipse" size={26} color="#ccc" />
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.statusBarSpace} />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>

                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>
                            {t(type)}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={handleNext}
                        disabled={selectedImages.length === 0}
                    >
                        <Ionicons
                            name="checkmark-sharp"
                            size={26}
                            color={selectedImages.length > 0 ? "#1e88e5" : "#ccc"}
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
                    data={images}
                    renderItem={renderImageItem}
                    keyExtractor={item => item.id.toString()}
                    numColumns={4}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            )}
        </View>
    );
};

export default SelectImageForAlbumView;

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
    nextButton: {
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
    headerTitle: {
        fontSize: 18,
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
    selected: {
        borderColor: '#007bff',
        borderWidth: 2,
        borderRadius: 6,
    },
    imageItem: {
        width: '25%',
        aspectRatio: 1,
        padding: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
    },
    iconWrapper: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: 'transparent',
    },
});
