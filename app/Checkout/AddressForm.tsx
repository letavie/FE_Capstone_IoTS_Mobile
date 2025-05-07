// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   TextInput,
// } from "react-native";
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
//       provinceId: number | undefined;
//       districtId: number | undefined;
//       wardId: number | undefined;
//       addressId: number | undefined;
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
//   const [selectedProvince, setSelectedProvince] = useState<number | undefined>(
//     undefined
//   );
//   const [selectedDistrict, setSelectedDistrict] = useState<number | undefined>(
//     undefined
//   );
//   const [selectedWard, setSelectedWard] = useState<number | undefined>(
//     undefined
//   );
//   const [selectedAddress, setSelectedAddress] = useState<number | undefined>(
//     undefined
//   );
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
//         Alert.alert("Lỗi", "Không thể tải danh sách tỉnh/thành phố.");
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
//     async (provinceId: number | undefined) => {
//       setSelectedProvince(provinceId);
//       setSelectedDistrict(undefined);
//       setSelectedWard(undefined);
//       setSelectedAddress(undefined);
//       setDistricts([]);
//       setWards([]);
//       setAddresses([]);

//       if (provinceId) {
//         setLoading(true);
//         try {
//           const data = await fetchDistricts(provinceId);
//           setDistricts(data || []);
//         } catch (error) {
//           Alert.alert("Lỗi", "Không thể tải danh sách quận/huyện.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   const handleDistrictChange = useCallback(
//     async (districtId: number | undefined) => {
//       setSelectedDistrict(districtId);
//       setSelectedWard(undefined);
//       setSelectedAddress(undefined);
//       setWards([]);
//       setAddresses([]);

//       if (districtId) {
//         setLoading(true);
//         try {
//           const data = await fetchWards(districtId);
//           setWards(data || []);
//         } catch (error) {
//           Alert.alert("Lỗi", "Không thể tải danh sách phường/xã.");
//         } finally {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   const handleWardChange = useCallback(async (wardId: number | undefined) => {
//     setSelectedWard(wardId);
//     setSelectedAddress(undefined);
//     setAddresses([]);

//     if (wardId) {
//       setLoading(true);
//       try {
//         const data = await fetchAddressByProwardId(wardId);
//         setAddresses(data || []);
//       } catch (error) {
//         Alert.alert("Lỗi", "Không thể tải danh sách địa chỉ.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, []);

//   const handleAddressChange = useCallback((addressId: number | undefined) => {
//     setSelectedAddress(addressId);
//   }, []);

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
//     address,
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
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   TextInput,
// } from "react-native";
// import RNPickerSelect from "react-native-picker-select";
// import { RadioButton } from "react-native-paper";
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
//     deliver_option: string;
//   }) => void;
//   defaultValues?: {
//     provinceId?: number;
//     districtId?: number;
//     wardId?: number;
//     addressId?: number;
//     address?: string;
//     deliver_option?: string;
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
//   const [deliverOption, setDeliverOption] = useState("none");
//   const [loading, setLoading] = useState(false);

//   // Load provinces on mount
//   useEffect(() => {
//     const loadProvinces = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchProvinces();
//         console.log("fetchProvinces response:", JSON.stringify(data, null, 2));
//         setProvinces(data || []);
//       } catch (error) {
//         Alert.alert("Lỗi", "Không thể tải danh sách tỉnh/thành phố.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProvinces();
//   }, []);

//   // Handle default values
//   useEffect(() => {
//     if (
//       defaultValues?.provinceId &&
//       defaultValues.provinceId !== selectedProvince
//     ) {
//       setSelectedProvince(defaultValues.provinceId);
//       handleProvinceChange(defaultValues.provinceId);
//     }
//   }, [defaultValues?.provinceId, selectedProvince]);

//   useEffect(() => {
//     if (
//       defaultValues?.districtId &&
//       selectedProvince &&
//       defaultValues.districtId !== selectedDistrict
//     ) {
//       setSelectedDistrict(defaultValues.districtId);
//       handleDistrictChange(defaultValues.districtId);
//     }
//   }, [defaultValues?.districtId, selectedProvince, selectedDistrict]);

//   useEffect(() => {
//     if (
//       defaultValues?.wardId &&
//       selectedDistrict &&
//       defaultValues.wardId !== selectedWard
//     ) {
//       setSelectedWard(defaultValues.wardId);
//       handleWardChange(defaultValues.wardId);
//     }
//   }, [defaultValues?.wardId, selectedDistrict, selectedWard]);

//   useEffect(() => {
//     if (
//       defaultValues?.addressId &&
//       selectedWard &&
//       defaultValues.addressId !== selectedAddress
//     ) {
//       setSelectedAddress(defaultValues.addressId);
//     }
//   }, [defaultValues?.addressId, selectedWard, selectedAddress]);

//   useEffect(() => {
//     if (defaultValues?.address && defaultValues.address !== address) {
//       setAddress(defaultValues.address);
//     }
//   }, [defaultValues?.address, address]);

//   useEffect(() => {
//     if (
//       defaultValues?.deliver_option &&
//       defaultValues.deliver_option !== deliverOption
//     ) {
//       setDeliverOption(defaultValues.deliver_option);
//     }
//   }, [defaultValues?.deliver_option, deliverOption]);

