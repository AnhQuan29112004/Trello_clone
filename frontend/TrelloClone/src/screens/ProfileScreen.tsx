import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";
import { RootNavigationProp, RootRouteProp } from "../types/types";
import { clearTokens } from "../services/Auth/tokenService";
import { useAuthStore } from "../store/authStore";
import { Provider as PaperProvider, Appbar } from 'react-native-paper';
import { DrawerNavigationProp } from "@react-navigation/drawer";

const ProfileScreen = () => {
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const route = useRoute<RootRouteProp<'Profile'>>();
    const { name } = route.params || {};
const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

      const handleLogout = async () => {
        await clearTokens();
        setIsAuthenticated(false);

      }
    return (

        <View>
          <Appbar.Header style={{ alignItems: 'center' }}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => navigation.openDrawer()}
                />
                <Appbar.Content title="Profile" />
            </Appbar.Header>
            <Text>This is {name}'s' profile</Text>
            <Text onPress={handleLogout}>Log Out</Text>
        </View>
    )
  };

  export default ProfileScreen
