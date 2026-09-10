// // src/navigation/AppNavigator.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useAuth } from '../contexts/AuthContext';

// import SplashScreen from '../screens/splashscreen';
// import LoginScreen from '../screens/login';
// import FeedScreen from '../screens/feed';

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {
//   const { token, isLoading } = useAuth();

//   // SplashScreen tab dikhao jab tak token check ho raha ho
//   if (isLoading) return <SplashScreen />;

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {token ? (
//           // ✅ Logged in → Feed
//           <Stack.Screen name="Feed" component={FeedScreen} />
//         ) : (
//           // ❌ Not logged in → Login
//           <Stack.Screen name="Login" component={LoginScreen} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// kiro code

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";

// Screens
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import FeedScreen from "../screens/FeedScreen";
import ReelsScreen from "../screens/ReelsScreen";
import ProfileScreen from "../screens/ProfileScreen";
// ✅ ADDED: New screens for home, settings, edit profile, and competition details
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import CompetitionDetailScreen from "../screens/CompetitionDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack (Login & Register & Settings)
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: "pop",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          animationTypeForReplace: "pop",
        }}
      />
      {/* ✅ ADDED: EditProfile screen for auth stack */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerShown: true,
          animationTypeForReplace: "pop",
        }}
      />
      {/* ✅ ADDED: Settings screen for auth stack */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerShown: true,
          animationTypeForReplace: "pop",
        }}
      />
    </Stack.Navigator>
  );
}

// ✅ ADDED: Tab Navigator for bottom tabs (Home, Reels, Profile)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "#007AFF",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reels") {
            iconName = focused ? "play-circle" : "play-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* ✅ CHANGED: Home tab now uses HomeScreen instead of FeedScreen */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Reels"
        component={ReelsScreen}
        options={{
          title: "Reels",
          tabBarLabel: "Reels",
        }}
      />
      {/* ✅ CHANGED: Profile tab now uses ProfileScreen instead of FeedScreen */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

// ✅ UPDATED: App Stack now includes nested navigation for detail screens
function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationTypeForReplace: "pop",
      }}
    >
      {/* Main tab navigator */}
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          animationTypeForReplace: "pop",
        }}
      />
      {/* ✅ ADDED: Competition detail screen */}
      <Stack.Screen
        name="CompetitionDetail"
        component={CompetitionDetailScreen}
        options={{
          title: "Competition",
          headerShown: true,
          animationTypeForReplace: "pop",
        }}
      />
      {/* ✅ ADDED: Edit profile screen for app stack */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
          headerShown: true,
          animationTypeForReplace: "pop",
        }}
      />
      {/* ✅ ADDED: Settings screen for app stack */}
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          headerShown: true,
          animationTypeForReplace: "pop",
        }}
      />
    </Stack.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  const { token, isLoading } = useAuth();

  // Show splash screen while checking authentication
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // animationEnabled: true,  // ❌ YE REMOVE KARO
          animationTypeForReplace: "pop", // ✅ YE LIKHO
        }}
      >
        {token ? (
          // ✅ Logged in → App Stack (Tab Navigation)
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{
              //  animationEnabled: false,  // ❌ YE REMOVE KARO
              animationTypeForReplace: "pop", // ✅ YE LIKHO
            }}
          />
        ) : (
          // ❌ Not logged in → Auth Stack (Login & Register)
          // ✅ UPDATED: AuthStack now includes EditProfile and Settings screens
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{
              animationTypeForReplace: "pop",
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
