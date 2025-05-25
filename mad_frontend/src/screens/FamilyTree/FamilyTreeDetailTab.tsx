// src/navigators/FamilyTreeDetailTab.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RouteProp, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import { FamilyTreeDetailTabParam } from '../../types/family-tree-detail-tab-param';
import { RootStackParamList } from '../../types/root-stack-param';
import FamilyTreeInfoScreen from '../FamilyTree/FamilyTreeInfo';
import FamilyTreeEditScreen from '../FamilyTree/FamilyTreeEdit';
import UserScreen from '../Search/UserScreen';
import FamilyStats from "./FamilyStats";

const Tab = createBottomTabNavigator<FamilyTreeDetailTabParam>();

export default function FamilyTreeDetailTab() {
    const route = useRoute<RouteProp<RootStackParamList, 'FamilyTreeDetailTab'>>();
    const { familyTreeId } = route.params;

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: '#777',
            }}
        >
            <Tab.Screen
                name="FamilyTreeInfo"
                component={FamilyTreeInfoScreen}
                initialParams={{ familyTreeId }}
                options={{
                    tabBarLabel: 'Thông tin',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="information-circle-outline" color={color} size={size} />
                    ),
                    headerShown: false,
                }}
            />

            <Tab.Screen
                name="FamilyTreeEdit"
                component={FamilyTreeEditScreen}
                initialParams={{ familyTreeId }}
                options={{
                    tabBarLabel: 'Chỉnh sửa',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="create-outline" color={color} size={size} />
                    ),
                }}
            />

            <Tab.Screen
                name="ManageUser"
                component={UserScreen}
                options={{
                    tabBarLabel: 'Thành viên',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="people-outline" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
