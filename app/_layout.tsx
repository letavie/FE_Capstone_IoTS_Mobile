// // import { Stack, useRouter } from 'expo-router';
// // import { useEffect } from 'react';
// // import Toast from 'react-native-toast-message';
// // import '../global.css';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { toastConfig } from '../components/CustomToast';
// // import 'react-native-gesture-handler';
// // export default function RootLayout() {
// //   const router = useRouter();

// //   // useEffect(() => {
// //   //   // Redirect to the Welcome screen on app load
// //   //   router.replace('/auth/Welcome');
// //   // }, []);
// //   useEffect(() => {
// //     const checkToken = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('token');
// //         if (token) {
// //           router.replace('/(tabs)/Home');
// //         } else {
// //           router.replace('/auth/Welcome');
// //         }
// //       } catch (error) {
// //         console.error('Error checking token:', error);
// //         router.replace('/auth/Welcome');
// //       }
// //     };

// //     checkToken();
// //   }, []);

// //   return (
// //     <>
// //       <Stack screenOptions={{ headerShown: false }}>
// //         <Stack.Screen name="auth" />
// //         <Stack.Screen name="(tabs)" />
// //         <Stack.Screen name="cart" options={{ headerShown: false }} />
// //         <Stack.Screen name="device"  />
// //       </Stack>
// //       <Toast config={toastConfig} />
// //     </>
// //   );
// // }

// import { Stack, useRouter } from 'expo-router';
// import { useEffect } from 'react';
// import Toast from 'react-native-toast-message';
// import '../global.css';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { toastConfig } from '../components/CustomToast';
// import 'react-native-gesture-handler';
// import notifee, { EventType } from '@notifee/react-native';
// import { Platform, LogBox } from 'react-native';
// export default function RootLayout() {
//   const router = useRouter();

//   useEffect(() => {
//     // Request notification permissions
//     async function setupNotifications() {
//       try {
//         await notifee.requestPermission();
//         if (Platform.OS === 'android') {
//           await notifee.createChannel({
//             id: 'default',
//             name: 'Default Channel',
//           });
//         }
//       } catch (err: any) {
//         console.error('Notification setup failed:', err.message);
//       }
//     }

//     // Handle foreground notification taps
//     const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         router.push('/(tabs)/Notifications');
//       }
//     });

//     // Handle background notification taps
//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         // Note: Navigation in background is limited; rely on foreground navigation
//         console.log('Notification tapped in background:', detail.notification);
//       }
//     });

//     setupNotifications();

//     // Ignore Notifee logs in development
//     LogBox.ignoreLogs(['NotifeeCore']);

//     return () => {
//       unsubscribeForeground();
//     };
//   }, [router]);

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         if (token) {
//           router.replace('/auth/Welcome');
//         } else {
//           router.replace('/auth/Welcome');
//         }
//       } catch (error) {
//         console.error('Error checking token:', error);
//         router.replace('/auth/Welcome');
//       }
//     };

//     checkToken();
//   }, [router]);

//   return (
//     <>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="auth" />
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="cart" options={{ headerShown: false }} />
//         <Stack.Screen name="device" />
//         <Stack.Screen name="order" options={{ headerShown: false }} />
//         {/* <Stack.Screen name="notifications" options={{ headerShown: false }} /> */}
//       </Stack>
//       <Toast config={toastConfig} />
//     </>
//   );
// }

import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastConfig } from "../components/CustomToast";
import "react-native-gesture-handler";
import notifee, { EventType } from "@notifee/react-native";
import { Platform, LogBox } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Request notification permissions
    async function setupNotifications() {
      try {
        await notifee.requestPermission();
        if (Platform.OS === "android") {
          await notifee.createChannel({
            id: "default",
            name: "Default Channel",
          });
        }
      } catch (err: any) {
        console.error("Notification setup failed:", err.message);
      }
    }

    // Handle foreground notification taps
    const unsubscribeForeground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        if (type === EventType.PRESS) {
          router.push("/(tabs)/Notifications");
        }
      }
    );

    // Handle background notification taps
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        // Note: Navigation in background is limited; rely on foreground navigation
        console.log("Notification tapped in background:", detail.notification);
      }
    });

    setupNotifications();

    // Ignore Notifee logs in development
    LogBox.ignoreLogs(["NotifeeCore"]);

    return () => {
      unsubscribeForeground();
    };
  }, [router]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.replace("/auth/Welcome");
        } else {
          router.replace("/auth/Welcome");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        router.replace("/auth/Welcome");
      }
    };

    checkToken();
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="device" />
        <Stack.Screen name="order" options={{ headerShown: false }} />
        {/* <Stack.Screen name="notifications" options={{ headerShown: false }} /> */}
      </Stack>
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
