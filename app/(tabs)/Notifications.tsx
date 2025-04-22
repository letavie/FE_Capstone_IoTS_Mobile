import { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useThemeColors';
import Toast from 'react-native-toast-message';
import { fetchAllNotifications, Notification } from '@/services/slices/notificationApi';
import { formatDistanceToNow } from 'date-fns';

// Utility to map entityType to an icon
const getIconForEntityType = (entityType: number): keyof typeof Ionicons.glyphMap => {
  switch (entityType) {
    case 9: // Order-related notification
      return 'cart';
    default:
      return 'notifications';
  }
};

export default function Notifications() {
  const { colors } = useThemeColors();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchAllNotifications();
      setNotifications(response.data || []);
    } catch (err: any) {
      showToast('error', 'Error', err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, { borderColor: colors.mutedForeground }]}
    >
      <Ionicons
        name={getIconForEntityType(item.entityType)}
        size={24}
        color={colors.primary}
        style={styles.icon}
      />
      <View style={styles.content}>
        <Text style={[styles.message, { color: item.isRead ? colors.mutedForeground : colors.foreground }]}>
          {item.title}
        </Text>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
          {formatDistanceToNow(new Date(item.createdDate), { addSuffix: true })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.foreground }]}>Notifications</Text>
      {loading ? (
        <Text style={[styles.loading, { color: colors.mutedForeground }]}>Loading...</Text>
      ) : notifications.length === 0 ? (
        <Text style={[styles.empty, { color: colors.mutedForeground }]}>No notifications available.</Text>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { fontSize: 24, fontWeight: '700', padding: 16 },
  loading: { fontSize: 16, textAlign: 'center', marginTop: 16 },
  empty: { fontSize: 16, textAlign: 'center', marginTop: 16 },
  listContent: { paddingBottom: 16 },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  icon: { marginRight: 16 },
  content: { flex: 1 },
  message: { fontSize: 14, fontWeight: '500' },
  time: { fontSize: 12, marginTop: 4 },
});

const showToast = (type: string, title: string, message: string) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
  });
};