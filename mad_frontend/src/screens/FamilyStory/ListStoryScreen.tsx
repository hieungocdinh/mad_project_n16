import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
} from "react-native-feather";
import FamilyStoryApi from "../../api/familyStoryApi";
import { useNavigation } from "@react-navigation/native";
import FamilyStoryResponse from "../../types/response/family-story-response";
import { Colors } from "../../constants/colors";
import { useTranslation } from "react-i18next";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const ListStoryScreen = () => {
  const { t } = useTranslation();
  const [stories, setStories] = useState<FamilyStoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Spring Boot uses 0-based indexing
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const navigator = useNavigation<NativeStackNavigationProp<any>>();

  // Fetch stories from API
  const fetchStories = async (page = 0) => {
    try {
      setLoading(true);

      let response;
      if (searchQuery.trim()) {
        // Gọi API tìm kiếm có phân trang
        response = await FamilyStoryApi.searchStoriesWithPaging(
          undefined,
          searchQuery.trim(),
          page,
          5,
        );
      } else {
        // Gọi API lấy toàn bộ danh sách có phân trang
        response = await FamilyStoryApi.getAllFamilyStoriesWithPaging(page, 4);
      }

      setStories(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Lỗi khi tải stories:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = () => {
    fetchStories(0).then(
        (r) => console.log("Search results:", r),
    ); // Reset về trang đầu tiên khi tìm kiếm
  };

  const handleFilterChange = (filter: any) => {
    setActiveFilter(filter);
    // You could implement filter logic here based on your requirements
    // Currently just updating the UI state
    setCurrentPage(0);
    fetchStories().then((r) => console.log("Filtered stories:", r));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchStories(newPage).then((r) => console.log("Page changed:", r));
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStories(currentPage).then(
        (r) => console.log("Refreshed stories:", r),
    );
  };
  useEffect(() => {
    fetchStories(0).then(
        (r) => console.log("Initial stories:", r),
    );
  }, []);

  const formatDate = (dateString: any) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const renderStoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => {
        // Navigate to story detail view - implement this function
        navigator.navigate("DetailStoryScreen", { storyId: item.storyId });
      }}
    >
      <View style={styles.storyContent}>
        <Text style={styles.storyTitle}>{item.title}</Text>
        <Text style={styles.storyDate}>
          {formatDate(item.creationDate)} {t("family_story.shared_by")}{" "}
          <Text>{item.userName}</Text>
        </Text>
        <Text style={styles.storyPreview} numberOfLines={2}>
          {item.content}
        </Text>
      </View>
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
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {t("family_story.family_stories")}
        </Text>
      </View>

      {/* Unified Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search
            width={20}
            height={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t("family_story.search_stories")}
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>
            {t("family_story.search")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "all" ? {} : styles.filterButtonInactive,
          ]}
          onPress={() => handleFilterChange("all")}
        >
          <Text
            style={
              activeFilter === "all"
                ? styles.filterButtonText
                : styles.filterButtonTextInactive
            }
          >
            {t("family_story.all")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === "memories" ? {} : styles.filterButtonInactive,
          ]}
          onPress={() => handleFilterChange("memories")}
        >
          <Text
            style={
              activeFilter === "memories"
                ? styles.filterButtonText
                : styles.filterButtonTextInactive
            }
          >
            {t("family_story.memories")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stories List */}
      {loading && stories.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : (
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.storyId.toString()}
          contentContainerStyle={styles.storiesListContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyListText}>
                {t("family_story.no_stories")}
              </Text>
            </View>
          }
          ListFooterComponent={
            loading && stories.length > 0 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color="#111827" />
              </View>
            ) : null
          }
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === 0 ? styles.pageButtonDisabled : {},
            ]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            <ChevronLeft
              width={20}
              height={20}
              color={currentPage === 0 ? "#D1D5DB" : "#111827"}
            />
          </TouchableOpacity>

          <View style={styles.pageIndicator}>
            <Text style={styles.pageIndicatorText}>
              {t("family_story.page")} {currentPage + 1} / {totalPages}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.pageButton,
              currentPage === totalPages - 1 ? styles.pageButtonDisabled : {},
            ]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight
              width={20}
              height={20}
              color={currentPage === totalPages - 1 ? "#D1D5DB" : "#111827"}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
    color: "#111827",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    alignItems: "center",
  },
  searchButton: {
    marginLeft: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  filterButtonInactive: {
    backgroundColor: "#F3F4F6",
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  filterButtonTextInactive: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoading: {
    paddingVertical: 20,
  },
  storiesListContent: {
    padding: 16,
    flexGrow: 1,
  },
  storyItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  storyContent: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  storyDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  storyPreview: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 6,
    lineHeight: 20,
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1D5DB",
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1D5DB",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyListText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6B7280",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
  },
  pageButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageIndicator: {
    paddingHorizontal: 16,
  },
  pageIndicatorText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  clearButton: {
    marginLeft: 8,
  },

  clearButtonText: {
    fontSize: 18,
    color: "#9CA3AF",
  },
});

export default ListStoryScreen;
