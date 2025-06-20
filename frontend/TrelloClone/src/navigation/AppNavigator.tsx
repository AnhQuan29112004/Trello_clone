import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import WorkspaceScreen from "../screens/workspace/WorkspaceScreen";
import DrawerScreen from "../screens/settings/DrawerScreen";
import * as Keychain from "react-native-keychain";
import { useAuthStore } from "../store/authStore";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CreateBoardScreen from "../screens/workspace/CreateBoardScreen";
import BoardScreen from "../screens/board/BoardScreen";
import CardDetailScreen from "../screens/card/CardDetailScreen";
import SearchWorkspaceScreen from "../screens/workspace/SearchWorkspaceScreen";
import MemberWorkspaceScreen from "../screens/workspace/MemberWorkspaceScreen";
import AddMemberScreen from "../screens/workspace/AddMemberScreen";
import SearchUserToAddScreen from "../screens/workspace/SearchUserToAddScreen";
import UpdateWorkspaceScreen from "../screens/workspace/UpdateWorkspaceScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // const isAuthenticated = true;
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    const checkToken = async () => {
      const credentials = await Keychain.getGenericPassword({ service: 'com.trello.accessToken' });
      console.log("Credentials: ", credentials)
      setIsAuthenticated(!!credentials);
    };

    checkToken();
  }, [isAuthenticated]);

  console.log("isAuthenticated: ", isAuthenticated)
  if (isAuthenticated === null) {
    return null; // or a SplashScreen
  }


  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isAuthenticated ? "Drawer" : "Login"}>
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Drawer"
                component={DrawerScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="UpdateWorkspace"
                component={UpdateWorkspaceScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SearchUserToAdd"
                component={SearchUserToAddScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="AddMember"
                component={AddMemberScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="MemberWorkspace"
                component={MemberWorkspaceScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="SearchWorkspace"
                component={SearchWorkspaceScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CreateBoard"
                component={CreateBoardScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Board"
                component={BoardScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="CardDetail"
                component={CardDetailScreen}
                options={{
                  headerBackVisible: false,
                  gestureEnabled: false,
                  headerShown: false,
                  
                }}
              />
            </>


          ) : (
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: "Login" }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ title: "Register" }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
