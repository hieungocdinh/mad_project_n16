import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { FamilyStoryRequest } from "../../types/request/family-story-request";
import FamilyStoryApi from "../../api/familyStoryApi";
import { Colors } from "../../constants/colors";
import { uploadImageToCloudinary } from "../../utils/cloudinaryConfig";
import * as ImagePicker from "expo-image-picker";
import { useAlert, AlertType } from "../../context/alertContext";


const EditStoryScreen: React.FC = () => {
    const { t } = useTranslation(); // Initialize translation hook
    const [storyName, setStoryName] = useState<string>("");
    const [storyContent, setStoryContent] = useState<string>("");
    const [images, setImages] = useState<string[]>(["", ""]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);

    const navigation = useNavigation();
    const route = useRoute<RouteProp<{ params: { storyId: number } }, 'params'>>();
    const { showAlert } = useAlert();
    const storyId = route.params?.storyId;

    // Tải dữ liệu câu chuyện khi màn hình được mở
    useEffect(() => {
        fetchStoryDetails().then(() => {
            setInitialLoading(false);
        });
    }, []);

    const fetchStoryDetails = async (): Promise<void> => {
        setInitialLoading(true);
        try {
            const response = await FamilyStoryApi.getFamilyStoryById(storyId);

            if (response && response.code === 200 && response.data) {
                const story = response.data;
                setStoryName(story.title || "");
                setStoryContent(story.content || "");

                // Cập nhật hình ảnh
                const newImages = [
                    story.storyAvatar || "",
                    story.coverImage || ""
                ];
                setImages(newImages);
            } else {
                showAlert(
                    t("error"),
                    t("family_story.storyLoadError"),
                    AlertType.ERROR
                );
                navigation.goBack();
            }
        } catch (error: any) {
            console.error(t("family_story.storyDataError"), error);
            const errorMessage = error.response
                ? `${t("family_story.serverError")} (${error.response.status}): ${JSON.stringify(error.response.data)}`
                : t("family_story.networkConnectionError");

            showAlert(t("error"), errorMessage, AlertType.ERROR);
            navigation.goBack();
        } finally {
            setInitialLoading(false);
        }
    };

    const requestGalleryPermission = async (): Promise<boolean> => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            showAlert(
                t("error"),
                t("family_story.galleryPermissionError"),
                AlertType.ERROR
            );
            return false;
        }
        return true;
    };

    const handleSelectImage = async (index: number): Promise<void> => {
        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (result.canceled) {
            console.log(t("family_story.userCancelledImageSelection"));
        } else if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            if (uri) {
                setLoading(true);
                try {
                    // Tải ảnh lên Cloudinary và lấy URL
                    const cloudinaryUrl = await uploadImageToCloudinary(uri);
                    const newImages = [...images];
                    newImages[index] = cloudinaryUrl;
                    setImages(newImages);
                } catch (error) {
                    console.error(t("family_story.cloudinaryUploadError"), error);
                    showAlert(
                        t("error"),
                        t("family_story.imageUploadError"),
                        AlertType.ERROR
                    );
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    const handleUpdateStory = async (storyId: number): Promise<void> => {
        if (!storyName || !storyContent) {
            showAlert(
                t("error"),
                t("family_story.emptyFieldsError"),
                AlertType.ERROR
            );
            return;
        }

        // Chuẩn bị dữ liệu cập nhật
        const storyData: FamilyStoryRequest = {
            title: storyName.trim(),
            content: storyContent.trim(),
            storyAvatar: images[0] || "",
            coverImage: images[1] || "",
        };

        setLoading(true);

        try {
            console.log(t("family_story.sendingUpdateData"), JSON.stringify(storyData));

            const response = await FamilyStoryApi.updateFamilyStory(storyId, storyData);
            console.log(t("family_story.serverResponse"), response);

            if (response.code === 200) {
                showAlert(
                    t("success"),
                    t("family_story.storyUpdateSuccess"),
                    AlertType.SUCCESS,
                    3000
                );
                setTimeout(() => {
                    navigation.goBack();
                }, 3000);
            } else {
                const errorMessage = response?.message || t("family_story.updateFailure");
                showAlert(t("error"), errorMessage, AlertType.ERROR);
            }
        } catch (error: any) {
            console.error(t("family_story.fetchError"), error);

            // Hiển thị thông tin lỗi chi tiết
            const errorMessage = error.response
                ? `${t("family_story.serverError")} (${error.response.status}): ${JSON.stringify(error.response.data)}`
                : t("family_story.networkConnectionError");

            showAlert(t("error"), errorMessage, AlertType.ERROR);
        } finally {
            setLoading(false);
        }
    };

    // Hiển thị loading khi đang tải dữ liệu ban đầu
    if (initialLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>{t("family_story.loadingData")}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <IonIcons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t("family_story.editStory")}</Text>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>{t("family_story.storyName")}</Text>
                <TextInput
                    style={styles.input}
                    value={storyName}
                    onChangeText={setStoryName}
                    placeholder={t("family_story.enterStoryName")}
                />

                <Text style={styles.label}>{t("family_story.storyContent")}</Text>
                <TextInput
                    style={styles.textArea}
                    value={storyContent}
                    onChangeText={setStoryContent}
                    placeholder={t("family_story.enterStoryContent")}
                    multiline={true}
                    numberOfLines={6}
                    textAlignVertical="top"
                />

                <Text style={styles.label}>{t("family_story.images")}</Text>
                <View style={styles.imageContainer}>
                    {images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.imageSelector}
                            onPress={() => handleSelectImage(index)}
                            disabled={loading}
                        >
                            {image ? (
                                <Image source={{ uri: image }} style={styles.selectedImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Text style={styles.imagePlus}>+</Text>
                                    <Text style={styles.imageLabel}>
                                        {index === 0 ? t("family_story.avatarImage") : t("family_story.coverImage")}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, loading && styles.disabledButton]}
                    onPress={() => handleUpdateStory(storyId)}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>{t("family_story.updateStory")}</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>{t("family_story.processing")}</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#f5f5f5",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 10,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 10,
        marginTop: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        height: 120,
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    imageSelector: {
        width: 150,
        height: 150,
        marginRight: 10,
        borderRadius: 5,
        overflow: "hidden",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
    },
    imagePlus: {
        fontSize: 30,
        color: "#999",
    },
    imageLabel: {
        fontSize: 12,
        color: "#999",
        marginTop: 5,
    },
    selectedImage: {
        width: "100%",
        height: "100%",
    },
    saveButton: {
        backgroundColor: "#1e88e5",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        marginTop: 150,
        marginBottom: 20,
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: "#cccccc",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#1e88e5",
    },
});

export default EditStoryScreen;