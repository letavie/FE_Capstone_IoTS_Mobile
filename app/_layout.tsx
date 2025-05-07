// import { Stack, useRouter } from "expo-router";
// import { useEffect } from "react";
// import Toast from "react-native-toast-message";
// import "../global.css";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { toastConfig } from "../components/CustomToast";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import * as Linking from "expo-linking";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const router = useRouter();

//   // Hiển thị thông báo chào mừng
//   useEffect(() => {
//     const showWelcomeNotification = () => {
//       Toast.show({
//         type: "info",
//         text1: "Chào mừng",
//         text2: "Ứng dụng đã sẵn sàng",
//         onPress: () => router.push("/(tabs)/Home"), // Chỉ push sau khi token OK
//         visibilityTime: 4000,
//       });
//     };

//     // Kiểm tra và chỉ gọi showWelcomeNotification nếu có token hợp lệ
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           showWelcomeNotification(); // Chỉ show khi có token hợp lệ
//         } else {
//           router.replace("/auth/Welcome"); // Điều hướng tới trang Welcome nếu không có token
//         }
//       } catch (error) {
//         console.error("Error checking token:", error);
//         router.replace("/auth/Welcome");
//       }
//     };

//     checkToken();

//     return () => {
//       Toast.hide();
//     };
//   }, [router]);

//   // BẮT DEEP LINK KHI APP ĐANG CHẠY
//   useEffect(() => {
//     const handleDeepLink = (event: Linking.EventType) => {
//       const url = event.url;

//       const parsed = Linking.parse(url);

//       if (parsed.path === "home") {
//         router.push("/(tabs)/Home");
//       }
//     };

//     const subscription = Linking.addEventListener("url", handleDeepLink);

//     return () => {
//       subscription.remove();
//     };
//   }, [router]);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="auth" />
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="cart" options={{ headerShown: false }} />
//         <Stack.Screen name="device" options={{ headerShown: false }} />
//         <Stack.Screen name="order" options={{ headerShown: false }} />
//         <Stack.Screen name="Checkout" options={{ headerShown: false }} />
//         <Stack.Screen name="store" options={{ headerShown: false }} />
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

  // Hiển thị thông báo chào mừng nếu có token hợp lệ
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          Toast.show({
            type: "info",
            text1: "Chào mừng",
            text2: "Ứng dụng đã sẵn sàng",
            visibilityTime: 4000,
          });

          // Chuyển trang sau khi Toast hiển thị xong
          setTimeout(() => {
            router.push("/(tabs)/Home");
          }, 4000);
        } else {
          router.replace("/auth/Welcome");
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
  // useEffect(() => {
  //   const handleDeepLink = (event: Linking.EventType) => {
  //     const url = event.url;
  //     const parsed = Linking.parse(url);

  //     // Điều hướng nếu deep link path khớp
  //     if (parsed.path === "home") {
  //       router.push("/(tabs)/Home");
  //     }

  //     // Mở rộng nếu có các deep link khác
  //     if (parsed.path === "checkout/result") {
  //       router.push("/Checkout/CheckProcessOrder");
  //     }
  //   };

  //   const subscription = Linking.addEventListener("url", handleDeepLink);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [router]);
  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const url = event.url;
      const parsed = Linking.parse(url);

      if (parsed.path === "home") {
        router.push("/(tabs)/Home");
      } else if (parsed.path === "checkout/result") {
        router.push("/Checkout/CheckProcessOrder");
      }
    };

    // Xử lý deep link khi app mở từ trạng thái đóng
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url } as Linking.EventType);
    });

    // Lắng nghe deep link khi app đang chạy
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
        <Stack.Screen name="device" options={{ headerShown: false }} />
        <Stack.Screen name="order" options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" options={{ headerShown: false }} />
        <Stack.Screen name="store" options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig} />
    </QueryClientProvider>
  );
}
