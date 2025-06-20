import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Provider as PaperProvider,Icon, Appbar, Button, IconButton, TextInput, Portal, Modal } from 'react-native-paper';
import ThemedView from "../../shared/components/ThemedView";
import ThemedText from "../../shared/components/ThemedText";
import { use, useEffect, useState } from "react";
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



type WorkspaceScreenRouteProp = RouteProp<{
    SearchWorkspace: { workspaceId: number };
}, 'SearchWorkspace'>;


const SearchWorkspaceScreen = (props: any) => {
    const drawerNavigation = useNavigation<DrawerNavigationProp<any>>();
    const navigation = useNavigation<RootNavigationProp<'SearchWorkspace'>>();
    const cardNavigation = useNavigation<RootNavigationProp<'CardDetail'>>();

    const route = useRoute<WorkspaceScreenRouteProp>();

    const [keySearch, setKeySearch] = useState<string>('');
    const [board, setBoard] = useState<any | null>(null);
    const [card, setCard] = useState<any | null>(null);
    const handelSearchInWorkspace = async (key: string, id:any) => {
        const keySearch = key.trim().replace(/\s+/g, "");
        if (keySearch.length === 0) {    
            setBoard([]);
            setCard([]);
            return;
        }
        const res = await SearchWorkspaceService.searchInWorkspace(id, '/get', '', { keySearch: keySearch });
        if (res && res.code === "SUCCESS")
            setBoard(res.data.boards);
            setCard(res.data.cards);
            console.log("res: ", res);
    };
    const handlePress = (cardId: number) => {
        cardNavigation.navigate("CardDetail", { cardId: cardId });
    }
    useEffect(() => {
        const Id = route.params.workspaceId;
        if (Id) {
            handelSearchInWorkspace(keySearch, Id);
        } else {
            Alert.alert("Lỗi", "Không tìm thấy workspace");
        }
        
        console.log("keySearch: ", keySearch);
        console.log("workspaceId: ", Id);
        console.log("board: ", board);
        console.log("card: ", card);
    }, [keySearch]);

    return (
        <>
            <ThemedView style={{ flex: 1 }}>

                <Appbar.Header style={{ alignItems: 'center' }}>
                    <Appbar.Action
                        icon="arrow-left-thin"
                        onPress={() => navigation.goBack()}
                    />
                    <TextInput
                                style={styles.txtInput}
                                mode="flat"
                                label="Tìm kiếm"
                                underlineColor="transparent"
                                onChangeText={(text) => setKeySearch(text)}
                                value={keySearch}
                              />
                </Appbar.Header>
                {board && board.length > 0 && (
                    <>
                        <View style={styles.cardRow}>
                            <Text style={styles.label}>Bảng</Text>
                        </View>

                        {board.map((the: any) => (
                            <Pressable key={the.id} onPress={() => navigation.navigate('Board', { boardId: the.id })}>
                                <ThemedView style={{ display: 'flex', gap: 20, alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                                    <ThemedView style={{ backgroundColor: the.background_color, borderRadius: 3, overflow: 'hidden', width: 60, height: 40 }} />
                                    <ThemedText>{the?.name}</ThemedText>
                                </ThemedView>
                            </Pressable>
                        ))}
                    </>
                )}
                {card && card.length > 0 && (
                    <>
                        <View style={styles.cardRow}>
                            <Text style={styles.label}>Thẻ</Text>
                        </View>

                        <DraggableFlatList
                                            data={card}
                                            keyExtractor={(item:any) => item.id.toString()}
                                            renderItem={({ item, drag, isActive }) => {
                                                const animatedStyle = useAnimatedStyle(() => ({
                                                    transform: [{ scale: isActive ? withSpring(1.05) : withSpring(1) }],
                                                    backgroundColor: withSpring(isActive ? '#ffffff22' : '#333'),
                                                    shadowColor: '#000',
                                                    shadowOpacity: isActive ? 0.3 : 0,
                                                    shadowRadius: isActive ? 6 : 0,
                                                    elevation: isActive ? 6 : 0,
                                                }));

                                                return (
                                                    <>
                                                    <Animated.View style={[styles.card, animatedStyle]}>
                                                        <Pressable
                                                            onPress={() => handlePress(item.id)}
                                                            onLongPress={drag}
                                                            style={{ flex: 1 }}
                                                        >
                                                            <Text style={{ fontSize: 12, marginBottom: 8, color: 'white' }}>
                                                                {item.name}
                                                            </Text>

                                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                                                                {item.description && (
                                                                    <Icon source="file-document-outline" size={16} color="white" />
                                                                )}

                                                                {(item.start_date || item.end_date) && (
                                                                    <>
                                                                        <Icon source="calendar-range" size={16} color="white" />
                                                                        <Text style={{ fontSize: 10, color: 'white' }}>
                                                                            {(item.start_date ?? '...')} - {(item.end_date ?? '...')}
                                                                        </Text>
                                                                    </>
                                                                )}

                                                                {Array.isArray(item.tasks) && item.tasks.length > 0 && (
                                                                    <>
                                                                        <Icon source="check-circle-outline" size={16} color="white" />
                                                                        <Text style={{ fontSize: 10, color: 'white' }}>
                                                                            {item.tasks.filter((task:any) => task.completed).length}/{item.tasks.length}
                                                                        </Text>
                                                                    </>
                                                                )}
                                                            </View>
                                                        </Pressable>
                                                        
                                                    </Animated.View>
                                                    <Text style={styles.txtCard}>Thẻ "<Text style={{fontWeight:'bold'}}>{item.name}</Text>" trong danh sách "<Text style={{fontWeight:'bold'}}>{item.nameList}</Text>"</Text>
                                                    </>                   
                                                );
                                            }}
                                            containerStyle={{ width: '100%' }}
                                            scrollEnabled={false}
                                        />
                    </>
                )}
            </ThemedView>
            

            
        </>

    )
};

export default SearchWorkspaceScreen;
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    paddingBottom: 100,
  },
  cardRow: {
    backgroundColor: "#2b2b2b",
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
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