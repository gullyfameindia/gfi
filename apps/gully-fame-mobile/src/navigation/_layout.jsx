
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        
        tabBarActiveTintColor: '#E91E63', 
        tabBarStyle: { backgroundColor: '#121212' },
      }}
    >
      <Tabs.Screen
        
        name="screens/index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        
        name="screens/feed" 
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={28} color={color} />,
        }}
      />
      {

}
    </Tabs>
  );
}

