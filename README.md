# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run the App**:
   - **Using Expo Go**:
     ```bash
     npm start
     ```
     Scan the QR code displayed in the terminal or Expo DevTools using the **Expo Go** app on your mobile device.
   - **Using Development Build**:
     ```bash
     npx expo start
     ```
     Follow the prompts to open the app in an [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/), [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or a custom development build.
3. **Test Deeplink**:
   - Use a Deeplink URL (e.g., `myapp://home`) to navigate to a specific screen in the app.
   - Ensure the Deeplink scheme is configured in `app.json` (e.g., `"scheme": "myapp"`).

## Project Structure

- The project uses [file-based routing](https://docs.expo.dev/router/introduction/) with **Expo Router**. Edit files in the `app/` directory to modify the app's navigation and screens.

## Prerequisites

- **Visual Studio Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/download).
- **Node.js** (includes npm): Download from [nodejs.org](https://nodejs.org/en/download/).
- **Expo CLI**: Install globally with `npm install -g expo-cli`.
- **Expo Go**: Install on your mobile device from the iOS App Store or Google Play Store.

## Troubleshooting

- **Expo Go not connecting**: Ensure your mobile device and computer are on the same Wi-Fi network. Restart the server with `npm start --clear`.
- **Deeplink not working**: Verify the `"scheme"` field in `app.json` and test with a valid URL (e.g., `myapp://home`).
- **Dependency issues**: Delete `node_modules` and `package-lock.json`, then run `npm install` again.

## Learn More

- [Expo Documentation](https://docs.expo.dev/): Explore fundamentals and advanced guides.
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/): Learn about file-based routing.
- [React Native Documentation](https://reactnative.dev/docs/getting-started): Understand React Native basics.
- [Expo Tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step guide to build a cross-platform app.

## Join the Community

- [Expo on GitHub](https://github.com/expo/expo): View the open-source platform and contribute.
- [Expo Discord](https://chat.expo.dev): Connect with other Expo developers.
