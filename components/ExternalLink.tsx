// import { Link } from 'expo-router';
// import { openBrowserAsync } from 'expo-web-browser';
// import { type ComponentProps } from 'react';
// import { Platform } from 'react-native';

// type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

// export function ExternalLink({ href, ...rest }: Props) {
//   return (
//     <Link
//       target="_blank"
//       {...rest}
//       href={href}
//       onPress={async (event) => {
//         if (Platform.OS !== 'web') {
//           // Prevent the default behavior of linking to the default browser on native.
//           event.preventDefault();
//           // Open the link in an in-app browser.
//           await openBrowserAsync(href);
//         }
//       }}
//     />
//   );
// }
import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";

// Định nghĩa kiểu cho URL bên ngoài
type ExternalUrl = `http://${string}` | `https://${string}`;

// Giới hạn href chỉ nhận URL http:// hoặc https://
type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: ExternalUrl };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          // Ngăn hành vi mặc định trên native
          event.preventDefault();
          // Mở liên kết trong trình duyệt in-app
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
