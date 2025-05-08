// import { Stack, useRouter } from "expo-router";
// import { useEffect } from "react";
// import Toast from "react-native-toast-message";
// import "../global.css";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { toastConfig } from "../components/CustomToast";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import * as Linking from "expo-linking";
// import { Provider as PaperProvider } from "react-native-paper";

// const queryClient = new QueryClient();

// export default function RootLayout() {
//   const router = useRouter();

//   // Hiển thị thông báo chào mừng nếu có token hợp lệ
//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           Toast.show({
//             type: "info",
//             text1: "Chào mừng",
//             text2: "Ứng dụng đã sẵn sàng",
//             visibilityTime: 4000,
//           });

//           // Chuyển trang sau khi Toast hiển thị xong
//           setTimeout(() => {
//             router.push("/(tabs)/Home");
//           }, 4000);
//         } else {
//           router.replace("/auth/Welcome");
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

//   useEffect(() => {
//     const handleDeepLink = async (event: Linking.EventType) => {
//       const url = event.url;
//       const parsed = Linking.parse(url);

//       if (parsed.path === "home") {
//         router.push("/(tabs)/Home");
//       } else if (parsed.path === "checkout/result") {
//         router.push("/Checkout/CheckProcessOrder");
//       }
//     };

//     // Xử lý deep link khi app mở từ trạng thái đóng
//     Linking.getInitialURL().then((url) => {
//       if (url) handleDeepLink({ url } as Linking.EventType);
//     });

//     // Lắng nghe deep link khi app đang chạy
//     const subscription = Linking.addEventListener("url", handleDeepLink);

//     return () => {
//       subscription.remove();
//     };
//   }, [router]);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <PaperProvider>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="auth" />
//           <Stack.Screen name="(tabs)" />
//           <Stack.Screen name="cart" options={{ headerShown: false }} />
//           <Stack.Screen name="device" options={{ headerShown: false }} />
//           <Stack.Screen name="order" options={{ headerShown: false }} />
//           <Stack.Screen name="Checkout" options={{ headerShown: false }} />
//           <Stack.Screen name="store" options={{ headerShown: false }} />
//         </Stack>
//         <Toast config={toastConfig} />
//       </PaperProvider>
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
import { Provider as PaperProvider } from "react-native-paper";

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
            text1: "Welcome",
            text2: "Application is now ready",
            visibilityTime: 4000,
          });

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

  // useEffect(() => {
  //   // const handleDeepLink = async (event: Linking.EventType) => {
  //   //   const url = event.url;
  //   //   const parsed = Linking.parse(url);

  //   //   // Loại bỏ dấu "/" đầu nếu có
  //   //   const path = parsed.path ? parsed.path.replace(/^\/+/, "") : "";

  //   //   if (path === "home") {
  //   //     router.push("/(tabs)/Home");
  //   //   } else if (path === "checkout/result") {
  //   //     router.push("/Checkout/CheckProcessOrder");
  //   //   } else {
  //   //     console.warn("Deep link path not recognized:", path);
  //   //   }
  //   // };
  //   const handleDeepLink = async (event: Linking.EventType) => {
  //     const url = event.url;
  //     const parsed = Linking.parse(url);
  //     const path = parsed.path ? parsed.path.replace(/^\/+/, "") : "";
  //     console.log("Deep link URL:", url);
  //     console.log("Parsed path:", path);

  //     if (path === "home") {
  //       console.log("Navigating to /(tabs)/Home");
  //       router.push("/(tabs)/Home");
  //     } else if (path === "checkout/result") {
  //       console.log("Navigating to /Checkout/CheckProcessOrder");
  //       router.push("/Checkout/CheckProcessOrder");
  //     } else {
  //       console.warn("Deep link path not recognized:", path);
  //     }
  //   };
  //   // Xử lý deep link khi app mở từ trạng thái đóng
  //   Linking.getInitialURL().then((url) => {
  //     if (url) handleDeepLink({ url } as Linking.EventType);
  //   });

  //   // Lắng nghe deep link khi app đang chạy
  //   const subscription = Linking.addEventListener("url", handleDeepLink);

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [router]);
  useEffect(() => {
    const handleDeepLink = async (event: Linking.EventType) => {
      const url = event.url;
      console.log("Deep link URL:", url);

      // Parse URL thủ công nếu Linking.parse không hoạt động đúng
      let path = "";
      if (url) {
        const urlParts = url.split("://");
        if (urlParts.length > 1) {
          path = urlParts[1].replace(/^\/+/, ""); // Lấy phần sau scheme và loại bỏ / đầu
        }
      }

      console.log("Parsed path:", path);

      if (path === "home") {
        console.log("Navigating to /(tabs)/Home");
        router.push("/(tabs)/Home");
      } else if (path === "checkout/result") {
        console.log("Navigating to /Checkout/CheckProcessOrder");
        router.push("/Checkout/CheckProcessOrder");
      } else {
        console.warn("Deep link path not recognized:", path);
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url } as Linking.EventType);
    });

    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [router]);
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
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
      </PaperProvider>
    </QueryClientProvider>
  );
}
