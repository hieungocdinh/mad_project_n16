import React, { useEffect, useState } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    TextInput, ScrollView, Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/root-stack-param";
import { useRoute } from "@react-navigation/native";
import UserResponse from "../../types/response/user-response";
import ProfileApi from "../../api/profileApi";
import User from "../../types/model/user";
import FamilyRequest from "../../types/request/family-request";
import ImageRequest from "../../types/request/image-request";
import FamilyApi from "../../api/familyApi";
import { uploadImageToCloudinary } from '../../utils/cloudinaryConfig';
import images from "../../utils/images";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, "FamilyCreate">;
};

const CreateFamilyScreen: React.FC<Props> = ({ navigation }) => {
    const { t } = useTranslation();

    const [familyName, setFamilyName] = useState<string>("");
    const [familyAvatar, setFamilyAvatar] = useState<string | null>(null);
    const [husband, setHusband] = useState<User | null>(null);
    const [wife, setWife] = useState<User | null>(null);
    const [children, setChildren] = useState<User[]>([]);
    const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const pickFamilyImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            allowsEditing: true,
            aspect: [1, 1],
        });
        if (!result.canceled) {
            setFamilyAvatar(result.assets[0].uri);
        }
    };

    const handlePickRole = (role: 'husband' | 'wife' | 'child') => {
        navigation.navigate('SearchUser', {
            role,
            onSelect: async (userResp: UserResponse) => {
                try {
                    const profile = await ProfileApi.getProfileDetail(userResp.profileId);
                    const user: User = {
                        id: userResp.userId,
                        username: userResp.username,
                        email: userResp.email,
                        roles: userResp.roles,
                        familyIds: userResp.familyIds,
                        profileId: userResp.profileId,
                        avatarUrl: profile?.data?.avatarUrl ?? '',
                    };
                    if (role === 'husband') setHusband(user);
                    else if (role === 'wife') setWife(user);
                    else setChildren(prev => [...prev, user]);
                } catch (e) {
                    console.error('Load profile failed', e);
                }
            },
        });
    };

    const handleCreateImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert(t('permission_denied'));
            return;
        }

        // Mở bộ sưu tập
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setSelectedImages(result.assets);
        }
    }

    const handleCreateFamily = async () => {
        if (!familyName) {
            Alert.alert(t('family_create.name_required'));
            return;
        }
        setLoading(true);
        // Upload ảnh gia đình lên Cloudinary
        let images: ImageRequest[] = [];
        if (selectedImages.length > 0) {
            try {
                const uploadedUrls = await Promise.all(
                    selectedImages.map(asset => uploadImageToCloudinary(asset.uri))
                );
                images = uploadedUrls.map(url => ({
                    url,
                }));
            }
            catch (error) {
                Alert.alert('Upload images failed!');
                console.error('Error', error);
            }
        }

        const payload: FamilyRequest = {
            name: familyName,
            avatarUrl: familyAvatar,
            husband,
            wife,
            childIds: children.map(c => c.id),
            albums: [],
            images: images,
        };

        try {
            const res = await FamilyApi.createFamily(payload);
            Alert.alert(t('family_create_success'));
            navigation.replace('Family');
        } catch (error) {
            console.error(error);
            Alert.alert(t('family_create.error'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>{t("family_screen.title")}</Text>
            </View>

            <TextInput
                style={styles.familyNameInput}
                placeholder={t("family_create.family_name_placeholder")}
                placeholderTextColor="#fff"
                value={familyName}
                onChangeText={setFamilyName}
            />

            <TouchableOpacity style={styles.familyAvatarBox} onPress={pickFamilyImage}>
                {familyAvatar ? (
                    <Image source={{ uri: familyAvatar }} style={styles.familyAvatar} />
                ) : (
                    <View style={styles.familyAvatarPlaceholder}>
                        <Icon name="image-outline" size={30} color="#999" />
                        <Text style={{ color: "#999" }}>
                            {t("family_create.add_avatar")}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <View style={styles.rowBox}>
                <View style={styles.column}>
                    <Text style={styles.label}>{t("family_create.husband")}</Text>
                    {husband ? (
                        <Image
                            source={husband.avatarUrl ? { uri: husband.avatarUrl } : images.defaultAvatar}
                            style={styles.avatar}
                        />
                    ) : (
                        <TouchableOpacity style={styles.avatarButton} onPress={() => handlePickRole("husband")}>
                            <Icon name="person-add" size={28} color="#000" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.column}>
                    <Text style={styles.label}>{t("family_create.wife")}</Text>
                    {wife ? (
                        <Image
                            source={wife.avatarUrl ? { uri: wife.avatarUrl } : images.defaultAvatar}
                            style={styles.avatar}
                        />
                    ) : (
                        <TouchableOpacity style={styles.avatarButton} onPress={() => handlePickRole("wife")}>
                            <Icon name="person-add" size={28} color="#000" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.childBox}>
                <Text style={styles.label}>{t("family_create.children")}</Text>
                <View style={styles.childRow}>
                    {children.map((child, index) => (
                        <Image key={index} source={{ uri: child.avatarUrl }} style={styles.avatar} />
                    ))}
                    <TouchableOpacity style={styles.addChildButton} onPress={() => handlePickRole("child")}>
                        <Icon name="add" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.actionButton}>
                <Text>{t("family_create.events")}</Text>
                <Icon name="chevron-forward-outline" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
                <Text>{t("family_create.stories")}</Text>
                <Icon name="chevron-forward-outline" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleCreateImage}>
                <Text>{t("family_create.photos")}</Text>
                <Icon name="chevron-forward-outline" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleCreateFamily}>
                <Text style={styles.submitText}>{t("family_create.create_button")}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        flexGrow: 1,
    },
    headerContainer: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 15,
    },
    header: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
    },
    familyNameInput: {
        backgroundColor: "#FF8C00",
        color: "#fff",
        fontWeight: "bold",
        padding: 10,
        textAlign: "center",
        borderRadius: 20,
        marginBottom: 15,
    },
    familyAvatarBox: {
        alignSelf: "center",
        marginBottom: 20,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#ccc",
    },
    familyAvatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    familyAvatarPlaceholder: {
        justifyContent: "center",
        alignItems: "center",
    },
    rowBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    column: {
        alignItems: "center",
        flex: 1,
    },
    label: {
        marginBottom: 5,
        fontWeight: "600",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    avatarButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eee",
    },
    childBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
    },
    childRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 5,
    },
    addChildButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    actionButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 10,
        backgroundColor: "#f1f1f1",
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#ccc",
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: "#007bff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },
    submitText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default CreateFamilyScreen;
