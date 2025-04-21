import { Modal, View, Text, Image, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type TrackingModalProps = {
  trackingInfo: {
    labelId?: string;
    statusText?: string;
    created?: string;
    deliverDate?: string;
    customerFullname?: string;
    customerTel?: string;
    address?: string;
  } | null;
  onClose: () => void;
};

export default function TrackingModal({ trackingInfo, onClose }: TrackingModalProps) {
  const { colors } = useThemeColors();

  return (
    <Modal
      visible={!!trackingInfo}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-card rounded-lg p-6 w-11/12 max-w-md" style={{ backgroundColor: colors.card }}>
          {/* Header with Logo */}
          <View className="flex-row items-center mb-4">
            <Image
              source={require('@/assets/images/Logo-GHTK.png')}
              style={{ width: '50%', height: 50, resizeMode: 'contain' }}
              onError={() => ({ uri: 'https://img.upanh.tv/2025/03/31/Logo-GHTK-1024x346.png' })}
            />
          </View>

          {/* Tracking Details */}
          <View className="space-y-2">
            {[
              { label: 'Tracking ID:', value: trackingInfo?.labelId },
              { label: 'Status:', value: trackingInfo?.statusText },
              { label: 'Created Date:', value: trackingInfo?.created },
              { label: 'Estimated Delivery:', value: trackingInfo?.deliverDate },
              { label: 'Customer Name:', value: trackingInfo?.customerFullname },
              { label: 'Phone Number:', value: trackingInfo?.customerTel },
              { label: 'Address:', value: trackingInfo?.address },
            ].map((item, index) => (
              <View key={index} className="flex-row justify-between">
                <Text className="font-semibold" style={{ color: colors.foreground }}>
                  {item.label}
                </Text>
                <Text className="text-right" style={{ color: colors.foreground }}>
                  {item.value || 'N/A'}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <TouchableOpacity
            className="mt-6 rounded-lg p-3 items-center"
            style={{ backgroundColor: colors.primary }}
            onPress={onClose}
          >
            <Text className="font-semibold" style={{ color: colors.primaryForeground }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}