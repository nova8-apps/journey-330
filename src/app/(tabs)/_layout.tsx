import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, TrendingUp, ListChecks, User } from 'lucide-react-native';

const isWeb = Platform.OS === 'web';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: 'bottom',
        tabBarStyle: {
          backgroundColor: '#111118',
          borderTopColor: 'rgba(255,255,255,0.06)',
          borderTopWidth: 1,
          height: isWeb ? 72 : 84,
          paddingBottom: isWeb ? 0 : 28,
          paddingTop: isWeb ? 0 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          lineHeight: 14,
          fontFamily: 'Inter_600SemiBold',
          marginTop: 2,
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#55556a',
        sceneStyle: { flex: 1, backgroundColor: '#0a0a0f' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => <ListChecks size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
