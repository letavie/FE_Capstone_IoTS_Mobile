import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { colors, theme, toggleTheme } = useThemeColors();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => router.push('/auth/Login'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bgColer }}>
      {/* Header */}
      <View style={{ backgroundColor: colors.headerBg, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Mainfont', fontWeight: 'bold', color: '#fff' }}>My Profile</Text>
        <TouchableOpacity onPress={handleLogout}  className="bg-white rounded-full p-2">
          <Ionicons  name="log-out-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* User Info Card */}
      <View style={{ marginHorizontal: 16, marginTop: 24, backgroundColor: colors.mainColer, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../assets/images/logo3.png')}
            style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.textColer }}
            resizeMode="cover"
          />
          <View style={{ marginLeft: 16, flex: 1 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Mainfont', fontWeight: 'bold', color: colors.foreground }}>Nguyen Cuong Thinh</Text>
            <Text style={{ fontSize: 14, fontFamily: 'Mainfont', color: colors.mutedForeground, marginTop: 4 }}>@thinhncse</Text>
          </View>
        </View>
        <View style={{ marginTop: 16, borderTopWidth: 1, borderColor: colors.border, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="mail-outline" size={20} color={colors.textColer} />
            <Text style={{ marginLeft: 12, fontSize: 14, fontFamily: 'Mainfont', color: colors.foreground }}>Email: thinhnc@gmail.com</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="call-outline" size={20} color={colors.textColer} />
            <Text style={{ marginLeft: 12, fontSize: 14, fontFamily: 'Mainfont', color: colors.foreground }}>Phone: +1234567890</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-outline" size={20} color={colors.textColer} />
            <Text style={{ marginLeft: 12, fontSize: 14, fontFamily: 'Mainfont', color: colors.foreground }}>Address: 789 Cu Chi, HCM City</Text>
          </View>
        </View>
      </View>

      {/* Options */}
      <View style={{ marginHorizontal: 16, marginTop: 24 }}>
        <Text style={{ fontSize: 18, fontFamily: 'Mainfont', fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>Options</Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mainColer, padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
          onPress={() => router.push('/order/OrderHistory')}
          activeOpacity={0.7}
        >
          <Ionicons name="cart-outline" size={24} color={colors.textColer} />
          <Text style={{ marginLeft: 16, fontSize: 18, fontFamily: 'Mainfont', color: colors.foreground }}>My Orders</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mainColer, padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
          onPress={() => router.push('/warranty/WarrantiesRequest')}
          activeOpacity={0.7}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color={colors.textColer} />
          <Text style={{ marginLeft: 16, fontSize: 18, fontFamily: 'Mainfont', color: colors.foreground }}>Warranties</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mainColer, padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
          onPress={() => router.push('/Transaction/TransactionHistory')}
          activeOpacity={0.7}
        >
          <Ionicons name="enter-outline" size={24} color={colors.textColer} />
          <Text style={{ marginLeft: 16, fontSize: 18, fontFamily: 'Mainfont', color: colors.foreground }}>Transaction</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mainColer, padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
          onPress={() => router.push('/profile/Settings')}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color={colors.textColer} />
          <Text style={{ marginLeft: 16, fontSize: 18, fontFamily: 'Mainfont', color: colors.foreground }}>Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        {/* Theme Toggle */}
        {/* <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mainColer, padding: 16, borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}>
          <Ionicons name={theme === 'dark' ? 'moon-outline' : 'sunny-outline'} size={24} color={colors.textColer} />
          <Text style={{ marginLeft: 16, fontSize: 18, fontFamily: 'Mainfont', color: colors.foreground }}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.muted, true: colors.primary }}
            thumbColor={theme === 'dark' ? colors.primaryForeground : colors.foreground}
            style={{ marginLeft: 'auto' }}
          />
        </View> */}
      </View>

      {/* Logout Button */}
      {/* <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 24 }}>
        <TouchableOpacity
          style={{ backgroundColor: colors.destructive, padding: 16, borderRadius: 8, alignItems: 'center' }}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 18, fontFamily: 'Mainfont', fontWeight: '600', color: colors.destructiveForeground }}>Log Out</Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
}