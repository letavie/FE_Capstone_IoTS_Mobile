import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import RNPickerSelect from "react-native-picker-select";
import {
  fetchProvinces,
  fetchDistricts,
  fetchWards,
  fetchAddressByProwardId,
} from "@/services/slices/address";

interface AddressFormProps {
  onAddressChange: (data: {
    address: string;
    ids: {
      provinceId: number | null;
      districtId: number | null;
      wardId: number | null;
      addressId: number | null;
    };
  }) => void;
  defaultValues?: {
    provinceId?: number;
    districtId?: number;
    wardId?: number;
    addressId?: number;
    address?: string;
  };
}

const AddressForm: React.FC<AddressFormProps> = ({
  onAddressChange,
  defaultValues,
}) => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Load tỉnh/thành phố khi component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(true);
      try {
        const data = await fetchProvinces();
        setProvinces(data || []);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Lỗi tải dữ liệu",
          text2: "Không thể tải danh sách tỉnh/thành phố",
        });
      } finally {
        setLoading(false);
      }
    };
    loadProvinces();
  }, []);

  // Xử lý giá trị mặc định
  useEffect(() => {
    if (defaultValues) {
      if (defaultValues.address) {
        setAddress(defaultValues.address);
      }
      if (defaultValues.provinceId) {
        setSelectedProvince(defaultValues.provinceId);
      }
      if (defaultValues.districtId) {
        setSelectedDistrict(defaultValues.districtId);
      }
      if (defaultValues.wardId) {
        setSelectedWard(defaultValues.wardId);
      }
      if (defaultValues.addressId) {
        setSelectedAddress(defaultValues.addressId);
      }
    }
  }, [defaultValues]);

  // Hàm xử lý khi chọn tỉnh/thành phố
  const handleProvinceChange = useCallback(
    async (provinceId: number | null) => {
      setSelectedProvince(provinceId);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setSelectedAddress(null);
      setDistricts([]);
      setWards([]);
      setAddresses([]);

      if (provinceId) {
        setLoading(true);
        try {
          const data = await fetchDistricts(provinceId);
          setDistricts(data || []);
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Lỗi tải dữ liệu",
            text2: "Không thể tải danh sách quận/huyện",
          });
        } finally {
          setLoading(false);
        }
      }
    },
    []
  );

  // Hàm xử lý khi chọn quận/huyện
  const handleDistrictChange = useCallback(
    async (districtId: number | null) => {
      setSelectedDistrict(districtId);
      setSelectedWard(null);
      setSelectedAddress(null);
      setWards([]);
      setAddresses([]);

      if (districtId) {
        setLoading(true);
        try {
          const data = await fetchWards(districtId);
          setWards(data || []);
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Lỗi tải dữ liệu",
            text2: "Không thể tải danh sách phường/xã",
          });
        } finally {
          setLoading(false);
        }
      }
    },
    []
  );

  // Hàm xử lý khi chọn phường/xã
  const handleWardChange = useCallback(async (wardId: number | null) => {
    setSelectedWard(wardId);
    setSelectedAddress(null);
    setAddresses([]);

    if (wardId) {
      setLoading(true);
      try {
        const data = await fetchAddressByProwardId(wardId);
        setAddresses(data || []);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Lỗi tải dữ liệu",
          text2: "Không thể tải danh sách địa chỉ",
        });
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // Hàm xử lý khi nhập địa chỉ - chỉ cập nhật state, không gọi callback
  const handleAddressInputChange = useCallback((text: string) => {
    setAddress(text);
  }, []);

  // Gọi callback khi có thay đổi về dropdown
  useEffect(() => {
    onAddressChange({
      address, // Giữ nguyên giá trị địa chỉ đã nhập
      ids: {
        provinceId: selectedProvince,
        districtId: selectedDistrict,
        wardId: selectedWard,
        addressId: selectedAddress,
      },
    });
  }, [
    selectedProvince,
    selectedDistrict,
    selectedWard,
    selectedAddress,
    onAddressChange,
  ]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      <Text style={styles.label}>Số nhà, tên đường</Text>
      <TextInput
        style={styles.input}
        placeholder="Ví dụ: 57/4"
        value={address}
        onChangeText={handleAddressInputChange} // Chỉ cập nhật state local
        autoCapitalize="none"
      />
      <Text style={styles.label}>Tỉnh/Thành phố</Text>
      <RNPickerSelect
        onValueChange={handleProvinceChange}
        items={provinces.map((p) => ({ label: p.name, value: p.id }))}
        value={selectedProvince}
        placeholder={{ label: "Chọn Tỉnh/Thành phố", value: null }}
        style={pickerSelectStyles}
      />
      <Text style={styles.label}>Quận/Huyện</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedDistrict(value);
          handleDistrictChange(value);
        }}
        items={districts.map((d) => ({ label: d.name, value: d.id }))}
        value={selectedDistrict}
        placeholder={{ label: "Chọn Quận/Huyện", value: null }}
        disabled={!selectedProvince || districts.length === 0}
        style={pickerSelectStyles}
      />
      <Text style={styles.label}>Phường/Xã</Text>
      <RNPickerSelect
        onValueChange={(value) => {
          setSelectedWard(value);
          handleWardChange(value);
        }}
        items={wards.map((w) => ({ label: w.name, value: w.id }))}
        value={selectedWard}
        placeholder={{ label: "Chọn Phường/Xã", value: null }}
        disabled={!selectedDistrict || wards.length === 0}
        style={pickerSelectStyles}
      />
      <Text style={styles.label}>Thôn/Xóm (Tùy chọn)</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedAddress(value)}
        items={addresses.map((a) => ({ label: a.name, value: a.id }))}
        value={selectedAddress}
        placeholder={{ label: "Chọn Thôn/Xóm (nếu có)", value: null }}
        disabled={!selectedWard || addresses.length === 0}
        style={pickerSelectStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
};