//   // Update parent component when address-related states change
//   useEffect(() => {
//     onAddressChange({
//       address,
//       ids: {
//         provinceId: selectedProvince,
//         districtId: selectedDistrict,
//         wardId: selectedWard,
//         addressId: selectedAddress,
//       },
//       deliver_option: deliverOption,
//     });
//   }, [
//     address,
//     selectedProvince,
//     selectedDistrict,
//     selectedWard,
//     selectedAddress,
//     deliverOption,
//     onAddressChange,
//   ]);

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
//           console.log(
//             "fetchDistricts response:",
//             JSON.stringify(data, null, 2)
//           );
//           setDistricts(data || []);
//         } catch (error) {
//           Alert.alert("Lỗi", "Không thể tải danh sách quận/huyện.");
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
//           console.log("fetchWards response:", JSON.stringify(data, null, 2));
//           setWards(data || []);
//         } catch (error) {
//           Alert.alert("Lỗi", "Không thể tải danh sách phường/xã.");
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
//         console.log(
//           "fetchAddressByProwardId response:",
//           JSON.stringify(data, null, 2)
//         );
//         setAddresses(data || []);
//         if (data && data.length > 0) {
//           setSelectedAddress(data[0].id);
//         }
//       } catch (error) {
//         Alert.alert("Lỗi", "Không thể tải danh sách địa chỉ.");
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, []);

//   const handleAddressChange = useCallback((addressId: number | null) => {
//     setSelectedAddress(addressId);
//   }, []);

//   const handleAddressInputChange = useCallback((text: string) => {
//     if (text.length <= 15) {
//       setAddress(text);
//     }
//   }, []);

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#007AFF" />}
//       <Text style={styles.label}>Số nhà, tên đường (tối đa 15 ký tự)</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Ví dụ: 57/4"
//         value={address}
//         onChangeText={handleAddressInputChange}
//         maxLength={15}
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
//         onValueChange={handleDistrictChange}
//         items={districts.map((d) => ({ label: d.name, value: d.id }))}
//         value={selectedDistrict}
//         placeholder={{ label: "Chọn Quận/Huyện", value: null }}
//         disabled={!selectedProvince || districts.length === 0}
//         style={pickerSelectStyles}
//       />
//       <Text style={styles.label}>Phường/Xã</Text>
//       <RNPickerSelect
//         onValueChange={handleWardChange}
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
//       <Text style={styles.label}>Phương thức vận chuyển</Text>
//       <RadioButton.Group
//         onValueChange={(value) => {
//           setDeliverOption(value);
//         }}
//         value={deliverOption}
//       >
//         <View style={styles.radioContainer}>
//           <RadioButton value="none" />
//           <Text style={styles.radioLabel}>Normal shipping</Text>
//         </View>
//         <View style={styles.radioContainer}>
//           <RadioButton value="xteam" />
//           <Text style={styles.radioLabel}>Fast shipping</Text>
//         </View>
//       </RadioButton.Group>
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
//   radioContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   radioLabel: {
//     fontSize: 16,
//     color: "#333",
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
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
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

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoading(true);
      try {
        const data = await fetchProvinces();
        setProvinces(data || []);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải danh sách tỉnh/thành phố.");
      } finally {
        setLoading(false);
      }
    };
    loadProvinces();
  }, []);

  // Handle default values - Sửa lại phần này để xử lý default values đúng cách
  useEffect(() => {
    if (defaultValues) {
      if (defaultValues.address && defaultValues.address !== address) {
        setAddress(defaultValues.address);
      }
      if (
        defaultValues.provinceId &&
        defaultValues.provinceId !== selectedProvince
      ) {
        setSelectedProvince(defaultValues.provinceId);
        handleProvinceChange(defaultValues.provinceId);
      }
      if (
        defaultValues.districtId &&
        defaultValues.districtId !== selectedDistrict
      ) {
        setSelectedDistrict(defaultValues.districtId);
        // Chỉ gọi handleDistrictChange nếu đã có selectedProvince
        if (selectedProvince) {
          handleDistrictChange(defaultValues.districtId);
        }
      }
      if (defaultValues.wardId && defaultValues.wardId !== selectedWard) {
        setSelectedWard(defaultValues.wardId);
        // Chỉ gọi handleWardChange nếu đã có selectedDistrict
        if (selectedDistrict) {
          handleWardChange(defaultValues.wardId);
        }
      }
      if (
        defaultValues.addressId &&
        defaultValues.addressId !== selectedAddress
      ) {
        setSelectedAddress(defaultValues.addressId);
      }
    }
  }, [defaultValues, selectedProvince, selectedDistrict]);

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
          Alert.alert("Lỗi", "Không thể tải danh sách quận/huyện.");
        } finally {
          setLoading(false);
        }
      }
    },
    []
  );

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
          Alert.alert("Lỗi", "Không thể tải danh sách phường/xã.");
        } finally {
          setLoading(false);
        }
      }
    },
    []
  );

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
        Alert.alert("Lỗi", "Không thể tải danh sách địa chỉ.");
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleAddressChange = useCallback((addressId: number | null) => {
    setSelectedAddress(addressId);
  }, []);

  const handleAddressInputChange = useCallback((text: string) => {
    setAddress(text);
  }, []);

  // Update parent when any address field changes
  useEffect(() => {
    onAddressChange({
      address,
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
        onChangeText={handleAddressInputChange}
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
        onValueChange={handleAddressChange}
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
