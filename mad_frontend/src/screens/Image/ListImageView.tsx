import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../../types/root-stack-param';
import { uploadImageToCloudinary } from '../../utils/cloudinaryConfig';
import imageApi from '../../api/imageApi';
import ImageResponse from '../../types/response/image-response';

type ListImageViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ListImageView'>;
    route: RouteProp<RootStackParamList, 'ListImageView'>;
};

const ListImageView: React.FC<ListImageViewProps> = ({ route, navigation }) => {
    const { familyId } = route.params;
    const { t } = useTranslation();
    const [imagesData, setImagesData] = useState<{ [key: string]: ImageResponse[] }>({});
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'DESC' | 'ASC'>('DESC');

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await imageApi.getListImage(familyId);
            setImagesData(response.data);
            setLoading(false);
        } catch (error) {
            // TODO: Thông báo lỗi cho người dùng - Alert
            console.error('Error fetching images:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchImages();
        }, [])
    );

    // Xử lý khi nhấn vào ảnh
    const handleImagePress = (image: ImageResponse) => {
        navigation.navigate('ImageDetailView', { imageId: image.id });
    };

    // Xử lý khi nhấn nút thêm ảnh
    const handleAddImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert(t('permission_denied'));
            return;
        }

        // Mở bộ sưu tập
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            try {
                // Upload nhiều ảnh cùng lúc lên Cloudinary
                const uploadedUrls = await Promise.all(
                    result.assets.map(asset => uploadImageToCloudinary(asset.uri))
                );
                // Tạo ảnh vào DB
                const response = await imageApi.createImages(familyId, uploadedUrls);
                if (response.code === 201) {
                    await fetchImages();
                }
                else {
                    Alert.alert(t('create_error_title'), t('create_error_message'));
                    console.error('Error', response.message);
                }
            } catch (error) {
                Alert.alert('Upload images failed!');
                console.error('Error', error);
            }
        }
    };

    // Xử lý khi chuyển đổi tab
    const handleTabChange = (tab: string) => {
        if (tab === 'albums') {
            navigation.replace('ListAlbumView', { familyId });
        }
    };

    // Xử lý khi nhấn nút back
    const handleBack = () => {
        navigation.goBack();
    };

    // Xử lý khi nhấn nút sắp xếp
    const handleSortPress = () => {
        // Đảo ngược thứ tự sắp xếp
        const newSortOrder = sortOrder === 'DESC' ? 'ASC' : 'DESC';

        // Sắp xếp lại albums theo thứ tự mới
        const dates = Object.keys(imagesData);
        const sortedDates = dates.sort((a, b) => {
            const datePartsA = a.split('/').map(Number);
            const datePartsB = b.split('/').map(Number);
            const dateA = new Date(datePartsA[2], datePartsA[1] - 1, datePartsA[0]);
            const dateB = new Date(datePartsB[2], datePartsB[1] - 1, datePartsB[0]);
            return newSortOrder === 'ASC'
                ? dateA.getTime() - dateB.getTime()
                : dateB.getTime() - dateA.getTime();
        });
        const sortedData = sortedDates.reduce((acc, date) => {
            acc[date] = imagesData[date];
            return acc;
        }, {} as { [key: string]: ImageResponse[] });

        // Cập nhật cả hai state trong một lần xử lý
        setSortOrder(newSortOrder);
        setImagesData(sortedData);
    };

    // Hàm chuyển đổi ngày thành nhãn (Hôm nay/Hôm qua/Ngày thực tế)
    const formatDateLabel = (dateString: string): string => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const formatDate = (date: Date): string => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };

        const todayString = formatDate(today);
        const yesterdayString = formatDate(yesterday);

        if (dateString === todayString) {
            return t('today');
        } else if (dateString === yesterdayString) {
            return t('yesterday');
        } else {
            return dateString;
        }
    };

    // Hiển thị lưới ảnh
    const renderImageGrid = (images: ImageResponse[]) => {
        const rows = [];
        for (let i = 0; i < images.length; i += 4) {
            const rowImages = images.slice(i, i + 4);
            rows.push(
                <View key={`row-${i}`} style={styles.imageRow}>
                    {rowImages.map(image => (
                        <TouchableOpacity
                            key={image.id}
                            style={styles.imageContainer}
                            onPress={() => handleImagePress(image)}
                        >
                            <View style={styles.image}>
                                <Image
                                    source={{ uri: image.url }}
                                    style={styles.imageImage}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                    {/* Thêm ô trống nếu số ảnh không đủ 4 */}
                    {rowImages.length < 4 && Array(4 - rowImages.length).fill(0).map((_, index) => (
                        <View key={`empty-${index}`} style={styles.emptySpace} />
                    ))}
                </View>
            );
        }
        return rows;
    };

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
                            style={styles.tabActive}
                            onPress={() => handleTabChange('images')}
                        >
                            <Text style={styles.tabTextActive}>{t('image')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => handleTabChange('albums')}
                        >
                            <Text style={styles.tabText}>{t('album')}</Text>
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
                <ScrollView style={styles.scrollView}>
                    {Object.keys(imagesData || {}).map((date, index) => (
                        <View key={`group-${index}`} style={styles.imageGroup}>
                            <Text style={styles.groupTitle}>{formatDateLabel(date)}</Text>
                            {renderImageGrid(imagesData![date])}
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Nút thêm ảnh (+) ở góc dưới bên phải */}
            <TouchableOpacity
                style={styles.floatingAddButton}
                onPress={handleAddImage}
            >
                <Ionicons name="add" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ListImageView;

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
    scrollView: {
        flex: 1,
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
    imageGroup: {
        marginBottom: 15,
    },
    groupTitle: {
        fontSize: 14,
        color: '#666',
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 8,
        marginBottom: 8,
    },
    imageContainer: {
        width: '25%',
        aspectRatio: 1,
        padding: 3,
    },
    image: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    imageImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 4,
    },
    imageSize: {
        fontSize: 12,
        color: '#666',
    },
    emptySpace: {
        width: '25%',
        aspectRatio: 1,
        padding: 3,
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