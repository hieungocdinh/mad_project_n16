import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/root-stack-param';
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/authContext";
import LanguageToggle from "../../components/LanguageToggle";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Menu'>;
};

type MenuButtonProps = {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    danger?: boolean;
};

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, onPress, danger }) => (
    <TouchableOpacity
        style={[
            styles.menuButton,
            danger && { borderColor: '#f44336', backgroundColor: '#fff' }
        ]}
        activeOpacity={0.8}
        onPress={onPress}
    >
        <View style={styles.menuButtonContent}>
            <View style={styles.iconWrapper}>{icon}</View>
            <Text style={[styles.menuButtonLabel, danger && { color: '#f44336' }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={22} color="#1e88e5" style={styles.arrowIcon} />
        </View>
    </TouchableOpacity>
);

const MenuScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useTranslation();
    const { logout } = useAuth();
    const currentUser = useAuth().currentUser;

    const onLogout = () => {
        navigation.navigate('Login');
        logout();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LanguageToggle />
            <Text style={styles.title}>Menu</Text>

            <View style={styles.menuList}>
                <MenuButton
                    icon={<Ionicons name="person-circle-outline" size={24} color="#1e88e5" />}
                    label={t('view_profile')}
                    onPress={() => {
                        if (currentUser?.profileId) {
                            navigation.navigate('ProfileDetailView', { profileId: currentUser.profileId });
                        }
                    }}
                />
                <MenuButton
                    icon={<Ionicons name="image-outline" size={24} color="#1e88e5" />}
                    label={t('view_image')}
                    onPress={() => navigation.navigate('SelectFamily', { type: 'image' })}
                />
                <MenuButton
                    icon={<Ionicons name="albums-outline" size={24} color="#1e88e5" />}
                    label={t('view_album')}
                    onPress={() => navigation.navigate('SelectFamily', { type: 'album' })}
                />
                <MenuButton
                    icon={<MaterialIcons name="library-books" size={24} color="#1e88e5" />}
                    label={t('story_and_event')}
                    onPress={() => navigation.navigate('TreeCategoryScreen')}
                />
                <MenuButton
                    icon={<Ionicons name="people-outline" size={24} color="#1e88e5" />}
                    label={t('view_list_profile')}
                    onPress={() => navigation.navigate('SelectFamily', { type: 'profile' })}
                />
                <MenuButton
                    icon={<Ionicons name="people-circle-outline" size={24} color="#1e88e5" />}
                    label={t('user')}
                    onPress={() => navigation.navigate('ManageUser')}
                />
                <MenuButton
                    icon={<Ionicons name="link-outline" size={24} color="#1e88e5" />}
                    label={t('suggest_connect')}
                    onPress={() => navigation.navigate('SuggestUser')}
                />
                <MenuButton
                    icon={<Ionicons name="settings-outline" size={24} color="#1e88e5" />}
                    label={t('settings')}
                    onPress={() => navigation.navigate('Settings')}
                />
                <MenuButton
                    icon={<Ionicons name="log-out-outline" size={24} color="#f44336" />}
                    label={t('logout')}
                    onPress={onLogout}
                    danger
                />
            
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#e3eafc',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 0,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1e88e5',
        marginBottom: 30,
        letterSpacing: 1,
    },
    menuList: {
        width: '100%',
        paddingHorizontal: 5,
    },
    menuButton: {
        backgroundColor: '#fff',
        borderRadius: 14,
        marginBottom: 14,
        borderWidth: 1.5,
        borderColor: '#e3eafc',
        shadowColor: '#1e88e5',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    menuButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 14,
    },
    iconWrapper: {
        width: 32,
        alignItems: 'center',
        marginRight: 12,
    },
    menuButtonLabel: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    arrowIcon: {
        marginLeft: 8,
    },
});

export default MenuScreen;