import React, {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/root-stack-param';

type AddMemberProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Tab'>;
};

const AddMember: React.FC<AddMemberProps> = ({navigation}) => {
    const {t} = useTranslation();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = () => {
        if (!name || !role) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        console.log('Thành viên mới:', {name, role});
        Alert.alert('Thành công', 'Đã thêm thành viên');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('add_member')}</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên thành viên"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Vai trò (Bố, Mẹ...)"
                value={role}
                onChangeText={setRole}
            />
            <Button title="Lưu" onPress={handleSubmit}/>
        </View>
    );
};

export default AddMember;

const styles = StyleSheet.create({
    container: {padding: 20},
    title: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
        borderRadius: 6,
        marginBottom: 15,
    },
});
