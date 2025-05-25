import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';

const LanguageToggle: React.FC = () => {
    const { i18n, t } = useTranslation();

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const newLang = currentLang === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <View style={{ position: 'absolute', top: 40, right: 20, zIndex: 999 }}>
            <TouchableOpacity
                style={{
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    backgroundColor: '#1e88e5',
                }}
                onPress={toggleLanguage}
            >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                    {i18n.language === 'en' ? 'VI' : 'EN'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default LanguageToggle;
