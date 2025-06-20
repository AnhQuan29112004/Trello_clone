import { createDrawerNavigator } from '@react-navigation/drawer';
import WorkspaceScreen from '../workspace/WorkspaceScreen';
import ProfileScreen from '../ProfileScreen';
import SettingScreen from './SettingScreen';
import { Appbar, Drawer as PaperDrawer } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootNavigationProp } from '../../types/types';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuthStore } from "../../store/authStore";
import { clearTokens } from "../../services/Auth/tokenService";
import { RootStackParamList } from '../../types/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from "react-native";
import { Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import workspaceService from '../../services/Workspace/workspaceService';
import { useEffect, useState } from 'react';
import { WorkspaceResponse } from '../../types/auth.type';


const Stack = createNativeStackNavigator();

const Drawer = createDrawerNavigator<RootStackParamList>();


const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0079BF' },
        headerTintColor: '#fff',
        headerBackVisible: false,
        headerShown: true
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingScreen}
        options={({ navigation }) => ({
          title: 'Settings',
          headerLeft: () => (
            <Appbar.Action
              icon="arrow-left"
              color="#fff"
              onPress={() => navigation.goBack()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const DrawerContent = (props: any) => {
  console.log(props)
  const { state, navigation } = props;
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const [listWorkspace, setListWorkspace] = useState<WorkspaceResponse[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceResponse | null>(null);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<number | null>(null);

  const handleLogout = async () => {
    await clearTokens();
    setIsAuthenticated(false);
  };

  const handleGetWorkspace = async () => {
    const res = await workspaceService.getList();

    if (res && res.code === 'SUCCESS') {
      setListWorkspace(res.data);
    }
  }

  useEffect(() => {
    handleGetWorkspace();
  }, [])

  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: "#1f1f1f" }}>
      <PaperDrawer.Section title="" >
        {listWorkspace && listWorkspace.length > 0 &&
          listWorkspace.map((workspace) => {
            return (
              <PaperDrawer.Item
                label={workspace.workspace.name}
                active={activeWorkspaceId === workspace.workspace.id}
                key={workspace.workspace.id}
                onPress={() => {
                  setActiveWorkspaceId(workspace.workspace.id);
                  console.log(workspace.workspace.id)
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'Workspace',
                        params: { workspaceId: workspace.workspace.id },
                      },
                    ],
                  });
                }}
                icon="star"
                style={{ backgroundColor: activeWorkspaceId === workspace.workspace.id ? '#64ffda' : 'transparent' }}
              />
            )
          })
        }
        <PaperDrawer.Item
          label="Profile"
          active={state.index === 1}
          onPress={() => navigation.navigate('Profile')}
          icon="inbox"
        />
      </PaperDrawer.Section>
      <PaperDrawer.Section>
        <PaperDrawer.Item
          label="Settings"
          active={state.index === 2}
          onPress={() => navigation.navigate('MainStack', { screen: 'Settings' })}
          icon="cog"
        />
        <PaperDrawer.Item
          label="Logout"
          onPress={handleLogout}
          icon="logout"
          style={{ backgroundColor: '#f4f4f4' }}
        />
      </PaperDrawer.Section>
    </DrawerContentScrollView>
  );
};

const DrawerScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0079BF",
          },
          headerTintColor: '#fff',
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name="Workspace"
          component={WorkspaceScreen}
          options={{
            title: 'Trello Workspace',
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
          }}
        />
        <Drawer.Screen
          name="MainStack"
          component={MainStackNavigator}
          options={{
            title: 'Stack Screens',
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default DrawerScreen;