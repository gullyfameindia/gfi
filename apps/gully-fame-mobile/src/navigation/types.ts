import { NavigationProp, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

// Auth Stack Params
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

// Tab Stack Params
export type TabStackParamList = {
  Home: undefined;
  Reels: undefined;
  Profile: undefined;
};

// App Stack Params
export type AppStackParamList = {
  TabNavigator: undefined;
  CompetitionDetail: { competitionId: string };
  EditProfile: undefined;
  Settings: undefined;
  ReelDetail: { reelId: string };
  Comments: { reelId: string };
  Followers: { userId: string };
  AllCompetitions: undefined;
  Search: undefined;
  VideoEditor: undefined;
  KYC: undefined;
  ChangePassword: undefined;
};

// Root Stack Params
export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
};

// Navigation Props Types
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type TabStackNavigationProp = BottomTabNavigationProp<TabStackParamList>;
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Route Props Types
export type AuthStackRouteProp = RouteProp<AuthStackParamList>;
export type TabStackRouteProp = RouteProp<TabStackParamList>;
export type AppStackRouteProp = RouteProp<AppStackParamList>;
export type RootStackRouteProp = RouteProp<RootStackParamList>;

// Screen Props Types
export interface AuthScreenProps {
  navigation: AuthStackNavigationProp;
  route: RouteProp<AuthStackParamList>;
}

export interface TabScreenProps {
  navigation: TabStackNavigationProp;
  route: RouteProp<TabStackParamList>;
}

export interface AppScreenProps {
  navigation: AppStackNavigationProp;
  route: RouteProp<AppStackParamList>;
}

export interface RootScreenProps {
  navigation: RootStackNavigationProp;
  route: RouteProp<RootStackParamList>;
}
