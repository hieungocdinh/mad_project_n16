import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IonIcons from "react-native-vector-icons/Ionicons";
import FamilyStoryApi from "../../api/familyStoryApi";
import AuthApi from "../../api/authApi";
import FamilyStoryResponse from "../../types/response/family-story-response";
import { Colors } from "../../constants/colors";
import { AlertType, useAlert } from "../../context/alertContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

const FamilyStoryScreen = () => {
  const [stories, setStories] = useState<FamilyStoryResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStories, setFilteredStories] = useState<FamilyStoryResponse[]>(
      [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigator = useNavigation<NativeStackNavigationProp<any>>();
  const { t, i18n } = useTranslation();

  const { showAlert, showConfirm } = useAlert();

  // Fetch data from API instead of using sample data
  useEffect(() => {
    fetchStories().then((r) => console.log("Fetched stories:", r));
  }, []);

  // Set filtered stories to all stories initially
  useEffect(() => {
    setFilteredStories(stories);
  }, [stories]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const user = await AuthApi.getCurrentUser();
      const response = await FamilyStoryApi.getAllFamilyStoriesByUserId(
          user.userId,
      );

      if (response.code === 200) {
        // console.log(response.data);
        setStories(response.data);
      } else {
        // setError('Failed to fetch stories');
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      // setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const executeSearch = () => {
    if (!searchQuery.trim()) {
      // If search query is empty, show all stories
      setFilteredStories(stories);
      return;
    }

    // Filter stories based on title or content containing the search query
    const filtered = stories.filter(
        (story) =>
            story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            story.content.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredStories(filtered);

    // Show message if no results found
    if (filtered.length === 0) {
      showAlert(
          t("family_story.notification"),
          t("family_story.no_stories_found"),
          AlertType.INFO,
      );
    }
  };

  const handleEdit = (storyId: number) => {
    // Navigate to edit screen with story ID
    navigator.navigate("EditStoryScreen", { storyId });
  };

  const handleDelete = (storyId: number) => {
    showConfirm(
        t("family_story.confirm_delete"),
        t("family_story.confirm_delete_message"),
        () => deleteStory(storyId), // onConfirm callback
        undefined, // onCancel callback (optional)
        t("family_story.delete"),
        t("family_story.cancel"),
    );
  };

  const deleteStory = async (storyId: number) => {
    try {
      const response = await FamilyStoryApi.deleteFamilyStory(storyId);

      if (response.code === 200) {
        // Xoá khỏi danh sách hiển thị
        setStories((prevStories) =>
            prevStories.filter((story) => story.storyId !== storyId),
        );
        showAlert(
            t("success"),
            t("family_story.story_deleted_successfully"),
            AlertType.SUCCESS,
        );
      } else {
        showAlert(
            t("error"),
            t("family_story.cannot_delete_story"),
            AlertType.ERROR,
        );
      }
    } catch (err) {
      console.error(t("family_story.error_when_deleting"), err);
      showAlert(t("error"), t("family_story.error_occurred_when_deleting"), AlertType.ERROR);
    }
  };

  const renderStoryItem = ({ item }: { item: FamilyStoryResponse }) => {
    // Format dates - assuming API returns ISO date strings
    const creationDate = new Date(item.creationDate).toLocaleDateString(
        i18n.language === "vi" ? "vi-VN" : "en-US",
    );
    const updateDate = new Date(item.updateDate).toLocaleDateString(
        i18n.language === "vi" ? "vi-VN" : "en-US",
    );

    return (
        <View style={styles.conversationContainer}>
          <TouchableOpacity
              style={styles.storyTouchable}
              onPress={() => navigator.navigate("DetailStoryScreen", { storyId: item.storyId })}>
            <View style={styles.avatarContainer}>
              {item.storyAvatar ? (
                  <Image
                      source={{ uri: item.storyAvatar }}
                      style={styles.avatar}
                      defaultSource={require("../../../assets/images/default-avatar.jpg")}
                  />
              ) : (
                  <View style={styles.avatarPlaceholder}></View>
              )}
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.conversationTitle}>{item.title}</Text>
              <Text style={styles.dateText}>{t("family_story.creation_date")}: {creationDate}</Text>
              <Text style={styles.messageText}>{t("family_story.update_date")}: {updateDate}</Text>
              <Text numberOfLines={1} style={styles.reminderText}>
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionContainer}>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item.storyId)}
            >
              <Text style={styles.editButtonText}>{t("family_story.edit")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.storyId)}
            >
              <Text style={styles.deleteButtonText}>{t("family_story.delete")}</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredStories(stories);
  };

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigator.goBack()}
          >
            <IonIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("family_story.story_list")}</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <IonIcons
                name="search"
                size={20}
                color="#999"
                style={styles.searchIcon}
            />
            <TextInput
                style={styles.searchInput}
                placeholder={t("family_story.search_story")}
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleSearch}
                returnKeyType="search"
                onSubmitEditing={executeSearch}
            />
            {searchQuery !== "" && (
                <TouchableOpacity onPress={clearSearch}>
                  <IonIcons name="close-circle" size={20} color="#999" />
                </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={executeSearch}>
            <Text style={styles.searchButtonText}>{t("family_story.search")}</Text>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchStories}>
                <Text style={styles.retryText}>{t("family_story.retry")}</Text>
              </TouchableOpacity>
            </View>
        )}

        {/* Loading indicator */}
        {loading ? (
            <View style={styles.loadingContainer}>
              <Text>{t("family_story.loading")}</Text>
            </View>
        ) : (
            /* Stories list */
            <FlatList
                data={filteredStories}
                keyExtractor={(item) => item.storyId.toString()}
                renderItem={renderStoryItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    !loading &&
                    !error && (
                        <View style={styles.emptyContainer}>
                          <Text style={styles.emptyText}>
                            {searchQuery.trim() !== ""
                                ? t("family_story.no_matching_stories")
                                : t("family_story.no_stories")}
                          </Text>
                        </View>
                    )
                }
            />
        )}
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  conversationContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  storyTouchable: {
    flex: 1,
    flexDirection: "row",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#D1D5DB",
  },
  contentContainer: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 2,
  },
  reminderText: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },
  actionContainer: {
    justifyContent: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#FF4757",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    color: Colors.danger,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#4B6BFB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});

export default FamilyStoryScreen;