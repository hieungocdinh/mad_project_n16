import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Share,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import IonIcons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { Colors } from "../../constants/colors";
import FamilyStoryApi from "../../api/familyStoryApi";
import { useAlert, AlertType } from "../../context/alertContext";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import FamilyStoryResponse from "../../types/response/family-story-response";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

const DetailStoryScreen = () => {
  const { t, i18n } = useTranslation(); // Use translation hook
  const [storyDetail, setStoryDetail] = useState<FamilyStoryResponse>();
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const navigator = useNavigation<NativeStackNavigationProp<any>>();
  const route =
    useRoute<RouteProp<{ params: { storyId: number } }, "params">>();
  const { showAlert } = useAlert();
  const storyId = route.params?.storyId;

  useEffect(() => {
    fetchStoryDetails().then(() => setLoading(false));
  }, []);

  const fetchStoryDetails = async () => {
    setLoading(true);
    try {
      // Lấy chi tiết câu chuyện từ API
      const response = await FamilyStoryApi.getFamilyStoryById(storyId);
      console.log("Server response:", response);

      if (response.code === 200) {
        setStoryDetail(response.data);
        console.log(storyDetail?.userName);
        // Có thể thêm kiểm tra yêu thích ở đây nếu có API cho chức năng đó
      } else {
        showAlert(
          t("error"),
          t("family_story.storyLoadError"),
          AlertType.ERROR,
        );
        navigator.goBack();
      }
    } catch (error) {
      console.error(t("family_story.storyDetailError"), error);
      showAlert(
        t("error"),
        t("family_story.networkConnectionError"),
        AlertType.ERROR,
      );
      navigator.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!storyDetail) return;
    try {
      await Share.share({
        message: `${t("family_story.shareStory")}: ${
          storyDetail.title
        }\n\n${storyDetail.content.substring(0, 100)}...`,
        title: storyDetail.title,
      });
    } catch (error) {
      console.error(t("shareError"), error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showAlert(
      t("family_story.notification"),
      isFavorite
        ? t("family_story.removedFromFavorites")
        : t("family_story.addedToFavorites"),
      AlertType.SUCCESS,
      2000,
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return t("family_story.undetermined");
    try {
      const date = new Date(dateString);
      // You may need to change this based on selected language
      const locale = i18n.language === "vi" ? vi : undefined;
      return format(
        date,
        i18n.language === "vi"
          ? "dd MMMM, yyyy 'lúc' HH:mm"
          : "MMMM dd, yyyy 'at' HH:mm",
        { locale },
      );
    } catch (error) {
      return dateString;
    }
  };

  const handleEdit = () => {
    navigator.navigate("EditStoryScreen", { storyId });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>
            {t("family_story.loadingStory")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Cover Image */}
      <View style={styles.coverImageContainer}>
        <Image
          source={
            storyDetail && storyDetail.coverImage
              ? { uri: storyDetail.coverImage }
              : require("../../../assets/images/default-avatar.jpg")
          }
          style={styles.coverImage}
        />

        {/* Overlay và nút quay lại */}
        <View style={styles.coverOverlay}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigator.goBack()}
          >
            <IonIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.coverActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleFavorite}
            >
              <IonIcons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#FF375F" : "#FFFFFF"}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <IonIcons name="share-social-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
              <IonIcons name="create-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Avatar và Metadata */}
        <View style={styles.metadataContainer}>
          <Image
            source={
              storyDetail?.storyAvatar
                ? { uri: storyDetail.storyAvatar }
                : require("../../../assets/images/default-avatar.jpg")
            }
            style={styles.avatar}
          />

          <View style={styles.userInfo}>
            <Text>
              {t("family_story.postedBy")}{" "}
              <Text style={styles.username}>{storyDetail?.userName}</Text>{" "}
            </Text>

            <Text style={styles.dateInfo}>
              {t("family_story.postedOn")}{" "}
              {formatDate(storyDetail?.creationDate ?? "")}
            </Text>
            {storyDetail &&
              storyDetail.updateDate &&
              storyDetail.updateDate !== storyDetail.creationDate && (
                <Text style={styles.updateInfo}>
                  {t("family_story.lastUpdated")}:{" "}
                  {formatDate(storyDetail.updateDate ?? "")}
                </Text>
              )}
          </View>
        </View>

        {/* Tiêu đề */}
        <Text style={styles.title}>{storyDetail?.title}</Text>

        {/* Nội dung */}
        <Text style={styles.storyContent}>{storyDetail?.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.primary,
  },
  coverImageContainer: {
    height: 250,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  coverActions: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  metadataContainer: {
    flexDirection: "row",
    marginTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    marginLeft: 10,
    justifyContent: "center",
  },
  username: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666666",
  },
  dateInfo: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  updateInfo: {
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
    fontStyle: "italic",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222222",
    marginTop: 20,
    marginBottom: 15,
    lineHeight: 32,
  },
  storyContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
    marginBottom: 30,
    textAlign: "justify",
  },
});

export default DetailStoryScreen;
