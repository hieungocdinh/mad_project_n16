import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/root-stack-param';
import { useTranslation } from 'react-i18next';

import albumApi from '../../api/albumApi';
import AlbumResponse from '../../types/response/album-response';

type AlbumDetailInfoViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'AlbumDetailInfoView'>;
    route: RouteProp<RootStackParamList, 'AlbumDetailInfoView'>;
};

const AlbumDetailInfoView: React.FC<AlbumDetailInfoViewProps> = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { albumId } = route.params;
    const [album, setAlbum] = useState<AlbumResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlbumDetail = async () => {
            try {
                setLoading(true);
                const response = await albumApi.getAlbumDetail(albumId);
                setAlbum(response.data);
                setLoading(false);
            } catch (error) {
                // TODO: Thông báo lỗi cho người dùng - Alert
                console.error('Error fetching album details:', error);
                setLoading(false);
            }
        };

        fetchAlbumDetail();
    }, [albumId]);

    // Xử lý sự kiện quay lại
    const handleBack = () => {
        navigation.goBack();
    };

    // Định dạng ngày tháng từ chuỗi ISO
    const formatDate = (isoString: string): string => {
        try {
            const date = new Date(isoString);
            return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        } catch (e) {
            return isoString;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.statusBarSpace} />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={22} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('album_info')}</Text>
                    <View style={styles.rightPlaceholder} />
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.loadingText}>{t('loading')}</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.detailItem}>
                        <View style={styles.detailLeft}>
                            <Text style={styles.detailLabel}>{t('album_name')}:</Text>
                        </View>
                        <View style={styles.detailRight}>
                            <Text style={styles.detailValue}>{album?.albumName}</Text>
                        </View>
                        <View style={styles.separator} />
                    </View>

                    <View style={styles.detailItem}>
                        <View style={styles.detailLeft}>
                            <Text style={styles.detailLabel}>{t('album_created_at')}:</Text>
                        </View>
                        <View style={styles.detailRight}>
                            <Text style={styles.detailValue}>{album ? formatDate(album.createdAt) : ''}</Text>
                        </View>
                        <View style={styles.separator} />
                    </View>

                    <View style={styles.detailItem}>
                        <View style={styles.detailLeft}>
                            <Text style={styles.detailLabel}>{t('album_total_images')}:</Text>
                        </View>
                        <View style={styles.detailRight}>
                            <Text style={styles.detailValue}>{album?.totalImages}</Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default AlbumDetailInfoView;

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
        height: 56,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    scrollView: {
        flex: 1,
        marginTop: 16,
    },
    detailItem: {
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    detailLeft: {
        marginBottom: 8,
    },
    detailLabel: {
        fontSize: 16,
        color: '#333',
    },
    detailRight: {
        marginTop: 4,
    },
    detailValue: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginTop: 16,
    }
});
