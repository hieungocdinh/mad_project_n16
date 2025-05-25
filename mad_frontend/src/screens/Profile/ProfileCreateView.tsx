import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as ImagePicker from 'expo-image-picker';

import { RootStackParamList } from '../../types/root-stack-param';
import { uploadImageToCloudinary } from '../../utils/cloudinaryConfig';
import images from '../../utils/images';
import profileApi from '../../api/profileApi';
import ProfileRequest from '../../types/request/profile-request';

type ProfileCreateViewProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ProfileCreateView'>;
};

const ProfileCreateView: React.FC<ProfileCreateViewProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const [avatarUrl, setAvatarUrl] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('male');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [deathDate, setDeathDate] = useState<Date | null>(null);
    const [biography, setBiography] = useState('');
    const [address, setAddress] = useState('');

    const [isBirthDatePickerVisible, setBirthDatePickerVisibility] = useState(false);
    const [isDeathDatePickerVisible, setDeathDatePickerVisibility] = useState(false);

    const [lastEditedField, setLastEditedField] = useState<'birth' | 'death' | null>(null);
    const [dateError, setDateError] = useState<string | null>(null);
    const [firstNameError, setFirstNameError] = useState<string | null>(null);
    const [lastNameError, setLastNameError] = useState<string | null>(null);

    const genderOptions = [
        { label: t('male'), value: 'male' },
        { label: t('female'), value: 'female' },
    ];

    // Xử lý chọn anh từ thư viện
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert(t('permission_denied'));
            return;
        }

        // Mở bộ sưu tập
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setAvatarUrl(result.assets[0].uri);
        }
    };

    // Xử lý tạo hồ sơ
    const handleSave = async () => {
        let finalAvatarUrl = avatarUrl;

        if (!firstName.trim()) {
            setFirstNameError(t('first_name_empty'));
            return;
        }
        if (!lastName.trim()) {
            setLastNameError(t('last_name_empty'));
            return;
        }
        if (!birthDate) {
            setDateError(t('birth_date_empty'));
            setLastEditedField('birth');
            return;
        }
        if (dateError) {
            return;
        }

        if (avatarUrl !== '') {
            try {
                finalAvatarUrl = await uploadImageToCloudinary(avatarUrl);
            } catch (error) {
                alert('Tải ảnh lên thất bại, vui lòng thử lại.');
                console.error('Error uploading image:', error);
                return;
            }
        }

        const profileRequest: ProfileRequest = {
            avatarUrl: finalAvatarUrl,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender,
            birthDate: birthDate ? birthDate.toISOString() : undefined,
            deathDate: deathDate ? deathDate.toISOString() : null,
            biography,
            address,
        };

        try {
            const response = await profileApi.createProfile(profileRequest);
            if (response.code === 201) {
                navigation.goBack();
            } else {
                Alert.alert(t('create_error_title'), t('create_error_message'));
            }
        }
        catch (error) {
            Alert.alert(t('create_error_title'), t('create_error_message'));
            console.error('Error updating profile:', error);
        }
    };

    // Xử lý sellect radio button
    const renderRadioButton = (option: { label: string; value: string }, index: number) => (
        <TouchableOpacity
            key={index}
            style={styles.radioContainer}
            onPress={() => setGender(option.value)}
        >
            <View style={styles.radioCircle}>
                {gender === option.value && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.radioLabel}>{option.label}</Text>
        </TouchableOpacity>
    );

    // Xử lý chọn ngày
    const handleConfirm = (date: Date) => {
        if (isBirthDatePickerVisible) {
            setBirthDate(date);
            setLastEditedField('birth');
            if (dateError === t('birth_date_empty')) {
                setDateError(null);
            }
            setBirthDatePickerVisibility(false);
            if (deathDate && date > deathDate) {
                setDateError("birth_date_before_or_equal_death_date");
            } else {
                setDateError(null);
            }
        } else if (isDeathDatePickerVisible) {
            setDeathDate(date);
            setLastEditedField('death');
            setDeathDatePickerVisibility(false);
            if (birthDate && birthDate > date) {
                setDateError("birth_date_before_or_equal_death_date");
            } else {
                setDateError(null);
            }
        }
    };

    // Xư lý định dạng ngày thành DD/MM/YYYY
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.statusBarSpace} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('create_profile')}</Text>
                <TouchableOpacity
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>{t('save')}</Text>
                </TouchableOpacity>
            </View>

            {/* Nội dung chính */}
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                    <View>
                        <Image
                            source={avatarUrl ? { uri: avatarUrl } : images.defaultAvatar}
                            style={styles.avatar}
                        />
                        <View style={styles.overlay}>
                            <Ionicons name="camera" size={24} color="white" style={{ position: 'absolute', bottom: 16 }} />
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.infoGroup}>
                    <Text style={styles.label}>{t('first_name')}</Text>
                    {firstNameError && (
                        <Text style={styles.errorText}>{t(firstNameError)}</Text>
                    )}
                    <TextInput
                        style={[
                            styles.input,
                            firstNameError && styles.inputError,
                        ]}
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                            if (firstNameError && text.trim()) {
                                setFirstNameError(null);
                            }
                        }}
                    />
                    <Text style={styles.label}>{t('last_name')}</Text>
                    {lastNameError && (
                        <Text style={styles.errorText}>{t(lastNameError)}</Text>
                    )}
                    <TextInput
                        style={[
                            styles.input,
                            lastNameError && styles.inputError,
                        ]}
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                            if (lastNameError && text.trim()) {
                                setLastNameError(null);
                            }
                        }}
                    />
                    <Text style={styles.label}>{t('gender')}</Text>
                    <View style={styles.genderGroup}>
                        {genderOptions.map((option, index) => renderRadioButton(option, index))}
                    </View>
                    <Text style={styles.label}>{t('birth_date')}</Text>
                    {/* Modal chọn ngày */}
                    <View>
                        {lastEditedField === 'birth' && dateError && (
                            <Text style={styles.errorText}>{t(dateError)}</Text>
                        )}
                        <TouchableOpacity onPress={() => setBirthDatePickerVisibility(true)}>
                            <TextInput
                                style={[
                                    styles.input,
                                    lastEditedField === 'birth' && dateError && styles.inputError,
                                ]}
                                value={birthDate ? formatDate(birthDate) : ''}
                                editable={false}
                                placeholder="DD/MM/YYYY"
                            />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isBirthDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={() => setBirthDatePickerVisibility(false)}
                            maximumDate={new Date()}
                        />
                    </View>
                    <View style={styles.dateTitleGrpup}>
                        <Text style={styles.label}>{t('death_date')}</Text>
                        {deathDate && (
                            <TouchableOpacity onPress={
                                () => {
                                    setDeathDate(null);
                                    setDateError(null);
                                    setLastEditedField('death');
                                }
                            }>
                                <Text style={styles.clearText}>Xóa</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    {/* Modal chọn ngày */}
                    <View>
                        {lastEditedField === 'death' && dateError && (
                            <Text style={styles.errorText}>{t(dateError)}</Text>
                        )}
                        <TouchableOpacity onPress={() => setDeathDatePickerVisibility(true)}>
                            <TextInput
                                style={[
                                    styles.input,
                                    lastEditedField === 'death' && dateError && styles.inputError,
                                ]}
                                value={deathDate ? formatDate(deathDate) : ''}
                                editable={false}
                                placeholder="DD/MM/YYYY"
                            />
                        </TouchableOpacity>

                        <DateTimePickerModal
                            isVisible={isDeathDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={() => setDeathDatePickerVisibility(false)}
                            maximumDate={new Date()}
                        />
                    </View>
                    <Text style={styles.label}>{t('address')}</Text>
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                    />
                    <Text style={styles.label}>{t('biography')}</Text>
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        value={biography}
                        onChangeText={setBiography}
                        multiline
                    />
                </View>
            </ScrollView>

        </SafeAreaView >
    );
};

export default ProfileCreateView;

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
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        width: 40,
    },
    saveButton: {
        backgroundColor: '#1e88e5',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
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
    avatarContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        overflow: 'hidden',
        position: 'relative',
        alignSelf: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        height: 180 * 0.3,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoGroup: {
        marginTop: 16,
    },
    dateTitleGrpup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 6,
    },
    clearText: {
        color: '#1e88e5',
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
        marginBottom: 12,
    },
    multilineInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 32,
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioSelected: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
    radioLabel: {
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 4,
    },
});