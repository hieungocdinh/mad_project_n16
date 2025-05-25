import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    StatusBar,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/root-stack-param';

import images from '../../utils/images';
import profileApi from '../../api/profileApi';

import ProfileResponse from '../../types/response/profile-response';

type ProfileDetailViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileDetailView'>;
    route: RouteProp<RootStackParamList, 'ProfileDetailView'>;
};

const ProfileDetailView: React.FC<ProfileDetailViewProps> = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { profileId } = route.params;
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);

    const fetchProfileDetail = async () => {
        try {
            setLoading(true);
            const response = await profileApi.getProfileDetail(profileId);
            setProfileData(response.data);
            setLoading(false);
        } catch (error) {
            // TODO: Thông báo lỗi cho người dùng
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchProfileDetail();
        }, [profileId])
    );

    // Xử lý sự kiện quay lại
    const handleBack = () => {
        navigation.goBack();
    };

    // Xử lý sự kiện cập nhật profile
    const handleUpdate = () => {
        navigation.navigate('ProfileUpdateView', { profileId, isFirstLogin: false });
    }

    // Xử lý sự kiện nhấn vào người thân
    const handleRelation = (relation: any) => () => {
        console.log('relation', relation);
        navigation.navigate('ProfileDetailView', { profileId: relation.id });
    }

    // Hàm chuyển đổi định dạng ngày
    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return '...';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Hàm render danh sách người thân
    const renderRelationItem = (relations: any) => {
        if (!relations) return null;

        const relationKeyMap: { [key: string]: string } = {
            father: t('father'),
            mother: t('mother'),
            wife: t('wife'),
            husband: t('husband'),
            children: t('children'),
        };

        const items: React.ReactNode[] = [];

        Object.entries(relationKeyMap).forEach(([key, label]) => {
            const relation = relations[key];

            if (Array.isArray(relation) && relation.length > 0) {
                relation.forEach((person, index) => {
                    items.push(
                        <View key={`${key}-${index}`} style={styles.relationRow}>
                            <Text style={styles.relationLabel}>
                                {index === 0 ? `${label}:` : ' '}
                            </Text>
                            <TouchableOpacity onPress={handleRelation(person)}>
                                <Text style={styles.relationValue}>{person.fullName} - {t(person.gender.toLowerCase())}</Text>
                            </TouchableOpacity>
                        </View>
                    );
                });
            } else if (relation && typeof relation === 'object') {
                items.push(
                    <View key={key} style={styles.relationRow}>
                        <Text style={styles.relationLabel}>{label}:</Text>
                        <TouchableOpacity onPress={handleRelation(relation)}>
                            <Text style={styles.relationValue}>{relation.fullName}</Text>
                        </TouchableOpacity>
                    </View>
                );
            }
        });

        return <View style={styles.relationGroup}>{items}</View>;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.statusBarSpace} />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{profileData?.fullName}</Text>
                <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                    <Text style={styles.updateButtonText}>{t('edit')}</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text>{t('loading')}</Text>
                </View>
            ) : profileData && (
                <ScrollView contentContainerStyle={styles.content}>
                    <TouchableWithoutFeedback onPress={() => setAvatarModalVisible(true)}>
                        <Image
                            source={profileData.avatarUrl ? { uri: profileData.avatarUrl } : images.defaultAvatar}
                            style={styles.avatar}
                        />
                    </TouchableWithoutFeedback>
                    <View style={styles.infoGroup}>
                        <Text style={styles.biography}>
                            {profileData.biography ? profileData.biography : t('no_biography')}
                        </Text>
                        <Text style={styles.info}>
                            <Text style={styles.boldText}>{t('gender')}: </Text>
                            {t(profileData.gender.toLowerCase())}
                        </Text>
                        <Text style={styles.info}>
                            <Text style={styles.boldText}>{t('birth_date')}: </Text>
                            {formatDate(profileData.birthDate)}
                        </Text>
                        <Text style={styles.info}>
                            <Text style={styles.boldText}>{t('death_date')}: </Text>
                            {profileData.deathDate ? formatDate(profileData.deathDate) : "..."}
                        </Text>
                        <Text style={styles.info}>
                            <Text style={styles.boldText}>{t('address')}: </Text>
                            {profileData.address ? profileData.address : '...'}
                        </Text>

                        <Text style={[styles.info, styles.boldText]}>{t('relations')}:</Text>
                        {renderRelationItem(profileData.relations)}
                    </View>
                </ScrollView>
            )}

            {/* Modal hiển thị avatar */}
            <Modal visible={avatarModalVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setAvatarModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <Image
                                source={{ uri: profileData?.avatarUrl }}
                                style={styles.avatarFull}
                                resizeMode="contain"
                            />
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default ProfileDetailView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    statusBarSpace: {
        height: StatusBar.currentHeight || 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    backButton: {
        width: 40,
    },
    updateButton: {
        backgroundColor: '#1e88e5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    content: {
        padding: 20,
    },
    avatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignSelf: 'center',
        marginBottom: 8,
    },
    infoGroup: {
        marginTop: 6,
    },
    info: {
        fontSize: 16,
        marginVertical: 6,
    },
    boldText: {
        fontWeight: 'bold',
    },
    biography: {
        fontStyle: 'italic',
        marginTop: 10,
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarFull: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
    },
    relationGroup: {
        marginTop: 0,
        paddingLeft: 16,
    },
    relationRow: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    relationLabel: {
        width: 60,
        fontWeight: 'bold',
    },
    relationValue: {
        flex: 1,
        paddingLeft: 8,
    },
});
