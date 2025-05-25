import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    ChangePassword: undefined;
    Language: undefined;
    PrivacyPolicy: undefined;
    TermsOfService: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingButtonProps {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
}

const SettingButton: React.FC<SettingButtonProps> = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.menuButtonContent}>
            <View style={styles.iconWrapper}>{icon}</View>
            <Text style={styles.menuButtonLabel}>{label}</Text>
            <Ionicons name="chevron-forward" size={22} color="#1e88e5" style={styles.arrowIcon} />
        </View>
    </TouchableOpacity>
);

const SettingScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('settings') || 'Cài đặt'}</Text>
            <ScrollView contentContainerStyle={styles.menuList}>
                <SettingButton
                    icon={<Ionicons name="key-outline" size={24} color="#1e88e5" />}
                    label={t('changePassword')}
                    onPress={() => navigation.navigate('ChangePassword')}
                />
                <SettingButton
                    icon={<FontAwesome name="language" size={24} color="#1e88e5" />}
                    label={t('language')}
                    onPress={() => navigation.navigate('Language')}
                />
                <SettingButton
                    icon={<MaterialIcons name="policy" size={24} color="#1e88e5" />}
                    label={t('privacyPolicy')}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                />
                <SettingButton
                    icon={<MaterialIcons name="description" size={24} color="#1e88e5" />}
                    label={t('terms')}
                    onPress={() => navigation.navigate('TermsOfService')}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e3eafc',
        paddingTop: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e88e5',
        marginBottom: 18,
        alignSelf: 'center',
        letterSpacing: 1,
    },
    menuList: {
        paddingHorizontal: 16,
        paddingBottom: 32,
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
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#e3f0fb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuButtonLabel: {
        flex: 1,
        fontSize: 17,
        fontWeight: '500',
        color: '#222',
    },
    arrowIcon: {
        marginLeft: 8,
    },
});

export default SettingScreen;