import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import i18n from '../../i18n';

const LanguageScreen: React.FC = () => {
    const {t} = useTranslation();
    const [selectedLang, setSelectedLang] = useState(i18n.language);

    const changeLanguage = async (lang: 'vi' | 'en') => {
        await i18n.changeLanguage(lang);
        setSelectedLang(lang);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('language')}</Text>

            <TouchableOpacity
                style={[
                    styles.option,
                    selectedLang === 'en' && styles.selected
                ]}
                onPress={() => changeLanguage('en')}
                activeOpacity={0.85}
            >
                <Text style={[
                    styles.optionText,
                    selectedLang === 'en' && styles.selectedText
                ]}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.option,
                    selectedLang === 'vi' && styles.selected
                ]}
                onPress={() => changeLanguage('vi')}
                activeOpacity={0.85}
            >
                <Text style={[
                    styles.optionText,
                    selectedLang === 'vi' && styles.selectedText
                ]}>Tiếng Việt</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LanguageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#e3eafc',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        marginBottom: 32,
        fontWeight: 'bold',
        color: '#1e88e5',
        textAlign: 'center',
        letterSpacing: 1,
    },
    option: {
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#e3eafc',
        backgroundColor: '#fff',
        marginBottom: 18,
        alignItems: 'center',
        shadowColor: '#1e88e5',
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 2,
    },
    selected: {
        backgroundColor: '#1e88e5',
        borderColor: '#1e88e5',
    },
    optionText: {
        fontSize: 18,
        color: '#1e88e5',
        fontWeight: '500',
    },
    selectedText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});