export default AddressForm;
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
// } from "react-native";
// import Toast from "react-native-toast-message";
// import RNPickerSelect from "react-native-picker-select";
// import {
//   fetchProvinces,
//   fetchDistricts,
//   fetchWards,
//   fetchAddressByProwardId,
// } from "@/services/slices/address";

// interface AddressFormProps {
//   onAddressChange: (data: {
//     address: string;
//     ids: {
//       provinceId: number | null;
//       districtId: number | null;
//       wardId: number | null;
//       addressId: number | null;
//     };
//   }) => void;
//   defaultValues?: {
//     provinceId?: number;
//     districtId?: number;
//     wardId?: number;
//     addressId?: number;
//     address?: string;
//   };
// }

// const AddressForm: React.FC<AddressFormProps> = ({
//   onAddressChange,
//   defaultValues,
// }) => {
//   const [provinces, setProvinces] = useState<any[]>([]);
//   const [districts, setDistricts] = useState<any[]>([]);
//   const [wards, setWards] = useState<any[]>([]);
//   const [addresses, setAddresses] = useState<any[]>([]);
//   const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
//   const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
//   const [selectedWard, setSelectedWard] = useState<number | null>(null);
//   const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
//   const [address, setAddress] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Load provinces on mount
//   useEffect(() => {
//     const loadProvinces = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchProvinces();
//         setProvinces(data || []);
//       } catch (error) {
//         Toast.show({
//           type: "error",
//           text1: "Error loading data",
//           text2: "Unable to load province/city list",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProvinces();
//   }, []);

//   // Handle default values - Sửa lại phần này để xử lý default values đúng cách
//   useEffect(() => {
//     if (defaultValues) {
//       if (defaultValues.address && defaultValues.address !== address) {
//         setAddress(defaultValues.address);
//       }
//       if (
//         defaultValues.provinceId &&
//         defaultValues.provinceId !== selectedProvince
//       ) {
//         setSelectedProvince(defaultValues.provinceId);
//         handleProvinceChange(defaultValues.provinceId);
//       }
//       if (
//         defaultValues.districtId &&
//         defaultValues.districtId !== selectedDistrict
//       ) {
//         setSelectedDistrict(defaultValues.districtId);
//         // Chỉ gọi handleDistrictChange nếu đã có selectedProvince
//         if (selectedProvince) {
//           handleDistrictChange(defaultValues.districtId);
//         }
//       }
//       if (defaultValues.wardId && defaultValues.wardId !== selectedWard) {
//         setSelectedWard(defaultValues.wardId);
//         // Chỉ gọi handleWardChange nếu đã có selectedDistrict
//         if (selectedDistrict) {
//           handleWardChange(defaultValues.wardId);
//         }
//       }
//       if (
//         defaultValues.addressId &&
//         defaultValues.addressId !== selectedAddress
//       ) {
//         setSelectedAddress(defaultValues.addressId);
//       }
//     }
//   }, [defaultValues, selectedProvince, selectedDistrict]);

//   const handleProvinceChange = useCallback(
//     async (provinceId: number | null) => {
//       setSelectedProvince(provinceId);
//       setSelectedDistrict(null);
//       setSelectedWard(null);
//       setSelectedAddress(null);
//       setDistricts([]);
//       setWards([]);
//       setAddresses([]);

//       if (provinceId) {
//         setLoading(true);
//         try {
//           const data = await fetchDistricts(provinceId);
//           setDistricts(data || []);
//         } catch (error) {
//           Toast.show({
//             type: "error",
//             text1: "Error loading data",
//             text2: "Unable to load district list",
//           });
//         } finally {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   const handleDistrictChange = useCallback(
//     async (districtId: number | null) => {
//       setSelectedDistrict(districtId);
//       setSelectedWard(null);
//       setSelectedAddress(null);
//       setWards([]);
//       setAddresses([]);

