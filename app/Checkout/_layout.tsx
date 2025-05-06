// import { Stack } from "expo-router";
// import { Linking } from "react-native";
// import { useEffect } from "react";

// const prefix = "fe-capstone-iots-mobile://";

// export default function CheckoutLayout() {
//   useEffect(() => {
//     const handleDeepLink = (event: { url: string }) => {
//       const route = event.url.replace(prefix, "");
//       // Xử lý route nếu cần
//       console.log("Deep link received:", route);
//     };

//     Linking.addEventListener("url", handleDeepLink);

//     // Kiểm tra khi app mở lần đầu
//     Linking.getInitialURL().then((url) => {
//       if (url) {
//         handleDeepLink({ url });
//       }
//     });

//     return () => {
//       Linking.removeEventListener("url", handleDeepLink);
//     };
//   }, []);

//   return (
//     <Stack>
//       <Stack.Screen name="Checkout" options={{ title: "Thanh toán" }} />
//       <Stack.Screen
//         name="CheckProcessOrder"
//         options={{ title: "Xác nhận đơn hàng" }}
//       />
//     </Stack>
//   );
// }
import { Stack } from "expo-router";
import { Linking } from "react-native";
import { useEffect } from "react";

const prefix = "fe-capstone-iots-mobile://";

export default function CheckoutLayout() {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const route = event.url.replace(prefix, "");
      console.log("Deep link received:", route);
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Stack>
      <Stack.Screen name="Checkout" options={{ title: "Thanh toán" }} />
      <Stack.Screen
        name="CheckProcessOrder"
        options={{ title: "Xác nhận đơn hàng" }}
      />
    </Stack>
  );
}
