import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Dimensions, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Provider as PaperProvider, Appbar, Button, IconButton, TextInput, Icon, Modal, Portal } from 'react-native-paper';
import ThemedView from "../../shared/components/ThemedView";
import ThemedText from "../../shared/components/ThemedText";
import { useCallback, useEffect, useRef, useState } from "react";
import { RootNavigationProp, RootRouteProp } from "../../types/types";
import { ScrollView } from "react-native-gesture-handler";
import boardService from "../../services/Board/boardService";
import { BoardResponse } from "../../types/auth.type";
import cardService from "../../services/Board/cardService";
import listService from "../../services/Board/listService";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import ColorPicker from "react-native-wheel-color-picker";

const BoardScreen = () => {
    const drawerNavigation = useNavigation<DrawerNavigationProp<any>>();
    const navigation = useNavigation<RootNavigationProp<'Workspace'>>();
    const cardNavigation = useNavigation<RootNavigationProp<'CardDetail'>>();
    const route = useRoute<RootRouteProp<'Board'>>();
    const { boardId } = route.params;

    const data = [
        { label: 'Edit', value: 'edit' },
        { label: 'Delete', value: 'delete' },
    ];


    const [cardContent, setCardContent] = useState('');
    const [currentBoard, setCurrentBoard] = useState<BoardResponse | null>(null);

    const [scale, setScale] = useState(1);
    const [isZoomOut, setIsZoomOut] = useState(false);
    const [isAddList, setIsAddList] = useState(false);
    const [isSearchBoard, setIsSearchBoard] = useState(false);
    const [searchContent, setSearchContent] = useState('');
    const [listName, setListName] = useState('');
    const [cardName, setCardName] = useState('');
    const [addingCardListId, setAddingCardListId] = useState<number | null>(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const scrollViewRef = useRef<ScrollView>(null);
    const [scrollOffset, setScrollOffset] = useState(0);

    const [editingListId, setEditingListId] = useState<number | null>(null);
    const [editedName, setEditedName] = useState('');

    const [menuVisible, setMenuVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedBoardName, setEditedBoardName] = useState('');

    const [backgroundColor, setBackgroundColor] = useState<string | undefined>('');
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleFocus = () => {
        setScrollEnabled(false);
        // Save current scroll position
        //@ts-ignore
        scrollViewRef.current?.getScrollResponder()?.scrollTo({ x: scrollOffset, animated: false });
    };

    const handleBlurList = () => {
        setScrollEnabled(true);
        setIsAddList(false);
        setListName('');
    };

    const handleBlurCard = () => {
        setScrollEnabled(true);
        setTimeout(() => {
            setAddingCardListId(null);
        }, 500);
        setCardName('');
    };

    const handleScroll = (event: any) => {
        setScrollOffset(event.nativeEvent.contentOffset.x); // Update scroll position on scroll
    };

    const handleAddList = (data: string, boardId: number) => {

        try {
            const res = listService.create({ name: listName, board: boardId })
            console.log(res);
            setListName('');
            setIsAddList(false);
            getBoardData(null);
        } catch (error) {
            console.error('Error adding list data:', error);
        }


    };

    const handleAddCard = (data: string, listId: number) => {

        try {
            const res = cardService.create({ name: cardName, listCard: listId })
            console.log(data, listId)
            setCardName('');
            setAddingCardListId(null);
            getBoardData(null);
        } catch (error) {
            console.error('Error adding card data:', error);
        }


    };

    const darkenColor = (hex: any, amount = 80) => {
        let color = hex.replace('#', '');
        if (color.length === 3) {
            color = color.split('').map((c: any) => c + c).join('');
        }
        const num = parseInt(color, 16);
        let r = Math.max((num >> 16) - amount, 0);
        let g = Math.max(((num >> 8) & 0x00FF) - amount, 0);
        let b = Math.max((num & 0x0000FF) - amount, 0);
        return `rgb(${r}, ${g}, ${b})`;
    };
    const handlePress = (cardId: number) => {
        cardNavigation.navigate("CardDetail", { cardId: cardId });
    }

    const getBoardData = async (params: any) => {
        try {
            const res = await boardService.getById(boardId, '/get', '', { keySearch: params ?? null });
            console.log(res)
            if (res && res.code === "SUCCESS") {
                //@ts-ignore
                setCurrentBoard(res.data);
            }

        } catch (error) {
            console.error('Error fetching board data:', error);
        }

    }

    const handleDeleteList = async (id: number) => {
        try {
            const res = await listService.delete(id);
            if (res && res.code === "SUCCESS") {
                getBoardData(null);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleSaveListName = async (listId: any) => {
        // Save edited name logic here (e.g., API call or state update)
        console.log(`Saving list ${listId} name:`, editedName);
        try {
            const res = await listService.update(listId, { name: editedName })
            console.log(res)
            if (res) {
                getBoardData(null);
            }
        } catch (e) {
            console.log(e)
        }
        setEditingListId(null);
    };

    const handleEditBoard = () => {
        setEditedBoardName(currentBoard?.name || '');
        setBackgroundColor(currentBoard?.background_color)
        setEditModalVisible(true);
        setMenuVisible(false);
    };

    const handleSaveBoardName = async () => {
        try {
            //@ts-ignore
            const res = await boardService.update(currentBoard?.id, { name: editedBoardName, background_color: backgroundColor });
            if (res) {
                getBoardData(null);
                setEditModalVisible(false);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getBoardData(null);
    }, [])


    useEffect(() => {
        console.log(boardId)
    }, [boardId])


    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getBoardData(searchContent);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchContent]);

    useFocusEffect(
        useCallback(() => {
            getBoardData(null);
        }, [])
    );


    const screenWidth = Dimensions.get('window').width;
    const modalWidth = screenWidth * 0.8;

    const styles = StyleSheet.create({
        colorPickerModal: {
            backgroundColor: '1E1E1E',
            padding: 20,
            width: modalWidth,     // 90% of screen width
            alignSelf: 'center',    // center the modal
            borderRadius: 10,
            position: 'relative'
        },
        colorBox: {
            width: 40,
            height: 40,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#ccc'
        },
        menuContainer: {
            position: 'absolute',
            right: 16,  // Adjusted from 10
            top: 80,    // Adjusted from 40 to account for AppBar height
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 8,
            width: 150,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 1000, // Increased from 100
        },
        menuItem: {
            padding: 12,
        },
        container: {
            backgroundColor: currentBoard?.background_color,
            overflow: 'hidden',
            width: '100%',
            // height: '100%',
            flex: 1
        },
        board: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: 10,
            overflow: "hidden",
            padding: 10
        },
        removeBorder: {
            borderWidth: 0,
            borderColor: 'transparent',
            elevation: 0, // Android shadow
            shadowColor: 'transparent', // iOS shadow
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
        },
        transparent: {
            backgroundColor: 'transparent',
        },
        zoomControls: {
            position: 'absolute',
            bottom: 50, // space from the bottom
            right: 20,   // space from the left
            zIndex: 1000, // optional: ensures it's above other content
            backgroundColor: "#42f57b",
            height: 70,
            width: 70,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            elevation: 5
        },
        list: {
            backgroundColor: 'rgba(0,0,0,1)',
            borderRadius: 8,
            padding: 15,
            paddingBottom: 70,
            width: 250,
            flexShrink: 0,
            position: 'relative',

        },
        card: {
            backgroundColor: 'rgb(68, 64, 64)',
            borderRadius: 5,
            padding: 10,
            marginTop: 10,
            width: '100%',
        },
        addCardBtn: {
            position: 'absolute',
            left: 0,
            bottom: 10
        },

        // Fixed modal styles
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1001, // Higher than menu
        },
        modalContent: {
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 20,
            margin: 20,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 16,
            color: 'black', // Explicit color
        },
        modalInput: {
            marginBottom: 20,
            backgroundColor: 'white',
        },
        modalButtons: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 10,
            marginTop: 10,
        },

    });

    return (
        <>
            {currentBoard ? (
                <ThemedView style={{ flex: 1 }}>
                    <Appbar.Header style={{ alignItems: 'center', backgroundColor: darkenColor(currentBoard?.background_color) }}>
                        <Appbar.Action icon="arrow-left" onPress={() => navigation.goBack()} />
                        {isSearchBoard ? (
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <TextInput
                                    placeholder="Search..."
                                    value={searchContent}
                                    onChangeText={setSearchContent}
                                    mode="flat"
                                    underlineColor="transparent"
                                    dense
                                    autoFocus
                                    style={{
                                        height: 40,
                                        backgroundColor: darkenColor(currentBoard?.background_color),
                                    }}
                                />
                            </View>
                        ) : (
                            <Appbar.Content title={currentBoard?.name} />
                        )}
                        <Appbar.Action
                            icon={isSearchBoard ? 'close' : 'magnify'}
                            onPress={() => {
                                setIsSearchBoard(!isSearchBoard);
                                if (isSearchBoard) setSearchContent('');
                            }}
                        />
                        <Appbar.Action icon="bell" />
                        <Appbar.Action
                            icon="dots-vertical"
                            onPress={() => setMenuVisible(!menuVisible)}
                        />


                    </Appbar.Header>

                    {menuVisible && (
                        <View style={styles.menuContainer}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleEditBoard}
                            >
                                <Text>Edit Board</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItem, { borderTopWidth: 1, borderTopColor: '#eee' }]}
                                onPress={() => {
                                    setMenuVisible(false);
                                    Alert.alert(
                                        'Delete Board',
                                        'Are you sure you want to delete this board?',
                                        [
                                            { text: 'Cancel', style: 'cancel' },
                                            {
                                                text: 'Delete', onPress: () => {
                                                    boardService.delete(currentBoard?.id);
                                                    navigation.goBack();
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Text style={{ color: 'red' }}>Delete Board</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <ThemedView style={[styles.container]}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                contentContainerStyle={{ gap: 12, padding: 10, alignItems: 'flex-start' }}
                                showsHorizontalScrollIndicator={false}
                                scrollEnabled={scrollEnabled}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                            >
                                {currentBoard?.boardlists?.map(list => (
                                    <View key={list.id} style={styles.list}>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {editingListId === list.id ? (
                                                <TextInput
                                                    style={{
                                                        flex: 1, backgroundColor: 'transparent', color: 'white'
                                                    }}
                                                    value={editedName}
                                                    onChangeText={setEditedName}
                                                    autoFocus
                                                    onBlur={() => handleSaveListName(list.id)}
                                                    onSubmitEditing={() => handleSaveListName(list.id)}
                                                    underlineColor="transparent"
                                                    activeUnderlineColor="transparent"
                                                    dense
                                                />
                                            ) : (
                                                <TouchableOpacity
                                                    style={{ flex: 1 }}
                                                    onPress={() => {
                                                        setEditingListId(list.id);
                                                        setEditedName(list.name);
                                                    }}
                                                >
                                                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'white' }}>
                                                        {list.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <IconButton
                                                icon="trash-can-outline"
                                                size={20}
                                                onPress={() => {
                                                    Alert.alert(
                                                        'Delete List',
                                                        'Are you sure you want to delete this list?',
                                                        [
                                                            { text: 'Cancel', style: 'cancel' },
                                                            { text: 'Delete', onPress: () => handleDeleteList(list.id) }
                                                        ]
                                                    );
                                                }}
                                            />
                                        </View>


                                        {/* Cards inside this list */}
                                        <DraggableFlatList
                                            data={list.listcard}
                                            keyExtractor={(item) => item.id.toString()}
                                            onDragEnd={({ data }) => {
                                                const updatedBoard = {
                                                    ...currentBoard,
                                                    boardlists: currentBoard.boardlists.map((l) => {
                                                        if (l.id === list.id) {
                                                            return {
                                                                ...l,
                                                                listcard: data,
                                                            };
                                                        }
                                                        return l;
                                                    }),
                                                };
                                                setCurrentBoard(updatedBoard);
                                            }}
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
                                                                            {item.tasks.filter(task => task.completed).length}/{item.tasks.length}
                                                                        </Text>
                                                                    </>
                                                                )}
                                                            </View>
                                                        </Pressable>
                                                    </Animated.View>

                                                );
                                            }}
                                            containerStyle={{ width: '100%' }}
                                            scrollEnabled={false}
                                        />



                                        {/* Add Card Input */}
                                        {addingCardListId === list.id ? (
                                            <View style={{ position: 'relative' }}>
                                                <TextInput
                                                    label="Tên Thẻ"
                                                    mode="flat"
                                                    style={{ backgroundColor: 'transparent' }}
                                                    value={cardName}
                                                    onChangeText={setCardName}
                                                    onBlur={handleBlurCard}
                                                    onFocus={handleFocus}
                                                    autoFocus={true}
                                                    onSubmitEditing={() => handleAddCard(cardName, list.id)}
                                                />
                                                <Pressable
                                                    onPress={() => handleAddCard(cardName, list.id)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: 10,
                                                        top: 20, // Adjust depending on font size
                                                        zIndex: 1,
                                                    }}
                                                >
                                                    <Icon source="check" size={24} color="#2196f3" />
                                                </Pressable>
                                            </View>

                                        ) : (
                                            <Button mode="text" icon="plus" style={styles.addCardBtn} onPress={() => setAddingCardListId(list.id)}>
                                                Thêm thẻ
                                            </Button>
                                        )}
                                    </View>
                                ))}

                                {/* Add List Button or Input */}
                                <View style={{ ...styles.list, paddingBottom: 0, padding: 0 }}>
                                    {isAddList ? (
                                        <TextInput
                                            label="Tên danh sách"
                                            mode="flat"
                                            style={{ backgroundColor: 'transparent' }}
                                            value={listName}
                                            onChangeText={setListName}
                                            onBlur={handleBlurList}
                                            onFocus={handleFocus}
                                            autoFocus={true}
                                            onSubmitEditing={() => handleAddList(listName, currentBoard?.id)}
                                            right={<TextInput.Icon icon="check" onPress={() => handleAddList(listName, currentBoard?.id)} />}
                                        />
                                    ) : (
                                        <Button mode="text" icon="plus" onPress={() => setIsAddList(true)}>
                                            Thêm danh sách
                                        </Button>
                                    )}
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </ThemedView>
                    <IconButton
                        icon={isZoomOut ? 'magnify-plus-outline' : 'magnify-minus-outline'}
                        size={35}
                        mode="contained-tonal"
                        style={styles.zoomControls}
                        iconColor="black"
                    />
                </ThemedView>
            ) : (
                <View>
                    <Text>Loading board...</Text>
                </View>
            )}

            <Portal>
                <Modal
                    visible={editModalVisible}
                    onDismiss={() => setEditModalVisible(false)}
                    contentContainerStyle={styles.modalContent}
                >
                    <Text style={styles.modalTitle}>Edit Board Name</Text>
                    <TextInput
                        value={editedBoardName}
                        onChangeText={setEditedBoardName}
                        style={styles.modalInput}
                        autoFocus
                        mode="outlined"
                        textColor="black"
                    />

                    <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', backgroundColor: '#2b2b2b', padding: 10 }}>
                        <ThemedText>
                            Phông nền bảng
                        </ThemedText>
                        <TouchableOpacity
                            style={[styles.colorBox, styles.removeBorder, { backgroundColor: backgroundColor }]}
                            onPress={() => setVisible(true)}
                        />
                    </View>
                    <View style={styles.modalButtons}>
                        <Button
                            mode="outlined"
                            onPress={() => setEditModalVisible(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSaveBoardName}
                            disabled={!editedBoardName.trim()}
                            style={{ marginLeft: 8 }}
                        >
                            Save
                        </Button>
                    </View>
                </Modal>
            </Portal>

            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={[styles.colorPickerModal, styles.removeBorder]}>
                    <View style={{ height: 300 }}>
                        <ColorPicker
                            color={backgroundColor}
                            onColorChange={setBackgroundColor}

                        />
                    </View>
                </Modal>
            </Portal>
        </>
    );
};

export default BoardScreen;