import { RouteProp,useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Provider as PaperProvider, Icon, Appbar, Button, IconButton, TextInput, Portal, Modal } from 'react-native-paper';
import ThemedView from "../../shared/components/ThemedView";
import ThemedText from "../../shared/components/ThemedText";
import { use, useEffect, useState,useCallback } from "react";
import { RootNavigationProp } from "../../types/types";
import { Dropdown } from "react-native-paper-dropdown";
import SearchWorkspaceService from "../../services/Workspace/searchinworkspace";
import listService from "../../services/Board/listService";
import boardService from "../../services/Board/boardService";
import cardService from "../../services/Board/cardService";
import Toast from "react-native-toast-message";
import { BoardResponse, WorkspaceResponse } from "../../types/auth.type";
import { set } from "lodash";
import WorkspaceService from "../../services/Workspace/workspaceService";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import api from "../../services/api";
import { useAuthStore } from '../../store/authStore';


type WorkspaceScreenRouteProp = RouteProp<{
    AddMember: { user: any, workspaceId: number };
}, 'AddMember'>;

const AddMemberWorkspaceScreen = (props: any) => {
    const drawerNavigation = useNavigation<DrawerNavigationProp<any>>();
    const navigation = useNavigation<RootNavigationProp<'AddMember'>>();
    const cardNavigation = useNavigation<RootNavigationProp<'CardDetail'>>();
    const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
    const route = useRoute<WorkspaceScreenRouteProp>();
    const [users, setUsers] = useState<any[]>(route.params.user);
    const [currentUserRole, setCurrentUserRole] = useState<string>('');
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const countUser = users.length;
    const emailAuth = useAuthStore((state)=>state.emailAuth);
    const handelGetUserInWorkspace = async (id:any) => {
        const res = await WorkspaceService.getAllUserInWorkspace(id);
        if (res && res.code === "SUCCESS")
            setUsers(res.data);
            console.log("res: ", res);
    };
    useFocusEffect(
        useCallback(() => {
            handelGetUserInWorkspace(route.params.workspaceId);
        }, [route.params.workspaceId])
    );

    
    useEffect(() => {
        if (users.length > 0) {
            const colorsMap: { [key: string]: string } = {};
            users.forEach(user => {
                colorsMap[user.email] = getRandomColor();
            });
            setUserColors(colorsMap);
            getCurrentUserRole();
        }
    }, [users, emailAuth]);

    const getCurrentUserRole = () => {
        try {
            const currentUser = users.find(user => user.email === emailAuth);
            
            if (currentUser) {
                setCurrentUserRole(currentUser.role);
                console.log('Current user role:', currentUser.role);
            } else {
                console.log('Current user not found in workspace');
                setCurrentUserRole('');
            }
        } catch (error) {
            console.error('Error getting current user role:', error);
        }
    };

    const handleMemberPress = (member: any) => {
        if (currentUserRole === 'WORKSPACEOWN' && member.role !== 'WORKSPACEOWN') {
            setSelectedMember(member);
        }
    };

    const handleRemoveMember = (member: any) => {
        Alert.alert(
            "Xác nhận xóa thành viên",
            `Bạn có chắc chắn muốn xóa ${member.first_name} ${member.last_name} khỏi workspace này?`,
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => removeMemberFromWorkspace(member)
                }
            ]
        );
    };

    const handleLeaveWorkspace = (member:any) => {
        Alert.alert(
            "Xác nhận rời nhóm",
            "Bạn có chắc chắn muốn rời khỏi workspace này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Rời nhóm",
                    style: "destructive",
                    onPress: () => leaveWorkspace(member)
                }
            ]
        );
    };

    const removeMemberFromWorkspace = async (member: any) => {
        try {
            const response = await api.delete(`/v1/workspace/leave/${route.params.workspaceId}`, {
                data: { email: member.email } 
            });
            
            if (response.status === 200) {
                handelGetUserInWorkspace(route.params.workspaceId);

                setSelectedMember(null);
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Đã xóa thành viên khỏi workspace'
                });
            }
        } catch (error) {
            console.error('Error removing member:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể xóa thành viên. Vui lòng thử lại.'
            });
        }
    };

    const leaveWorkspace = async (member: any) => {
        try {
                const response = await api.delete(`/v1/workspace/leave/${route.params.workspaceId}`, {
                data: { email: member.email } 
            });            
            if (response.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Bạn đã rời khỏi workspace'
                });
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error leaving workspace:', error);
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Không thể rời workspace. Vui lòng thử lại.'
            });
        }
    };
    console.log("ROLE:", currentUserRole)
    console.log("EMAIL:", emailAuth)

    return (
        <>
            <ThemedView style={{ flex: 1 }}>
                <Appbar.Header style={{ alignItems: 'center' }}>
                    <Appbar.Action
                        icon="close"
                        onPress={() => navigation.goBack()}
                    />
                    <Appbar.Content title="Người cộng tác" />
                    <Pressable onPress={() => navigation.navigate("SearchUserToAdd", { workspaceId: route.params.workspaceId })} >
                        <ThemedText style={{ marginLeft: 30, textAlignVertical: 'center', textAlign: 'center', borderRadius: 3, overflow: 'hidden', width: 60, height: 40, alignContent: 'center' }}>Mời</ThemedText>
                    </Pressable>
                </Appbar.Header>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 10, paddingTop: 10 }}>
                    <Text style={styles.label}>Người cộng tác ({countUser})</Text>
                </View>

                {users.map((user, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[
                            styles.cardRow,
                            selectedMember?.id === user.id && styles.selectedCard
                        ]}
                        onPress={() => handleMemberPress(user)}
                        activeOpacity={currentUserRole === 'WORKSPACEOWN' && user.role !== 'WORKSPACEOWN' ? 0.7 : 1}
                    >
                        <View style={styles.memberInfoContainer}>
                            <View style={[styles.avatar, { borderRadius: 50, backgroundColor: userColors[user.email] }]}>
                                <Text style={styles.avatarText}>{user.username}</Text>
                            </View>

                            <View style={styles.nameContainer}>
                                <Text style={styles.fullName}>{user.last_name + ' ' + user.first_name}</Text>
                                <Text style={styles.username}>{user.email}</Text>
                            </View>

                            <Pressable style={styles.roleButton}>
                                <Text style={styles.roleText}>{user.role}</Text>
                            </Pressable>

                            {currentUserRole === 'WORKSPACEOWN' && 
                             selectedMember?.id === user.id && 
                             user.role !== 'WORKSPACEOWN' && (
                                <TouchableOpacity 
                                    style={styles.deleteButton}
                                    onPress={() => handleRemoveMember(user)}
                                >
                                    <Icon source="delete" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}

                {currentUserRole === 'MEMBER' && (
                    <View style={styles.leaveButtonContainer}>
                        <TouchableOpacity 
                            style={styles.leaveButton}
                            onPress={() => {
                                const currentUser = users.find(user => user.email === emailAuth);
                                if (currentUser) {
                                    handleLeaveWorkspace(currentUser);
                                }
                            }}
                        >
                            <Icon source="exit-to-app" size={20} color="white" />
                            <Text style={styles.leaveButtonText}>Rời nhóm</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ThemedView>
        </>
    )
};

export default AddMemberWorkspaceScreen;

const getRandomColor = () => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const styles = StyleSheet.create({
    label: {
        color: "white",
        fontSize: 16,
    },
    cardRow: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#1c1c1e',
        marginBottom: 1,
    },
    selectedCard: {
        backgroundColor: '#2c2c2e',
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
    },
    memberInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
    },
    nameContainer: {
        marginLeft: 10,
        flex: 1,
    },
    fullName: {
        color: 'white',
        fontWeight: 'bold',
    },
    username: {
        color: '#ccc',
        fontSize: 12,
    },
    roleButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#333',
        borderRadius: 4,
        marginRight: 10,
    },
    roleText: {
        color: 'white',
        fontSize: 12,
    },
    deleteButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#ff444420',
        justifyContent: 'center',
        alignItems: 'center',
    },
    leaveButtonContainer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 20,
    },
    leaveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4444',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    leaveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});