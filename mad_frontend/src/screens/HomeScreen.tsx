import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/root-stack-param';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../context/authContext";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import NotificationBell from '../components/NotificationBell';
import { fetchReminders } from "../services/reminderService";

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type HomeButtonProps = {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    color?: string;
};

const HomeButton: React.FC<HomeButtonProps> = ({ icon, label, onPress, color }) => (
    <TouchableOpacity style={[styles.homeButton, color && { backgroundColor: color }]} onPress={onPress} activeOpacity={0.85}>
        {icon}
        <Text style={styles.buttonLabel}>{label}</Text>
    </TouchableOpacity>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const { t } = useTranslation();
    const auth = useAuth();
    const currentUser = auth.currentUser;
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        fetchReminders().then(data => {
            const mapped = data
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item: any) => ({
                    id: item.id,
                    title: item.text,
                    content: item.date,
                }));
            setNotifications(mapped);
        });
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.header}>{t('family_app')}</Text>
                    <Text style={styles.subHeader}>{currentUser?.username ? `${t('hello')}, ${currentUser.username}!` : ''}</Text>
                </View>
                <NotificationBell
                    count={notifications.length}
                    notifications={notifications}
                />
            </View>

            {/* Section 1: Ảnh & Album */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('image_and_album')}</Text>
                <View style={styles.buttonRow}>
                    <HomeButton
                        icon={<Ionicons name="image-outline" size={28} color="#1e88e5" />}
                        label={t('view_image')}
                        onPress={() => navigation.navigate('SelectFamily', { type: 'image' })}
                    />
                    <HomeButton
                        icon={<Ionicons name="albums-outline" size={28} color="#1e88e5" />}
                        label={t('view_album')}
                        onPress={() => navigation.navigate('SelectFamily', { type: 'album' })}
                    />
                </View>
            </View>

            {/* Section 2: Gia phả & Sự kiện */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('family_and_event')}</Text>
                <View style={styles.buttonRow}>
                    <HomeButton
                        icon={<MaterialIcons name="account-tree" size={28} color="#1e88e5" />}
                        label={t('tree_category')}
                        onPress={() => navigation.navigate('TreeCategoryScreen')}
                    />
                    <HomeButton
                        icon={<MaterialIcons name="event" size={28} color="#1e88e5" />}
                        label={t('event')}
                        onPress={() => navigation.navigate('EventScreen')}
                    />
                </View>
            </View>

            {/* Section 3: Hồ sơ & Danh sách */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('profile_and_list')}</Text>
                <View style={styles.buttonRow}>
                    <HomeButton
                        icon={<Ionicons name="person-circle-outline" size={28} color="#1e88e5" />}
                        label={t('view_profile')}
                        onPress={() => {
                            if (currentUser?.profileId) {
                                navigation.navigate('ProfileDetailView', { profileId: currentUser.profileId });
                            }
                        }}
                    />
                    <HomeButton
                        icon={<Ionicons name="people-outline" size={28} color="#1e88e5" />}
                        label={t('view_list_profile')}
                        onPress={() => navigation.navigate('SelectFamily', { type: 'profile' })}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#f5f7fa',
        paddingVertical: 32,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
        paddingHorizontal: 6,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e88e5',
        letterSpacing: 1,
    },
    subHeader: {
        fontSize: 16,
        color: '#888',
        marginTop: 2,
    },
    section: {
        width: '100%',
        marginBottom: 22,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        letterSpacing: 0.5,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: 0,
    },
    homeButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e3eafc',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 10,
        width: '48%',
        marginBottom: 14,
        shadowColor: '#1e88e5',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 1,
        minHeight: 90,
    },
    buttonLabel: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
        textAlign: 'center',
    },
});