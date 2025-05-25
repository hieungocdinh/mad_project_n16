import 'react-native-gesture-handler';
import 'react-native-reanimated'
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { I18nextProvider } from "react-i18next";
import i18n from "./src/i18n";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./src/context/authContext";
import { AlertProvider } from "./src/context/alertContext";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <AlertProvider>
          <NavigationContainer>
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </NavigationContainer>
        </AlertProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}
