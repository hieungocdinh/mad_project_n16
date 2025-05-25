import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {Colors} from "../constants/colors"; // Import useTranslation hook

interface MenuItemProps {
  title: string;
  description: string;
  iconName: any;
  onPress: () => void;
}

interface MenuItem {
  title: string;
  description: string;
  iconName: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  iconName,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={24} color= {Colors.primary}/>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          <Text style={styles.menuDescription}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TreeCategoryScreen: React.FC = () => {
  const { t } = useTranslation(); // Use the translation hook
  const navigator = useNavigation<NativeStackNavigationProp<any>>();

  const menuItems: MenuItem[] = [
    {
      title: t("createFamilyStory"),
      description: t("writeInterestingStories"),
      iconName: "create-outline",
      onPress: () => navigator.navigate("CreateStoryScreen"),
    },
    {
      title: t("familyStories"),
      description: t("storeFamilyStories"),
      iconName: "book-outline",
      onPress: () => navigator.navigate("ListStoryScreen"),
    },
    {
      title: t("eventNotes"),
      description: t("noteImportantEvents"),
      iconName: "calendar-outline",
      onPress: () => navigator.navigate("EventScreen"),
    },
    {
      title: t("storyList"),
      description: t("yourStories"),
      iconName: "list-outline",
      onPress: () => navigator.navigate("FamilyStoryScreen"),
    },
    {
      title: t("connectionInfo"),
      description: t("listOfConnections"),
      iconName: "git-network-outline",
      onPress: (): void => console.log("Thông tin ghép nối pressed"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#aaaa" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigator.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("categories")}</Text>
      </View>
      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            title={item.title}
            description={item.description}
            iconName={item.iconName}
            onPress={item.onPress}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  menuDescription: {
    fontSize: 16,
    color: "#888",
    marginTop: 3,
  },
  chevron: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ccc",
  },
});

export default TreeCategoryScreen;
