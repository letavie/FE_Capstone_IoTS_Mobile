import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProfile {
  id: number;
  username: string;
  role: string;
  roleId: number;
  email: string;
  address: string;
  phone: string;
  isActive: number;
}

export default function Profile() {
  const { colors, theme, toggleTheme } = useThemeColors();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const shadowStyle = {
    shadowColor: theme === "light" ? "#000" : "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  // Check login state and fetch user data
  useEffect(() => {
    const checkLoginState = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");
        if (token && userData) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking login state:", error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoginState();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            setLogoutLoading(true);
            try {
              await AsyncStorage.clear();
              setIsLoggedIn(false);
              setUser(null);
            } catch (error) {
              Alert.alert("Error", "Failed to log out. Please try again.");
            } finally {
              setLogoutLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView>
        {/* Header */}
        <View
          className="p-4 flex-row items-center justify-between"
          style={{ backgroundColor: colors.headerBg }}
        >
          <Text className="text-2xl font-bold text-white">My Profile</Text>
          {isLoggedIn && (
            <TouchableOpacity
              className="bg-white rounded-full p-2"
              onPress={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons
                  name="log-out-outline"
                  size={28}
                  color={colors.primary}
                />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* User Info Card */}
        <View
          className="mx-4 mt-6 rounded-2xl p-4"
          style={{ backgroundColor: colors.card, ...shadowStyle }}
        >
          {isLoggedIn ? (
            <>
              <View className="flex-row items-center">
                <Image
                  source={require("../../assets/images/logo3.png")}
                  className="w-20 h-20 rounded-full border-2"
                  style={{ borderColor: colors.textColer }}
                  resizeMode="cover"
                />
                <View className="ml-4 flex-1">
                  <Text
                    className="text-xl font-bold"
                    style={{ color: colors.foreground }}
                  >
                    {user?.username || "Unknown User"}
                  </Text>
                  <Text
                    className="text-sm mt-1"
                    style={{ color: colors.mutedForeground }}
                  >
                    @{user?.username?.split("@")[0] || "unknown"}
                  </Text>
                </View>
              </View>
              <View
                className="mt-4 border-t pt-4"
                style={{ borderColor: colors.border }}
              >
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textColer}
                  />
                  <Text
                    className="ml-3 text-sm"
                    style={{ color: colors.foreground }}
                  >
                    Email: {user?.email || "N/A"}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={colors.textColer}
                  />
                  <Text
                    className="ml-3 text-sm"
                    style={{ color: colors.foreground }}
                  >
                    Phone: {user?.phone || "N/A"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.textColer}
                  />
                  <Text
                    className="ml-3 text-sm"
                    style={{ color: colors.foreground }}
                  >
                    Address: {user?.address || "N/A"}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View className="items-center py-6">
              <Image
                source={require("../../assets/images/logo3.png")}
                className="w-32 h-32 mb-4"
                resizeMode="contain"
              />
              <Text
                className="text-2xl font-bold mb-6"
                style={{ color: colors.foreground }}
              >
                Welcome to IoTS!
              </Text>
              <View className="flex-row justify-center items-center my-8 px-4 max-w-md mx-auto">
                {/* Login Button */}
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center rounded-full py-4 px-6 mx-2 border active:scale-95 transition-all duration-150 ease-in-out"
                  style={{
                    backgroundColor: colors.primary,
                    borderColor: `${colors.primary}30`,
                  }}
                  onPress={() => router.push("/auth/Login")}
                >
                  <Ionicons
                    name="log-in-outline"
                    size={24}
                    color={colors.primaryForeground}
                    className="mr-3"
                  />
                  <Text
                    className="text-lg font-bold tracking-wide"
                    style={{ color: colors.primaryForeground }}
                  >
                    Login
                  </Text>
                </TouchableOpacity>

                {/* Register Button */}
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center rounded-full py-4 px-6 mx-2 border active:scale-95 transition-all duration-150 ease-in-out"
                  style={{
                    backgroundColor: colors.secondary,
                    borderColor: `${colors.secondary}30`,
                  }}
                  onPress={() => router.push("/auth/Register")}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={24}
                    color={colors.secondaryForeground}
                    className="mr-3"
                  />
                  <Text
                    className="text-lg font-bold tracking-wide"
                    style={{ color: colors.secondaryForeground }}
                  >
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Options */}
        <View className="mx-4 mt-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: colors.foreground }}
          >
            Options
          </Text>
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-lg mb-3"
            style={{ backgroundColor: colors.card, ...shadowStyle }}
            onPress={() => router.push("/order/HistoryOrders")}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={colors.textColer} />
            <Text className="ml-4 text-lg" style={{ color: colors.foreground }}>
              My Orders
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.mutedForeground}
              className="ml-auto"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-lg mb-3"
            style={{ backgroundColor: colors.card, ...shadowStyle }}
            // onPress={() => router.push("/warranty/WarrantiesRequest")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={24}
              color={colors.textColer}
            />
            <Text className="ml-4 text-lg" style={{ color: colors.foreground }}>
              Warranties
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.mutedForeground}
              className="ml-auto"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-lg mb-3"
            style={{ backgroundColor: colors.card, ...shadowStyle }}
            // onPress={() => router.push('/Transaction/TransactionHistory')}
            activeOpacity={0.7}
          >
            <Ionicons name="enter-outline" size={24} color={colors.textColer} />
            <Text className="ml-4 text-lg" style={{ color: colors.foreground }}>
              Transaction
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.mutedForeground}
              className="ml-auto"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center p-4 rounded-lg mb-3"
            style={{ backgroundColor: colors.card, ...shadowStyle }}
            // onPress={() => router.push("/profile/Settings")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.textColer}
            />
            <Text className="ml-4 text-lg" style={{ color: colors.foreground }}>
              Settings
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.mutedForeground}
              className="ml-auto"
            />
          </TouchableOpacity>

          {/* Theme Toggle */}
          <View
            className="flex-row items-center p-4 rounded-lg mb-3"
            style={{ backgroundColor: colors.card, ...shadowStyle }}
          >
            <Ionicons
              name={theme === "dark" ? "moon-outline" : "sunny-outline"}
              size={24}
              color={colors.textColer}
            />
            <Text className="ml-4 text-lg" style={{ color: colors.foreground }}>
              Toggle Theme ({theme === "dark" ? "Dark" : "Light"})
            </Text>
            <Switch
              value={theme === "dark"}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor={
                theme === "dark" ? colors.primaryForeground : colors.foreground
              }
              className="ml-auto"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
