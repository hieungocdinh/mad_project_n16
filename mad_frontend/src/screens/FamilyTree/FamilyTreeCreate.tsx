// src/screens/FamilyTreeCreateScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import {RootStackParamList} from "../../types/root-stack-param";
import FamilyTreeRequest from "../../types/request/familyTree-request";
import FamilyTreeApi from "../../api/familyTreeApi";


type NavProp = NativeStackNavigationProp<RootStackParamList, 'FamilyTreeCreate'>;

const FamilyTreeCreateScreen: React.FC = () => {
    const navigation = useNavigation<NavProp>();
    const { t } = useTranslation();

    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<string>('');     // we'll parse thành number
    const [loading, setLoading] = useState<boolean>(false);

    const validate = (): boolean => {
        if (!name.trim()) {
            Alert.alert(t('family_tree_create.name_required', 'Vui lòng nhập tên gia phả'));
            return false;
        }
        if (!age.trim() || isNaN(Number(age))) {
            Alert.alert(t('family_tree_create.age_required', 'Tuổi không hợp lệ'));
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setLoading(true);

        const payload: FamilyTreeRequest = {
            // id: undefined vì tạo mới
            name: name.trim(),
            age: Number(age),
            family: []  // TODO: thêm chọn FamilyTreeFamilyRequest nếu cần
        };

        try {
            await FamilyTreeApi.saveFamilyTree(payload);
            Alert.alert(t('family_tree_create.success', 'Tạo gia phả thành công'));
            navigation.goBack();
        } catch (err) {
            console.error(err);
            Alert.alert(t('family_tree_create.error', 'Có lỗi xảy ra, thử lại sau'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerText}>{t('family_tree_create.title','Tạo mới gia phả')}</Text>
            </View>

            {/* Form */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>{t('family_tree_create.name','Tên gia phả')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('family_tree_create.name_placeholder','Nhập tên')}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>{t('family_tree_create.age','Tuổi')}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={t('family_tree_create.age_placeholder','Nhập tuổi')}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                />
            </View>

            {/* TODO: phần chọn mảng family nếu cần */}

            {/* Submit */}
            {loading
                ? <ActivityIndicator style={{ marginTop: 20 }} size="large" />
                : (
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Icon name="save-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>{t('family_tree_create.save','Lưu')}</Text>
                    </TouchableOpacity>
                )
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    header: {
        backgroundColor: '#007bff',
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 4,
        marginBottom: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#FF8C00',
        paddingVertical: 12,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default FamilyTreeCreateScreen;
