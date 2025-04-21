import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { AlertCircle, Phone, User, CreditCard } from 'react-native-feather';

type CancelOrderInfo = {
  orderId: number | null;
  sellerId: number | null;
  visible: boolean;
  formData: {
    contactNumber: string;
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  touched: {
    contactNumber: boolean;
    accountName: boolean;
    accountNumber: boolean;
    bankName: boolean;
  };
};

type CancelOrderModalProps = {
  visible: boolean;
  formData: CancelOrderInfo['formData'];
  touched: CancelOrderInfo['touched'];
  onChange: (name: keyof CancelOrderInfo['formData'], value: string) => void;
  onBlur: (field: keyof CancelOrderInfo['touched']) => void; // Add onBlur prop
  onCancel: () => void;
  onConfirm: () => void;
};

export default function CancelOrderModal({
  visible,
  formData,
  touched,
  onChange,
  onBlur, // Add onBlur to props
  onCancel,
  onConfirm,
}: CancelOrderModalProps) {
  const { colors } = useThemeColors();

  const handleInputChange = (name: keyof CancelOrderInfo['formData'], value: string) => {
    onChange(name, value);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card rounded-lg p-6 w-11/12 max-w-md" style={{ backgroundColor: colors.card }}>
          {/* Header */}
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
            Cancel Order and Refund
          </Text>

          {/* Notice */}
          <View className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
            <View className="flex-row items-start">
              <AlertCircle width={20} height={20} color="#F59E0B" className="mr-2" />
              <View>
                <Text className="text-yellow-800 font-medium">Important Notice</Text>
                <Text className="text-yellow-700">
                  Please carefully verify your bank account information before submitting. Refunds will be processed to this account.
                </Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            {/* Contact Number */}
            <View>
              <View className="flex-row items-center mb-1">
                <Phone width={16} height={16} color={colors.mutedForeground} className="mr-2" />
                <Text style={{ color: colors.foreground }}>
                  Contact Number <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                value={formData.contactNumber}
                onChangeText={(value) => handleInputChange('contactNumber', value)}
                onBlur={() => onBlur('contactNumber')} // Use onBlur prop
                placeholder="Your phone number"
                placeholderTextColor={colors.mutedForeground}
                className={`w-full p-2 border rounded ${!formData.contactNumber && touched.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
                style={{ borderColor: !formData.contactNumber && touched.contactNumber ? '#EF4444' : colors.border, color: colors.foreground }}
              />
              {!formData.contactNumber && touched.contactNumber && (
                <View className="flex-row items-center mt-1">
                  <AlertCircle width={14} height={14} color="#EF4444" className="mr-1" />
                  <Text className="text-red-500 text-sm">Please enter your contact number</Text>
                </View>
              )}
            </View>

            {/* Account Name */}
            <View>
              <View className="flex-row items-center mb-1">
                <User width={16} height={16} color={colors.mutedForeground} className="mr-2" />
                <Text style={{ color: colors.foreground }}>
                  Account Name <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                value={formData.accountName}
                onChangeText={(value) => handleInputChange('accountName', value)}
                onBlur={() => onBlur('accountName')}
                placeholder="Account holder name"
                placeholderTextColor={colors.mutedForeground}
                className={`w-full p-2 border rounded ${!formData.accountName && touched.accountName ? 'border-red-500' : 'border-gray-300'}`}
                style={{ borderColor: !formData.accountName && touched.accountName ? '#EF4444' : colors.border, color: colors.foreground }}
              />
              {!formData.accountName && touched.accountName && (
                <View className="flex-row items-center mt-1">
                  <AlertCircle width={14} height={14} color="#EF4444" className="mr-1" />
                  <Text className="text-red-500 text-sm">Please enter account name</Text>
                </View>
              )}
            </View>

            {/* Account Number */}
            <View>
              <View className="flex-row items-center mb-1">
                <CreditCard width={16} height={16} color={colors.mutedForeground} className="mr-2" />
                <Text style={{ color: colors.foreground }}>
                  Account Number <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                value={formData.accountNumber}
                onChangeText={(value) => handleInputChange('accountNumber', value)}
                onBlur={() => onBlur('accountNumber')}
                placeholder="Bank account number"
                placeholderTextColor={colors.mutedForeground}
                className={`w-full p-2 border rounded ${!formData.accountNumber && touched.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                style={{ borderColor: !formData.accountNumber && touched.accountNumber ? '#EF4444' : colors.border, color: colors.foreground }}
              />
              {!formData.accountNumber && touched.accountNumber && (
                <View className="flex-row items-center mt-1">
                  <AlertCircle width={14} height={14} color="#EF4444" className="mr-1" />
                  <Text className="text-red-500 text-sm">Please enter account number</Text>
                </View>
              )}
            </View>

            {/* Bank Name */}
            <View>
              <View className="flex-row items-center mb-1">
                <CreditCard width={16} height={16} color={colors.mutedForeground} className="mr-2" />
                <Text style={{ color: colors.foreground }}>
                  Bank Name <Text className="text-red-500">*</Text>
                </Text>
              </View>
              <TextInput
                value={formData.bankName}
                onChangeText={(value) => handleInputChange('bankName', value)}
                onBlur={() => onBlur('bankName')}
                placeholder="Bank name"
                placeholderTextColor={colors.mutedForeground}
                className={`w-full p-2 border rounded ${!formData.bankName && touched.bankName ? 'border-red-500' : 'border-gray-300'}`}
                style={{ borderColor: !formData.bankName && touched.bankName ? '#EF4444' : colors.border, color: colors.foreground }}
              />
              {!formData.bankName && touched.bankName && (
                <View className="flex-row items-center mt-1">
                  <AlertCircle width={14} height={14} color="#EF4444" className="mr-1" />
                  <Text className="text-red-500 text-sm">Please enter bank name</Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center space-x-4 mt-6">
            <TouchableOpacity
              className="rounded-lg p-3 px-6"
              style={{ backgroundColor: colors.muted }}
              onPress={onCancel}
            >
              <Text className="font-semibold" style={{ color: colors.mutedForeground }}>
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-lg p-3 px-6"
              style={{ backgroundColor: '#EF4444' }}
              onPress={onConfirm}
            >
              <Text className="font-semibold text-white">Confirm Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}