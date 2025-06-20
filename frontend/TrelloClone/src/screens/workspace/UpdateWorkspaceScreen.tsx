import { RouteProp,useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View,TouchableOpacity, FlatList } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Provider as PaperProvider,Icon, Appbar, Button, IconButton, TextInput, Portal, Modal } from 'react-native-paper';
import ThemedView from "../../shared/components/ThemedView";
import ThemedText from "../../shared/components/ThemedText";
import { use, useEffect, useState,useRef  } from "react";
import { RootNavigationProp } from "../../types/types";
import { Dropdown } from "react-native-paper-dropdown";
import SearchWorkspaceService from "../../services/Workspace/searchinworkspace";
import listService from "../../services/Board/listService";
import boardService from "../../services/Board/boardService";
import cardService from "../../services/Board/cardService";
import Toast from "react-native-toast-message";
import { BoardResponse, WorkspaceResponse } from "../../types/auth.type";
import { set } from "lodash";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import api from "../../services/api";
import { useCallback } from "react";
import { el } from "react-native-paper-dates";


type WorkspaceScreenRouteProp = RouteProp<{
    UpdateWorkspace: { workspaceId: number };
}, 'UpdateWorkspace'>;

const UpdateWorkspaceScreen = (props: any) => {
    const drawerNavigation = useNavigation<DrawerNavigationProp<any>>();
    const navigation = useNavigation<RootNavigationProp<'UpdateWorkspace'>>();
    const cardNavigation = useNavigation<RootNavigationProp<'CardDetail'>>();

    const route = useRoute<WorkspaceScreenRouteProp>();

    const [name, setName] = useState('');
    const [input, setInput] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    

    useFocusEffect(
      useCallback(() => {
        const fetchUsers = async () => {
          try {
            const response = await api.get(`/v1/workspace/get/${route.params.workspaceId}`);
            const wsName = response.data.data.name;
            setName(wsName);
            setInput(wsName); 
          } catch (error) {
            console.error('Lỗi khi tìm người dùng:', error);
          }
        };
        fetchUsers();
      }, [route.params.workspaceId])
    );

    useEffect(() => {
      if (input.trim() === name.trim() || input.trim() === '') return;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        try {
          await api.put(`/v1/workspace/update/${route.params.workspaceId}`, {
            name: input.trim(),
          });
          console.log('Đã cập nhật workspace');
          setName(input.trim()); 
        } catch (error) {
          console.error('Lỗi khi cập nhật:', error);
        }
      }, 600); 

      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, [input]);


  return (
    <ThemedView style={{ flex: 1 }}>
        <Appbar.Header style={{ alignItems: 'center' }}>
            <Appbar.Action
                icon="arrow-left-thin"
                onPress={() => navigation.goBack()}
            />
            <Appbar.Content title="Cài đặt không gian làm việc" />
           
        </Appbar.Header>

      

      <View style={styles.cardRow}>
        <Text style={styles.label}>Tên</Text>
        <TextInput
          style={styles.txtInput}
          mode="flat"
          underlineColor="transparent"
          value={input}
          onChangeText={setInput}
        />
      </View>

    </ThemedView>
    
    )
};

export default UpdateWorkspaceScreen;
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    paddingBottom: 100,
  },
  cardRow: {
    backgroundColor: "#2b2b2b",
    borderColor: "gray",
    padding: 12,
    paddingLeft: 30,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  txtInput: {
    width: "70%",
    backgroundColor: "#2b2b2b",
  },
  label: {
    color: "white",
    fontSize: 16,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dateInput: {
    backgroundColor: "#2b2b2b",
    height: 36,
    width: 200,
  },
  iconRight: {
    backgroundColor: "#2b2b2b",
    marginLeft: "auto",
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#2b2b2b",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    gap: 10,
  },
  card: {
    backgroundColor: 'rgb(68, 64, 64)',
    borderRadius: 5,
    padding: 10,
    width: '70%',
    marginLeft:59
   },
   txtCard: {
    color: 'white',
    marginLeft:59
   },
  commentInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
  },
});