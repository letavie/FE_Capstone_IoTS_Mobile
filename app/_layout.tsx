// import { Stack, useRouter } from "expo-router";
// import { useEffect } from "react";
// import Toast from "react-native-toast-message";
// import "../global.css";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { toastConfig } from "../components/CustomToast";
// import { Platform } from "react-native";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const router = useRouter();

//   useEffect(() => {
//     // Request notification permissions
//     async function setupNotifications() {
//       try {
//         await notifee.requestPermission();
//         if (Platform.OS === "android") {
//           await notifee.createChannel({
//             id: "default",
//             name: "Default Channel",
//           });
//         }
//       } catch (err: any) {
//         console.error("Notification setup failed:", err.message);
//       }
//     }

//     // Handle foreground notification taps
//     const unsubscribeForeground = notifee.onForegroundEvent(
//       ({ type, detail }) => {
//         if (type === EventType.PRESS) {
//           router.push("/(tabs)/Notifications");
//         }
//       }
//     );

//     // Handle background notification taps
//     notifee.onBackgroundEvent(async ({ type, detail }) => {
//       if (type === EventType.PRESS) {
//         // Note: Navigation in background is limited; rely on foreground navigation
//         console.log("Notification tapped in background:", detail.notification);
//       }
//     });

//     setupNotifications();

//     // Ignore Notifee logs in development
//     LogBox.ignoreLogs(["NotifeeCore"]);

//     return () => {
//       unsubscribeForeground();
//     };
//   }, [router]);

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           router.replace("/auth/Welcome");
//         } else {
//           router.replace("/auth/Welcome");
//         }
//       } catch (error) {
//         console.error("Error checking token:", error);
//         router.replace("/auth/Welcome");
//       }
//     };

//     checkToken();
//   }, [router]);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="auth" />
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="cart" options={{ headerShown: false }} />
//         <Stack.Screen name="device" />
//         <Stack.Screen name="order" options={{ headerShown: false }} />
//         {/* <Stack.Screen name="notifications" options={{ headerShown: false }} /> */}
//       </Stack>
//       <Toast config={toastConfig} />
//     </QueryClientProvider>
//   );
// }
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastConfig } from "../components/CustomToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Linking from "expo-linking";

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();

  // Hiển thị thông báo chào mừng
  useEffect(() => {
    const showWelcomeNotification = () => {
      Toast.show({
        type: "info",
        text1: "Chào mừng",
        text2: "Ứng dụng đã sẵn sàng",
        onPress: () => router.push("/(tabs)/Home"), // Chỉ push sau khi token OK
        visibilityTime: 4000,
      });
    };

    // Kiểm tra và chỉ gọi showWelcomeNotification nếu có token hợp lệ
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          showWelcomeNotification(); // Chỉ show khi có token hợp lệ
        } else {
          router.replace("/auth/Welcome"); // Điều hướng tới trang Welcome nếu không có token
        }
      } catch (error) {
        console.error("Error checking token:", error);
        router.replace("/auth/Welcome");
      }
    };

    checkToken();

    return () => {
      Toast.hide();
    };
  }, [router]);

  // BẮT DEEP LINK KHI APP ĐANG CHẠY
  useEffect(() => {
    const handleDeepLink = (event: Linking.EventType) => {
      const url = event.url;
      console.log("Received deep link:", url);

      const parsed = Linking.parse(url);
      console.log("Parsed deep link:", parsed);

      // Điều hướng đến /Home nếu là fe-capstone-iots-mobile://home
      if (parsed.path === "home") {
        // Sử dụng parsed.path thay vì parsed.host
        router.push("/(tabs)/Home");
      }

      // Bạn có thể mở rộng thêm các host/path khác nếu cần
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="device" />
        <Stack.Screen name="order" options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
