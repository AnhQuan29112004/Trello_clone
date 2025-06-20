import React from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Alert, Pressable, StatusBar, StyleSheet, Text, View,TouchableOpacity, FlatList } from "react-native";
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
import api from "../../services/api";


type WorkspaceScreenRouteProp = RouteProp<{
    SearchUserToAdd: { workspaceId: number };
}, 'SearchUserToAdd'>;
const stringToColor = (str:any) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = (hash & 0x00ffffff).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - color.length) + color;
};

const SearchUserToAddScreen = (props: any) => {
    const drawerNavigation = useNavigation<DrawerNavigationProp<any>>();
    const navigation = useNavigation<RootNavigationProp<'SearchUserToAdd'>>();
    const cardNavigation = useNavigation<RootNavigationProp<'CardDetail'>>();

    const route = useRoute<WorkspaceScreenRouteProp>();

    const [input, setInput] = useState('');
  const [invites, setInvites] = useState<string[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

  const handleAdd = () => {
  if (input.trim() !== '' && !invites.includes(input.trim())) {
    setInvites([...invites, input.trim()]);
    setInput('');
  }
};

  const handleRemove = (index:any) => {
    const newList = [...invites];
    newList.splice(index, 1);
    setInvites(newList);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input.trim() === '') {
        setUsers([]); 
        return;
      }

      const fetchUsers = async () => {
        try {
          const response = await api.get(`/v1/workspace/search-user`, {
            params: { keySearch: input }
          });
          console.log(response.data.data)
          setUsers(response.data.data); 
        } catch (error) {
          console.error('Lỗi khi tìm người dùng:', error);
        }
      };

      fetchUsers();
    }, 300); 

    return () => clearTimeout(delayDebounce);
  }, [input]);
  const addMembers = async () => {
    for (const member of invites) {
      try {
        await api.post('/v1/workspace/addMember', {
          workspaceID: route.params.workspaceId,
          member: member, 
        });
      } catch (error) {
        console.error(`Lỗi khi thêm ${member}:`, error);
      }
    }
  };
    useEffect(() => {
        console.log('Users:', users);
    }, [users]);


  return (
    <ThemedView style={{ flex: 1 }}>
        <Appbar.Header style={{ alignItems: 'center' }}>
            <Appbar.Action
                icon="arrow-left-thin"
                onPress={() => navigation.goBack()}
            />
            <Appbar.Content title="Mời các thành viên" />
            <Pressable onPress={addMembers} >
                <ThemedText style={{marginLeft:30,textAlignVertical: 'center',textAlign: 'center', borderRadius: 3, overflow: 'hidden', width: 60, height: 40 , alignContent:'center'}}>Thêm</ThemedText>
                
            </Pressable>
        </Appbar.Header>
        <Text style={{ color: 'white', fontSize: 18, marginBottom: 8 ,marginTop: 20}}>
        Thêm người dùng vào không gian làm việc
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
        {invites.map((item, index) => {
          const initials = item.slice(0, 1).toUpperCase();
          const bgColor = stringToColor(item);
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#222',
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 4,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  backgroundColor: bgColor,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 6,
                }}
              >
                <Text style={{ color: 'white', fontSize: 12 }}>{initials}</Text>
              </View>
              <Text style={{ color: 'white' }}>@{item}</Text>
              <TouchableOpacity onPress={() => handleRemove(index)} style={{ marginLeft: 6 }}>
                <Text style={{ color: 'white' }}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <TextInput
        style={{
          backgroundColor: '#111',
          color: 'white',
          padding: 10,
          borderRadius: 6,
          marginBottom: 0,
        }}
        placeholder="@username hoặc email"
        placeholderTextColor="#666"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleAdd}
      />
      {input.length > 0 && users && users.length > 0 && (
        <View style={{
          backgroundColor: '#222',
          borderRadius: 6,
          marginTop: 2,
          marginBottom: 12,
          maxHeight: 180,
          borderWidth: 1,
          borderColor: '#444',
          overflow: 'hidden',
        }}>
          {users.map((user, index) => (
            <TouchableOpacity
              key={user.email}
              onPress={() => {
                if (!invites.includes(user.email)) {
                  setInvites((prev) => [...prev, user.email]);
                }
                setInput('');
              }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderBottomColor: '#333',
                borderBottomWidth: index !== users.length - 1 ? 1 : 0,
              }}
            >
              <Text style={{ color: 'white' }}>{user.email}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

    </ThemedView>
    
    )
};

export default SearchUserToAddScreen;
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