//       if (districtId) {
//         setLoading(true);
//         try {
//           const data = await fetchWards(districtId);
//           setWards(data || []);
//         } catch (error) {
//           Toast.show({
//             type: "error",
//             text1: "Error loading data",
//             text2: "Unable to load ward/commune list.",
//           });
//         } finally {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   const handleWardChange = useCallback(async (wardId: number | null) => {
//     setSelectedWard(wardId);
//     setSelectedAddress(null);
//     setAddresses([]);

//     if (wardId) {
//       setLoading(true);
//       try {
//         const data = await fetchAddressByProwardId(wardId);
//         setAddresses(data || []);
//       } catch (error) {
//         Toast.show({
//           type: "error",
//           text1: "Error loading data",
//           text2: "Unable to load address list.",
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, []);

//   // const handleAddressChange = useCallback((addressId: number | null) => {
//   //   setSelectedAddress(addressId);
//   // }, []);
//   // AddressForm.tsx (phần handleAddressChange)
//   const handleAddressChange = useCallback(
//     (text: string) => {
//       setAddress(text);
//       // Gọi callback để cập nhật lên component cha
//       onAddressChange({
//         address: text,
//         ids: {
//           provinceId: selectedProvince,
//           districtId: selectedDistrict,
//           wardId: selectedWard,
//           addressId: selectedAddress,
//         },
//       });
//     },
//     [
//       selectedProvince,
//       selectedDistrict,
//       selectedWard,
//       selectedAddress,
//       onAddressChange,
//     ]
//   );
//   const handleAddressInputChange = useCallback((text: string) => {
//     setAddress(text);
//   }, []);

//   // Update parent when any address field changes
//   useEffect(() => {
//     onAddressChange({
//       address,
//       ids: {
//         provinceId: selectedProvince,
//         districtId: selectedDistrict,
//         wardId: selectedWard,
//         addressId: selectedAddress,
//       },
//     });
//   }, [
//     selectedProvince,
//     selectedDistrict,
//     selectedWard,
//     selectedAddress,
//     onAddressChange,
//   ]);

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#007AFF" />}
//       <Text style={styles.label}>Số nhà, tên đường</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Ví dụ: 57/4"
//         value={address}
//         onChangeText={handleAddressInputChange}
//         autoCapitalize="none"
//       />
//       <Text style={styles.label}>Tỉnh/Thành phố</Text>
//       <RNPickerSelect
//         onValueChange={handleProvinceChange}
//         items={provinces.map((p) => ({ label: p.name, value: p.id }))}
//         value={selectedProvince}
//         placeholder={{ label: "Chọn Tỉnh/Thành phố", value: null }}
//         style={pickerSelectStyles}
//       />
//       <Text style={styles.label}>Quận/Huyện</Text>
//       <RNPickerSelect
//         onValueChange={(value) => {
//           setSelectedDistrict(value);
//           handleDistrictChange(value);
//         }}
//         items={districts.map((d) => ({ label: d.name, value: d.id }))}
//         value={selectedDistrict}
//         placeholder={{ label: "Chọn Quận/Huyện", value: null }}
//         disabled={!selectedProvince || districts.length === 0}
//         style={pickerSelectStyles}
//       />
//       <Text style={styles.label}>Phường/Xã</Text>
//       <RNPickerSelect
//         onValueChange={(value) => {
//           setSelectedWard(value);
//           handleWardChange(value);
//         }}
//         items={wards.map((w) => ({ label: w.name, value: w.id }))}
//         value={selectedWard}
//         placeholder={{ label: "Chọn Phường/Xã", value: null }}
//         disabled={!selectedDistrict || wards.length === 0}
//         style={pickerSelectStyles}
//       />
//       <Text style={styles.label}>Thôn/Xóm (Tùy chọn)</Text>
//       <RNPickerSelect
//         onValueChange={handleAddressChange}
//         items={addresses.map((a) => ({ label: a.name, value: a.id }))}
//         value={selectedAddress}
//         placeholder={{ label: "Chọn Thôn/Xóm (nếu có)", value: null }}
//         disabled={!selectedWard || addresses.length === 0}
//         style={pickerSelectStyles}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 8,
//     marginTop: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: "#fff",
//     marginBottom: 12,
//   },
// });

// const pickerSelectStyles = {
//   inputIOS: {
//     fontSize: 16,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     color: "black",
//     paddingRight: 30,
//   },
//   inputAndroid: {
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     color: "black",
//     paddingRight: 30,
//   },
// };

// export default AddressForm;
