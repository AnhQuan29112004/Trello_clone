import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Profile: { name: string };
  Register: undefined;
  Workspace: { name: string };
  MainStack: { screen?: string };
  Settings: undefined;
  CreateBoard: undefined;
  Board: { boardId: number };
  CardDetail: { cardId: number },
  SearchWorkspace: { workspaceId: number };
  MemberWorkspace: { workspaceId: number , name: string };
  AddMember:{user:any,workspaceId: number};
  SearchUserToAdd: { workspaceId: number };
  UpdateWorkspace: { workspaceId: number };
};

export type BaseResponse<T> = {
  message: string;
  status: number;
  code: string;
  data: T;
}

export type BaseListResponse<T> = {
  message: string;
  status: number;
  code: string;
  data: Array<T>;
}

// Navigation Prop type
export type RootNavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

// Route Prop type (optional but useful)
export type RootRouteProp<T extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, T>;
