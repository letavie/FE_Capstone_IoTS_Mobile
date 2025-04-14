// import { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Pressable,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useThemeColors } from '../../hooks/useThemeColors';
// import { login } from '../../services/api/authApi';
// import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from 'react-native-heroicons/outline';

// export default function Login() {
//   const { colors } = useThemeColors();
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleLogin = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await login({ email, password });
//       router.replace('/(tabs)/Home');
//     } catch (error: any) {
//       if (error.message === 'Token expired. Please log in again.') {
//         router.replace('/auth/Login');
//       } else {
//         setError(error.message || 'Invalid email or password');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View
//       className="flex-1 p-6 justify-center"
//       style={{ backgroundColor: colors.background }}
//     >
//       {/* Logo */}
//       <View className="items-center mb-8">
//         <Image
//           source={require('../../assets/images/logo3.png')}
//           style={{ width: 120, height: 120 }}
//           resizeMode="contain"
//         />
//       </View>

//       {/* Title */}
//       <Text
//         className="text-3xl font-bold mb-6 text-center"
//         style={{ color: colors.foreground }}
//       >
//         Welcome Back
//       </Text>

//       {/* Form Container */}
//       <View
//         className="bg-card p-6 rounded-2xl shadow-lg"
//         style={{ backgroundColor: colors.card }}
//       >
//         {/* Email Field */}
//         <View className="mb-4">
//           <Text
//             className="text-sm font-medium mb-1"
//             style={{ color: colors.foreground }}
//           >
//             Email
//           </Text>
//           <View
//             className="flex-row items-center border rounded-lg p-3"
//             style={{
//               borderColor: colors.border,
//               backgroundColor: colors.input,
//             }}
//           >
//             <EnvelopeIcon size={20} color={colors.mutedForeground} />
//             <TextInput
//               className="flex-1 ml-2"
//               placeholder="Enter your email"
//               placeholderTextColor={colors.mutedForeground}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               style={{ color: colors.foreground }}
//             />
//           </View>
//         </View>

//         {/* Password Field */}
//         <View className="mb-4">
//           <Text
//             className="text-sm font-medium mb-1"
//             style={{ color: colors.foreground }}
//           >
//             Password
//           </Text>
//           <View
//             className="flex-row items-center border rounded-lg p-3"
//             style={{
//               borderColor: colors.border,
//               backgroundColor: colors.input,
//             }}
//           >
//             <TextInput
//               className="flex-1"
//               placeholder="Enter your password"
//               placeholderTextColor={colors.mutedForeground}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               style={{ color: colors.foreground }}
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               {showPassword ? (
//                 <EyeSlashIcon size={20} color={colors.mutedForeground} />
//               ) : (
//                 <EyeIcon size={20} color={colors.mutedForeground} />
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Error Message */}
//         {error && (
//           <Text
//             className="text-sm mb-4 text-center"
//             style={{ color: colors.destructive }}
//           >
//             {error}
//           </Text>
//         )}


//         {/* Login Button */}
//         <TouchableOpacity
//           className="rounded-lg p-4 items-center flex-row justify-center"
//           style={{ backgroundColor: colors.primary }}
//           onPress={handleLogin}
//           disabled={loading}
//           activeOpacity={0.8}
//         >
//           {loading ? (
//             <ActivityIndicator size="small" color={colors.primaryForeground} />
//           ) : (
//             <Text
//               className="text-white font-semibold"
//               style={{ color: colors.primaryForeground }}
//             >
//               Login
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Register Link */}
//       <View className="mt-6 flex-row justify-center">
//         <Text
//           className="text-sm"
//           style={{ color: colors.mutedForeground }}
//         >
//           Don't have an account?{' '}
//         </Text>
//         <TouchableOpacity onPress={() => router.push('/auth/Register')}>
//           <Text
//             className="text-sm font-semibold"
//             style={{ color: colors.primary }}
//           >
//             Register
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';
import { login } from '../../services/api/authApi';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon } from 'react-native-heroicons/outline';
import Toast from 'react-native-toast-message';

// Function to show toast notification (inspired by the website's showNotification)
const showToast = (type: 'success' | 'error' | 'info', message: string, description?: string) => {
  Toast.show({
    type: type,
    text1: message,
    text2: description || '',
    position: 'top',
    visibilityTime: 3000, // 3 seconds, matching the website's duration
    topOffset: 50, // Matching the website's top: 50px
    text1Style: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333333', // Matching the website's color: #333333
    },
    text2Style: {
      fontSize: 14,
      color: '#333333',
    },
  });
};

export default function Login() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login({ email, password });
      showToast('success', 'Login Successful', 'Welcome back!');
      router.replace('/(tabs)/Home');
    } catch (error: unknown) {
      const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred';
      if (errorMessage === 'Token expired. Please log in again.') {
        showToast('error', 'Session Expired', 'Please log in again.');
        router.replace('/auth/Login');
      } else {
        showToast('error', 'Login Failed', errorMessage || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="flex-1 p-6 justify-center"
      style={{ backgroundColor: colors.background }}
    >
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/images/logo3.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text
        className="text-3xl font-bold mb-6 text-center"
        style={{ color: colors.foreground }}
      >
        Welcome Back
      </Text>

      {/* Form Container */}
      <View
        className="bg-card p-6 rounded-2xl shadow-lg"
        style={{ backgroundColor: colors.card }}
      >
        {/* Email Field */}
        <View className="mb-4">
          <Text
            className="text-sm font-medium mb-1"
            style={{ color: colors.foreground }}
          >
            Email
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.input,
            }}
          >
            <EnvelopeIcon size={20} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your email"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{ color: colors.foreground }}
            />
          </View>
        </View>

        {/* Password Field */}
        <View className="mb-4">
          <Text
            className="text-sm font-medium mb-1"
            style={{ color: colors.foreground }}
          >
            Password
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.input,
            }}
          >
            <TextInput
              className="flex-1"
              placeholder="Enter your password"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{ color: colors.foreground }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeSlashIcon size={20} color={colors.mutedForeground} />
              ) : (
                <EyeIcon size={20} color={colors.mutedForeground} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="rounded-lg p-4 items-center flex-row justify-center"
          style={{ backgroundColor: colors.primary }}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Text
              className="text-white font-semibold"
              style={{ color: colors.primaryForeground }}
            >
              Login
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <View className="mt-6 flex-row justify-center">
        <Text
          className="text-sm"
          style={{ color: colors.mutedForeground }}
        >
          Don't have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/auth/Register')}>
          <Text
            className="text-sm font-semibold"
            style={{ color: colors.primary }}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}