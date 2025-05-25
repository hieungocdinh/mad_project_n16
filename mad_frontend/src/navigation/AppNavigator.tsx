import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";

import HomeScreen from "../screens/HomeScreen";
import TreeView from "../screens/Tree/TreeView";
import HistoryScreen from "../screens/Search/HistoryScreen";
import MenuScreen from "../screens/Settings/MenuScreen";
import Splash from "../screens/Splash";
import Login from "../screens/Auth/Login";
import AddMember from "../screens/Tree/AddMember";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/root-stack-param";
import Register from "../screens/Auth/Register";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import ConfirmAccount from "../screens/Auth/ConfirmAccount";
import ResetPassword from "../screens/Auth/ResetPassword";
import Family from "../screens/Family/Family";
import FamilyDetailsScreen from "../screens/Family/FamilyDetail";
import SettingsScreen from "../screens/Settings/SettingScreen";
import ChangePasswordScreen from "../screens/Settings/ChangePasswordScreen";
import LanguageScreen from "../screens/Settings/LangugeScreen";
import SearchUserScreen from "../screens/Search/SearchUserScreen";
import FamilyCreate from "../screens/Family/FamilyCreate";
import TreeCategoryScreen from "../screens/TreeCategoryScreen";
import CreateStoryScreen from "../screens/FamilyStory/CreateStoryScreen";
import ListStoryScreen from "../screens/FamilyStory/ListStoryScreen";
import FamilyStoryScreen from "../screens/FamilyStory/FamilyStoryScreen";
import EditStoryScreen from "../screens/FamilyStory/EditStoryScreen";
import DetailStoryScreen from "../screens/FamilyStory/DetailStoryScreen";
import ProfileCreateView from "../screens/Profile/ProfileCreateView";
import ProfileUpdateView from "../screens/Profile/ProfileUpdateView";
import ProfileDetailView from "../screens/Profile/ProfileDetailView";
import ListProfileView from "../screens/Profile/ListProfileView";
import ListImageView from "../screens/Image/ListImageView";
import ImageDetailView from "../screens/Image/ImageDetailView";
import ImageDetailInfoView from "../screens/Image/ImageDetailInfoView";
import SelectImageForAlbumView from "../screens/Image/SelectImageForAlbumView";
import PrivacyPolicyScreen from "../screens/Settings/PrivacyPolicyScreen";
import TermsOfServiceScreen from "../screens/Settings/TermsOfServiceScreen";
import UserScreen from "../screens/Search/UserScreen";
import SelectFamily from "../screens/SelectFamily";
import ListAlbumView from "../screens/Album/ListAlbumView";
import AlbumDetailView from "../screens/Album/AlbumDetailView";
import AlbumDetailInfoView from "../screens/Album/AlbumDetailInfoView";
import EventScreen from "../screens/Event/EventScreen";
import FamilyTreeScreen from "../screens/FamilyTree/FamilyTreeScreen";
import FamilyTreeCreate from "../screens/FamilyTree/FamilyTreeCreate";
import FamilyTreeInfo from "../screens/FamilyTree/FamilyTreeInfo";
import FamilyTreeEdit from "../screens/FamilyTree/FamilyTreeEdit";
import FamilyTreeInfoScreen from "../screens/FamilyTree/FamilyTreeInfo";
import FamilyTreeEditScreen from "../screens/FamilyTree/FamilyTreeEdit";
import FamilyTreeDetailTab from "../screens/FamilyTree/FamilyTreeDetailTab";
import FamilySelect from "../screens/FamilyTree/FamilySelect";
import SuggestConnectScreen from "../screens/Search/SuggestConnectScreen";
import FamilyStats from "../screens/FamilyTree/FamilyStats";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen
                name="Splash"
                component={Splash}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="AddMember" component={AddMember} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ConfirmAccount" component={ConfirmAccount} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="SearchUser" component={SearchUserScreen} />
            <Stack.Screen name="FamilyDetail" component={FamilyDetailsScreen} />
            <Stack.Screen name="FamilyCreate" component={FamilyCreate} />
            <Stack.Screen name="ListImageView" component={ListImageView} options={{ headerShown: false }} />
            <Stack.Screen name="ImageDetailView" component={ImageDetailView} options={{ headerShown: false }} />
            <Stack.Screen name="ImageDetailInfoView" component={ImageDetailInfoView} options={{ headerShown: false }} />
            <Stack.Screen name="ListAlbumView" component={ListAlbumView} options={{ headerShown: false }} />
            <Stack.Screen name="AlbumDetailView" component={AlbumDetailView} options={{ headerShown: false }} />
            <Stack.Screen name="AlbumDetailInfoView" component={AlbumDetailInfoView} options={{ headerShown: false }} />
            <Stack.Screen name="SelectImageForAlbumView" component={SelectImageForAlbumView} options={{ headerShown: false }} />
            <Stack.Screen name="ListProfileView" component={ListProfileView} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileDetailView" component={ProfileDetailView} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileUpdateView" component={ProfileUpdateView} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileCreateView" component={ProfileCreateView} options={{ headerShown: false }} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
            <Stack.Screen name="FamilyStats" component={FamilyStats} />
            <Stack.Screen
                name="ManageUser" 
                component={UserScreen} 
                options={{
                    title: t('manage_user'),
                    headerStyle: { backgroundColor: '#1e88e5' },
                    headerTintColor: '#fff',
                }}/>
            <Stack.Screen name="SelectFamily" component={SelectFamily} options={{ title: 'Select Family' }} />
            <Stack.Screen name="EventScreen" component={EventScreen} />
            <Stack.Screen 
                name="SuggestUser" 
                component={SuggestConnectScreen} 
                options={{
                    title: t('suggest_connect'),
                    headerStyle: { backgroundColor: '#1e88e5' },
                    headerTintColor: '#fff', 
                }} />
            <Stack.Screen
                name="TreeCategoryScreen"
                component={TreeCategoryScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CreateStoryScreen"
                component={CreateStoryScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ListStoryScreen"
                component={ListStoryScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="FamilyStoryScreen"
                component={FamilyStoryScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="EditStoryScreen"
                component={EditStoryScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetailStoryScreen"
                component={DetailStoryScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="Tab"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="FamilyTree" component={FamilyTreeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FamilyTreeCreate" component={FamilyTreeCreate} options={{ headerShown: false }} />
            <Stack.Screen name="FamilyTreeDetailTab" component={FamilyTreeDetailTab} options={{ headerShown: false }} />
            <Stack.Screen name="FamilySelect" component={FamilySelect} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#1e88e5",
                tabBarInactiveTintColor: "gray",
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="FamilyTree"
                component={FamilyTreeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="git-branch-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Family"
                component={Family}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="document-text-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Menu"
                component={MenuScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="menu-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};


export default AppNavigator;
