import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getIotDevices, IotDevice, PaginationParams } from '@/services/slices/productApi';
import { ProductType } from '@/constants/ProductType';
import  DeviceItem  from '@/app/(tabs)/Home';
import { useRouter } from 'expo-router';

export default function DeviceList() {
    const { colors } = useThemeColors();
    const router = useRouter();
    const [devices, setDevices] = useState<IotDevice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchDevices = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: PaginationParams = {
          pageIndex: 0,
          pageSize: 20,
          searchKeyword: '',
          deviceTypeFilter: ProductType.DEVICE,
        };
        const response = await getIotDevices(params);
        setDevices(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load devices.');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchDevices();
    }, []);
  
    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }
  
    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <Text style={{ color: colors.destructive }}>{error}</Text>
        </View>
      );
    }
  
    return (
      <FlatList
        data={devices}
        renderItem={({ item }) => <DeviceItem item={item} colors={colors} router={router} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
      />
    );
  }