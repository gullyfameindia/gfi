// app/(main)/navigation/_layout.jsx
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
// Blueprint Color: Primary (#E91E63), Background (#121212) [cite: 101]

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Use Blueprint Colors
        tabBarActiveTintColor: '#E91E63', 
        tabBarStyle: { backgroundColor: '#121212' },
      }}
    >
      <Tabs.Screen
        // 💡 Path updated to screens/index.tsx
        name="screens/index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        // 💡 Path updated to screens/feed.tsx (from original explore.tsx)
        name="screens/feed" 
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={28} color={color} />,
        }}
      />
      {/* The modal screen is not part of the tab bar, so it's not listed here.
        It will be part of the parent Stack (app/layout.tsx).
      */}
    </Tabs>
  );
}

