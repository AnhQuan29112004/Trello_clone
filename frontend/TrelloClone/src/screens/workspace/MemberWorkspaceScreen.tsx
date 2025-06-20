import { RouteProp,useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Provider as PaperProvider,Icon, Appbar, Button, IconButton, TextInput, Portal, Modal } from 'react-native-paper';
import ThemedView from "../../shared/components/ThemedView";
import ThemedText from "../../shared/components/ThemedText";
import { use, useCallback, useEffect, useState } from "react";
import { RootNavigationProp } from "../../types/types";
import { Dropdown } from "react-native-paper-dropdown";
import WorkspaceService from "../../services/Workspace/workspaceService";
import listService from "../../services/Board/listService";
import boardService from "../../services/Board/boardService";
import cardService from "../../services/Board/cardService";
import Toast from "react-native-toast-message";
import { BoardResponse, WorkspaceResponse } from "../../types/auth.type";
import { set } from "lodash";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";



type WorkspaceScreenRouteProp = RouteProp<{
    MemberWorkspace: { workspaceId: number , name: string };
}, 'MemberWorkspace'>;


const MemberWorkspaceScreen = (props: any) => {
    const drawerNavigation = useNavigation<DrawerNavigationProp<any>>();
    const navigation = useNavigation<RootNavigationProp<'MemberWorkspace'>>();
    const cardNavigation = useNavigation<RootNavigationProp<'CardDetail'>>();

    const route = useRoute<WorkspaceScreenRouteProp>();

    const [users,setUsers] = useState<any[]>([]);
    const handelGetUserInWorkspace = async (id:any) => {
        const res = await WorkspaceService.getAllUserInWorkspace(id);
        if (res && res.code === "SUCCESS")
            setUsers(res.data);
            console.log("res: ", res);
    };
    const handlePress = (cardId: number) => {
        cardNavigation.navigate("CardDetail", { cardId: cardId });
    }
    useFocusEffect(
        useCallback(() => {
            handelGetUserInWorkspace(route.params.workspaceId);
        }, [route.params.workspaceId])
    );

    return (
        <>
            <ThemedView style={{ flex: 1 }}>
                <Appbar.Header style={{ alignItems: 'center' }}>
                    <Appbar.Action
                        icon="close"
                        onPress={() => navigation.goBack()}
                    />
                    <Appbar.Content title={`Menu không gian làm việc`} />
                    <Appbar.Action
                        icon="cog"
                        onPress={() => navigation.navigate("UpdateWorkspace", { workspaceId: route.params.workspaceId})}
                    />
                </Appbar.Header>
                <View style={styles.cardRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Icon source="account" size={20} />
                    <Text style={styles.label}>Người cộng tác</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom:10, paddingTop:10,marginLeft: 30 }}>
                    {users.map((user, index) => (
                            <View style={{height: 50, width:50, borderRadius:50, alignItems: 'center', gap: 10, marginBottom: 10}} key={index}>
                                <Text style={{textAlign:"center", textAlignVertical:"center", color:"white",height: 50, width:50, borderRadius:50, backgroundColor:getRandomColor()}}>{user.username}</Text>
                            </View>
                        
                    ))}
                    </View>
                    <Pressable onPress={() => {navigation.navigate("AddMember",{user:users, workspaceId: route.params.workspaceId})}}>
                        <ThemedText style={{marginLeft:30,textAlignVertical: 'center',textAlign: 'center', backgroundColor: '#007eff', borderRadius: 3, overflow: 'hidden', width: "90%", height: 40 , alignContent:'center', color:"black", fontWeight:"bold"}}>Quản lý</ThemedText>
                       
                    </Pressable>
                </View>
                
            </ThemedView>
            

            
        </>

    )
};

export default MemberWorkspaceScreen;
const getRandomColor = () => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[Math.floor(Math.random() * colors.length)];
    };

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    paddingBottom: 100,
  },
  cardRow: {
    backgroundColor: "#2b2b2b",
    borderColor: "gray",
    padding: 12,
    marginTop: 12,
    borderWidth:1,

    flexDirection: "column",
    gap: 10,
  },
  txtInput: {
    flex: 1,
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