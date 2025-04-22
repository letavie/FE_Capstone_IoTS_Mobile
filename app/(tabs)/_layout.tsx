
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from './Home';
import Blog from './Blog';
import Notifications from './Notifications';
import Profile from './Profile';
const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Blog') iconName = 'book';
          else if (route.name === 'Notifications') iconName = 'notifications';
          else iconName = 'person';
          return <Ionicons  name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF', 
        tabBarInactiveTintColor: 'gray',  
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Blog" component={Blog} />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// import { useState, useEffect, useCallback } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';
// import { useThemeColors } from '@/hooks/useThemeColors';
// import { countUnreadNotifications } from '@/services/slices/notificationApi';
// import Toast from 'react-native-toast-message';
// import Home from './Home';
// import Blog from './Blog';
// import Notifications from './Notifications';
// import Profile from './Profile';

// const Tab = createBottomTabNavigator();

// export default function TabLayout() {
//   const { colors } = useThemeColors();
//   const [unreadCount, setUnreadCount] = useState(0);

//   // Fetch unread notifications count
//   const fetchUnreadCount = useCallback(async () => {
//     try {
//       const response = await countUnreadNotifications();
//       setUnreadCount(response.data || 0);
//     } catch (err: any) {
//       showToast('error', 'Error', err.message || 'Failed to load unread count.');
//     }
//   }, []);

//   // Initial fetch and polling
//   useEffect(() => {
//     fetchUnreadCount();
//     const interval = setInterval(fetchUnreadCount, 30000); 
//     return () => clearInterval(interval);
//   }, [fetchUnreadCount]);

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName: keyof typeof Ionicons.glyphMap;
//           if (route.name === 'Home') iconName = 'home';
//           else if (route.name === 'Blog') iconName = 'book';
//           else if (route.name === 'Notifications') iconName = 'notifications';
//           else iconName = 'person';
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: colors.primary, 
//         tabBarInactiveTintColor: colors.mutedForeground,
//         tabBarBadgeStyle: {
//           backgroundColor: colors.destructive, 
//           color: '#fff',
//           fontSize: 10,
//           minWidth: 16,
//           height: 16,
//           borderRadius: 8,
//           paddingHorizontal: 2,
//         },
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={Home} />
//       <Tab.Screen name="Blog" component={Blog} />
//       <Tab.Screen
//         name="Notifications"
//         component={Notifications}
//         options={{
//           tabBarBadge: unreadCount > 0 ? (unreadCount > 99 ? '99+' : unreadCount) : undefined,
//         }}
//       />
//       <Tab.Screen name="Profile" component={Profile} />
//     </Tab.Navigator>
//   );
// }

// // Toast utility (same as in Home.tsx and Notifications.tsx)
// const showToast = (type: string, title: string, message: string) => {
//   Toast.show({
//     type,
//     text1: title,
//     text2: message,
//     position: 'top',
//     visibilityTime: 4000,
//   });
// };