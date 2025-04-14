import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '../../hooks/useThemeColors';
import { requestOtp, registerCustomer } from '../../services/api/authApi';
import RNPickerSelect from 'react-native-picker-select';
import { EnvelopeIcon, PhoneIcon, UserIcon, HomeIcon, EyeIcon, EyeSlashIcon, LockClosedIcon } from 'react-native-heroicons/outline';

export default function Register() {
  const { colors } = useThemeColors();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [userInfo, setUserInfo] = useState({
    phone: '',
    fullname: '',
    address: '',
    gender: '1',
    roleId: '0',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    otp: '',
    fullname: '',
    phone: '',
    address: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP input refs
  const otpInputs = useRef<TextInput[]>([]);

  // Validation functions
  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? '' : 'Invalid email format';
  };

  const validatePhone = (phone: string) => {
    if (!phone) return 'Phone number is required';
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone) ? '' : 'Phone number must be 10 digits and start with 0';
  };

  const validateStep1 = () => {
    const emailError = validateEmail(email);
    setErrors((prev) => ({ ...prev, email: emailError }));
    return !emailError;
  };

  const validateStep2 = () => {
    const otpError = otp.join('').length !== 6 ? 'OTP must be 6 digits' : '';
    const fullnameError = userInfo.fullname ? '' : 'Full name is required';
    const phoneError = validatePhone(userInfo.phone);
    const addressError = userInfo.address ? '' : 'Address is required';
    const passwordError = userInfo.password.length >= 6 ? '' : 'Password must be at least 6 characters';
    const confirmPasswordError =
      userInfo.confirmPassword === userInfo.password ? '' : 'Passwords do not match';

    setErrors({
      email: '',
      otp: otpError,
      fullname: fullnameError,
      phone: phoneError,
      address: addressError,
      gender: '',
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    return !otpError && !fullnameError && !phoneError && !addressError && !passwordError && !confirmPasswordError;
  };

  const handleRequestOtp = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    try {
      await requestOtp(email);
      setStep(2);
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, email: error.message || 'Failed to send OTP' }));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const payload = {
        userInfomation: {
          email,
          phone: userInfo.phone,
          fullname: userInfo.fullname,
          address: userInfo.address,
          gender: parseInt(userInfo.gender),
          roleId: 5,
        },
        otp: otp.join(''),
        password: userInfo.password,
      };
      await registerCustomer(payload);
      router.replace('/auth/Login');
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        otp: error.message || 'Registration failed. Please check your OTP or information',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
    if (!text && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  if (step === 1) {
    return (
      <View className="flex-1 p-6" style={{ backgroundColor: colors.background }}>
        {/* Logo */}
        <View className="items-center mb-8">
          <Image
            source={require('../../assets/images/logo3.png')}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
        </View>

        {/* Step Indicator */}
        <View className="flex-row justify-center mb-6">
          <View className="w-8 h-8 rounded-full items-center justify-center bg-primary">
            <Text className="text-white font-semibold">1</Text>
          </View>
          <View className="w-8 h-1 bg-gray-300 self-center mx-2" />
          <View className="w-8 h-8 rounded-full items-center justify-center bg-gray-300">
            <Text className="text-gray-600 font-semibold">2</Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold mb-6 text-center" style={{ color: colors.foreground }}>
          Register - Step 1
        </Text>

        {/* Form Container */}
        <View className="bg-card p-6 rounded-2xl shadow-lg" style={{ backgroundColor: colors.card }}>
          {/* Email Field */}
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
              Email
            </Text>
            <View
              className="flex-row items-center border rounded-lg p-3"
              style={{ borderColor: colors.border, backgroundColor: colors.input }}
            >
              <EnvelopeIcon size={20} color={colors.mutedForeground} />
              <TextInput
                className="flex-1 ml-2"
                placeholder="Enter your email"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors((prev) => ({ ...prev, email: validateEmail(text) }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ color: colors.foreground }}
              />
            </View>
            {errors.email && (
              <Text className="text-sm mt-1" style={{ color: colors.destructive }}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            className="rounded-lg p-4 items-center flex-row justify-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleRequestOtp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primaryForeground} />
            ) : (
              <Text className="text-white font-semibold" style={{ color: colors.primaryForeground }}>
                Send OTP
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6" style={{ backgroundColor: colors.background }}>
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/images/logo3.png')}
          style={{ width: 120, height: 120 }}
          resizeMode="contain"
        />
      </View>

      {/* Step Indicator */}
      <View className="flex-row justify-center mb-6">
        <View className="w-8 h-8 rounded-full items-center justify-center bg-gray-300">
          <Text className="text-gray-600 font-semibold">1</Text>
        </View>
        <View className="w-8 h-1 bg-gray-300 self-center mx-2" />
        <View className="w-8 h-8 rounded-full items-center justify-center bg-primary">
          <Text className="text-white font-semibold">2</Text>
        </View>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold mb-6 text-center" style={{ color: colors.foreground }}>
        Register - Step 2
      </Text>

      {/* Form Container */}
      <View className="bg-card p-6 rounded-2xl shadow-lg" style={{ backgroundColor: colors.card }}>
        {/* Email Field (Read-Only) */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Email
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{ borderColor: colors.border, backgroundColor: colors.input }}
          >
            <EnvelopeIcon size={20} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-2"
              value={email}
              editable={false} // Make the field read-only
              style={{ color: colors.foreground }}
            />
          </View>
        </View>

        {/* OTP Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            OTP
          </Text>
          <View className="flex-row justify-between">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (otpInputs.current[index] = ref!)}
                className="w-12 h-12 border rounded-lg text-center text-lg"
                style={{ borderColor: colors.border, backgroundColor: colors.input, color: colors.foreground }}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
              />
            ))}
          </View>
          {errors.otp && (
            <Text className="text-sm mt-1" style={{ color: colors.destructive }}>
              {errors.otp}
            </Text>
          )}
        </View>

        {/* Full Name Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Full Name
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{ borderColor: colors.border, backgroundColor: colors.input }}
          >
            <UserIcon size={20} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your full name"
              placeholderTextColor={colors.mutedForeground}
              value={userInfo.fullname}
              onChangeText={(text) => setUserInfo({ ...userInfo, fullname: text })}
              style={{ color: colors.foreground }}
            />
          </View>
          {errors.fullname && (
            <Text className="text-sm mt-1" style={{ color: colors.destructive }}>
              {errors.fullname}
            </Text>
          )}
        </View>

        {/* Phone Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Phone Number
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{ borderColor: colors.border, backgroundColor: colors.input }}
          >
            <PhoneIcon size={20} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your phone number"
              placeholderTextColor={colors.mutedForeground}
              value={userInfo.phone}
              onChangeText={(text) => {
                setUserInfo({ ...userInfo, phone: text });
                setErrors((prev) => ({ ...prev, phone: validatePhone(text) }));
              }}
              keyboardType="phone-pad"
              style={{ color: colors.foreground }}
            />
          </View>
          {errors.phone && (
            <Text className="text-sm mt-1" style={{ color: colors.destructive }}>
              {errors.phone}
            </Text>
          )}
        </View>

        {/* Address Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Address
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{ borderColor: colors.border, backgroundColor: colors.input }}
          >
            <HomeIcon size={20} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your address"
              placeholderTextColor={colors.mutedForeground}
              value={userInfo.address}
              onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
              style={{ color: colors.foreground }}
            />
          </View>
          {errors.address && (
            <Text className="text-sm mt-1" style={{ color: colors.destructive }}>
              {errors.address}
            </Text>
          )}
        </View>

        {/* Gender Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Gender
          </Text>
          <View
            className="border rounded-lg p-3"
            style={{ borderColor: colors.border, backgroundColor: colors.input }}
          >
            <RNPickerSelect
              onValueChange={(value) => setUserInfo({ ...userInfo, gender: value })}
              items={[
                { label: 'Male', value: '1' },
                { label: 'Female', value: '0' },
              ]}
              value={userInfo.gender}
              style={{
                inputIOS: { color: colors.foreground },
                inputAndroid: { color: colors.foreground },
                placeholder: { color: colors.mutedForeground },
              }}
              placeholder={{ label: 'Select your gender', value: null }}
            />
          </View>
        </View>

        {/* Password Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Password
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{ borderColor: colors.border, backgroundColor: colors.input }}
          >
            <LockClosedIcon size={20} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Enter your password"
              placeholderTextColor={colors.mutedForeground}
              value={userInfo.password}
              onChangeText={(text) => setUserInfo({ ...userInfo, password: text })}
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
          {errors.password && (
            <Text className="text-sm mt-1" style={{ color: colors

.destructive }}>
              {errors.password}
            </Text>
          )}
        </View>

        {/* Confirm Password Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium mb-1" style={{ color: colors.foreground }}>
            Confirm Password
          </Text>
          <View
            className="flex-row items-center border rounded-lg p-3"
            style={{ borderColor: colors.border, backgroundColor: colors.input }}
          >
            <LockClosedIcon size={20} color={colors.mutedForeground} />
            <TextInput
              className="flex-1 ml-2"
              placeholder="Confirm your password"
              placeholderTextColor={colors.mutedForeground}
              value={userInfo.confirmPassword}
              onChangeText={(text) => setUserInfo({ ...userInfo, confirmPassword: text })}
              secureTextEntry={!showConfirmPassword}
              style={{ color: colors.foreground }}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <EyeSlashIcon size={20} color={colors.mutedForeground} />
              ) : (
                <EyeIcon size={20} color={colors.mutedForeground} />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text className="text-sm mt-1" style={{ color: colors.destructive }}>
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        {/* Back and Register Buttons */}
        <View className="flex-row justify-between">
          <TouchableOpacity
            className="rounded-lg p-4 flex-1 mr-2 items-center"
            style={{ backgroundColor: colors.secondary }}
            onPress={() => setStep(1)}
          >
            <Text className="font-semibold" style={{ color: colors.secondaryForeground }}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="rounded-lg p-4 flex-1 ml-2 items-center flex-row justify-center"
            style={{ backgroundColor: colors.primary }}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primaryForeground} />
            ) : (
              <Text className="text-white font-semibold" style={{ color: colors.primaryForeground }}>
                Register
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Link */}
      <View className="mt-6 flex-row justify-center">
        <Text className="text-sm" style={{ color: colors.mutedForeground }}>
          Already have an account?{' '}
        </Text>
        <TouchableOpacity onPress={() => router.push('/auth/Login')}>
          <Text className="text-sm font-semibold" style={{ color: colors.primary }}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}