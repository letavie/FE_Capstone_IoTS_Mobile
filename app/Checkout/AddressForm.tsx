// // import React, { useEffect, useState, useCallback } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ActivityIndicator,
// //   TextInput,
// // } from "react-native";
// // import Toast from "react-native-toast-message";
// // import { Picker } from "@react-native-picker/picker";
// // import {
// //   fetchProvinces,
// //   fetchDistricts,
// //   fetchWards,
// //   fetchAddressByProwardId,
// // } from "@/services/slices/address";

// // interface AddressFormProps {
// //   onAddressChange: (data: {
// //     address: string;
// //     ids: {
// //       provinceId: number | null;
// //       districtId: number | null;
// //       wardId: number | null;
// //       addressId: number | null;
// //     };
// //   }) => void;
// //   defaultValues?: {
// //     provinceId?: number;
// //     districtId?: number;
// //     wardId?: number;
// //     addressId?: number;
// //     address?: string;
// //   };
// // }

// // const AddressForm: React.FC<AddressFormProps> = ({
// //   onAddressChange,
// //   defaultValues,
// // }) => {
// //   const [provinces, setProvinces] = useState<any[]>([]);
// //   const [districts, setDistricts] = useState<any[]>([]);
// //   const [wards, setWards] = useState<any[]>([]);
// //   const [addresses, setAddresses] = useState<any[]>([]);
// //   const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
// //   const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
// //   const [selectedWard, setSelectedWard] = useState<number | null>(null);
// //   const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
// //   const [address, setAddress] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   // Load tỉnh/thành phố khi component mount
// //   useEffect(() => {
// //     const loadProvinces = async () => {
// //       setLoading(true);
// //       try {
// //         const data = await fetchProvinces();
// //         setProvinces(data || []);
// //       } catch (error) {
// //         Toast.show({
// //           type: "error",
// //           text1: "Lỗi tải dữ liệu",
// //           text2: "Không thể tải danh sách tỉnh/thành phố",
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     loadProvinces();
// //   }, []);

// //   // Xử lý giá trị mặc định
// //   useEffect(() => {
// //     if (defaultValues) {
// //       if (defaultValues.address) {
// //         setAddress(defaultValues.address);
// //       }
// //       if (defaultValues.provinceId) {
// //         setSelectedProvince(defaultValues.provinceId);
// //       }
// //       if (defaultValues.districtId) {
// //         setSelectedDistrict(defaultValues.districtId);
// //       }
// //       if (defaultValues.wardId) {
// //         setSelectedWard(defaultValues.wardId);
// //       }
// //       if (defaultValues.addressId) {
// //         setSelectedAddress(defaultValues.addressId);
// //       }
// //     }
// //   }, [defaultValues]);

// //   // Hàm xử lý khi chọn tỉnh/thành phố
// //   const handleProvinceChange = useCallback(
// //     async (provinceId: number | null) => {
// //       setSelectedProvince(provinceId);
// //       setSelectedDistrict(null);
// //       setSelectedWard(null);
// //       setSelectedAddress(null);
// //       setDistricts([]);
// //       setWards([]);
// //       setAddresses([]);

// //       if (provinceId) {
// //         setLoading(true);
// //         try {
// //           const data = await fetchDistricts(provinceId);
// //           setDistricts(data || []);
// //         } catch (error) {
// //           Toast.show({
// //             type: "error",
// //             text1: "Lỗi tải dữ liệu",
// //             text2: "Không thể tải danh sách quận/huyện",
// //           });
// //         } finally {
// //           setLoading(false);
// //         }
// //       }
// //     },
// //     []
// //   );

// //   // Hàm xử lý khi chọn quận/huyện
// //   const handleDistrictChange = useCallback(
// //     async (districtId: number | null) => {
// //       setSelectedDistrict(districtId);
// //       setSelectedWard(null);
// //       setSelectedAddress(null);
// //       setWards([]);
// //       setAddresses([]);

// //       if (districtId) {
// //         setLoading(true);
// //         try {
// //           const data = await fetchWards(districtId);
// //           setWards(data || []);
// //         } catch (error) {
// //           Toast.show({
// //             type: "error",
// //             text1: "Lỗi tải dữ liệu",
// //             text2: "Không thể tải danh sách phường/xã",
// //           });
// //         } finally {
// //           setLoading(false);
// //         }
// //       }
// //     },
// //     []
// //   );

// //   // Hàm xử lý khi chọn phường/xã
// //   const handleWardChange = useCallback(async (wardId: number | null) => {
// //     setSelectedWard(wardId);
// //     setSelectedAddress(null);
// //     setAddresses([]);

// //     if (wardId) {
// //       setLoading(true);
// //       try {
// //         const data = await fetchAddressByProwardId(wardId);
// //         setAddresses(data || []);
// //       } catch (error) {
// //         Toast.show({
// //           type: "error",
// //           text1: "Lỗi tải dữ liệu",
// //           text2: "Không thể tải danh sách địa chỉ",
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   }, []);

// //   // Hàm xử lý khi nhập địa chỉ - chỉ cập nhật state, không gọi callback
// //   const handleAddressInputChange = useCallback((text: string) => {
// //     setAddress(text);
// //   }, []);

// //   // Gọi callback khi có thay đổi về dropdown
// //   useEffect(() => {
// //     onAddressChange({
// //       address, // Giữ nguyên giá trị địa chỉ đã nhập
// //       ids: {
// //         provinceId: selectedProvince,
// //         districtId: selectedDistrict,
// //         wardId: selectedWard,
// //         addressId: selectedAddress,
// //       },
// //     });
// //   }, [
// //     selectedProvince,
// //     selectedDistrict,
// //     selectedWard,
// //     selectedAddress,
// //     onAddressChange,
// //   ]);

// //   return (
// //     <View style={styles.container}>
// //       {loading && <ActivityIndicator size="large" color="#007AFF" />}
// //       <Text style={styles.label}>Số nhà, tên đường</Text>
// //       <TextInput
// //         style={styles.input}
// //         placeholder="Ví dụ: 57/4"
// //         value={address}
// //         onChangeText={handleAddressInputChange}
// //         autoCapitalize="none"
// //       />

// //       <Text style={styles.label}>Tỉnh/Thành phố</Text>
// //       <View style={styles.pickerContainer}>
// //         <Picker
// //           selectedValue={selectedProvince}
// //           onValueChange={(itemValue) => handleProvinceChange(itemValue)}
// //         >
// //           <Picker.Item label="Chọn Tỉnh/Thành phố" value={null} />
// //           {provinces.map((p) => (
// //             <Picker.Item key={p.id} label={p.name} value={p.id} />
// //           ))}
// //         </Picker>
// //       </View>

// //       <Text style={styles.label}>Quận/Huyện</Text>
// //       <View style={styles.pickerContainer}>
// //         <Picker
// //           selectedValue={selectedDistrict}
// //           onValueChange={(itemValue) => {
// //             setSelectedDistrict(itemValue);
// //             handleDistrictChange(itemValue);
// //           }}
// //           enabled={!!selectedProvince && districts.length > 0}
// //         >
// //           <Picker.Item label="Chọn Quận/Huyện" value={null} />
// //           {districts.map((d) => (
// //             <Picker.Item key={d.id} label={d.name} value={d.id} />
// //           ))}
// //         </Picker>
// //       </View>

// //       <Text style={styles.label}>Phường/Xã</Text>
// //       <View style={styles.pickerContainer}>
// //         <Picker
// //           selectedValue={selectedWard}
// //           onValueChange={(itemValue) => {
// //             setSelectedWard(itemValue);
// //             handleWardChange(itemValue);
// //           }}
// //           enabled={!!selectedDistrict && wards.length > 0}
// //         >
// //           <Picker.Item label="Chọn Phường/Xã" value={null} />
// //           {wards.map((w) => (
// //             <Picker.Item key={w.id} label={w.name} value={w.id} />
// //           ))}
// //         </Picker>
// //       </View>

// //       <Text style={styles.label}>Thôn/Xóm (Tùy chọn)</Text>
// //       <View style={styles.pickerContainer}>
// //         <Picker
// //           selectedValue={selectedAddress}
// //           onValueChange={(itemValue) => setSelectedAddress(itemValue)}
// //           enabled={!!selectedWard && addresses.length > 0}
// //         >
// //           <Picker.Item label="Chọn Thôn/Xóm (nếu có)" value={null} />
// //           {addresses.map((a) => (
// //             <Picker.Item key={a.id} label={a.name} value={a.id} />
// //           ))}
// //         </Picker>
// //       </View>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     padding: 16,
// //   },
// //   picker: {
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     borderRadius: 8,
// //     marginBottom: 12,
// //     backgroundColor: "#fff",
// //   },
// //   label: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     marginBottom: 8,
// //     marginTop: 8,
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     borderRadius: 8,
// //     padding: 12,
// //     fontSize: 16,
// //     backgroundColor: "#fff",
// //     marginBottom: 12,
// //   },
// //   pickerContainer: {
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     borderRadius: 8,
// //     marginBottom: 12,
// //     backgroundColor: "#fff",
// //   },
// // });

// // export default AddressForm;
// import React, { useEffect, useState, useCallback } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import Toast from "react-native-toast-message";
// import { Menu, TextInput } from "react-native-paper";
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
//   const [visibleProvince, setVisibleProvince] = useState(false);
//   const [visibleDistrict, setVisibleDistrict] = useState(false);
//   const [visibleWard, setVisibleWard] = useState(false);
//   const [visibleAddress, setVisibleAddress] = useState(false);

//   // Load tỉnh/thành phố khi component mount
//   useEffect(() => {
//     const loadProvinces = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchProvinces();
//         setProvinces(data || []);
//       } catch (error) {
//         Toast.show({
//           type: "error",
//           text1: "Lỗi tải dữ liệu",
//           text2: "Không thể tải danh sách tỉnh/thành phố",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProvinces();
//   }, []);

//   // Xử lý giá trị mặc định
//   useEffect(() => {
//     if (defaultValues) {
//       if (defaultValues.address) {
//         setAddress(defaultValues.address);
//       }
//       if (defaultValues.provinceId) {
//         setSelectedProvince(defaultValues.provinceId);
//       }
//       if (defaultValues.districtId) {
//         setSelectedDistrict(defaultValues.districtId);
//       }
//       if (defaultValues.wardId) {
//         setSelectedWard(defaultValues.wardId);
//       }
//       if (defaultValues.addressId) {
//         setSelectedAddress(defaultValues.addressId);
//       }
//     }
//   }, [defaultValues]);

//   // Hàm xử lý khi chọn tỉnh/thành phố
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
//             text1: "Lỗi tải dữ liệu",
//             text2: "Không thể tải danh sách quận/huyện",
//           });
//         } finally {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   // Hàm xử lý khi chọn quận/huyện
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
//             text1: "Lỗi tải dữ liệu",
//             text2: "Không thể tải danh sách phường/xã",
//           });
//         } finally {
//           setLoading(false);
//         }
//       }
//     },
//     []
//   );

//   // Hàm xử lý khi chọn phường/xã
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
//           text1: "Lỗi tải dữ liệu",
//           text2: "Không thể tải danh sách địa chỉ",
//         });
//       } finally {
//         setLoading(false);
//       }
//     }
//   }, []);

//   // Hàm xử lý khi nhập địa chỉ
//   const handleAddressInputChange = useCallback((text: string) => {
//     setAddress(text);
//   }, []);

//   // Gọi callback khi có thay đổi
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
//     address,
//     onAddressChange,
//   ]);

//   // Hàm helper để lấy tên từ id
//   const getSelectedName = (items: any[], id: number | null) => {
//     return id ? items.find((item) => item.id === id)?.name || "" : "";
//   };

//   return (
//     <View style={styles.container}>
//       {loading && <ActivityIndicator size="large" color="#007AFF" />}

//       <Text style={styles.label}>Số nhà, tên đường</Text>
//       <TextInput
//         mode="outlined"
//         style={styles.input}
//         placeholder="Ví dụ: 57/4"
//         value={address}
//         onChangeText={handleAddressInputChange}
//         autoCapitalize="none"
//       />

//       <Text style={styles.label}>Tỉnh/Thành phố</Text>
//       <Menu
//         visible={visibleProvince}
//         onDismiss={() => setVisibleProvince(false)}
//         anchor={
//           <TextInput
//             mode="outlined"
//             value={getSelectedName(provinces, selectedProvince)}
//             placeholder="Chọn Tỉnh/Thành phố"
//             onFocus={() => setVisibleProvince(true)}
//             right={<TextInput.Icon icon="menu-down" />}
//             editable={false}
//             style={styles.input}
//           />
//         }
//       >
//         {provinces.map((p) => (
//           <Menu.Item
//             key={p.id}
//             onPress={() => {
//               handleProvinceChange(p.id);
//               setVisibleProvince(false);
//             }}
//             title={p.name}
//           />
//         ))}
//       </Menu>

//       <Text style={styles.label}>Quận/Huyện</Text>
//       <Menu
//         visible={visibleDistrict}
//         onDismiss={() => setVisibleDistrict(false)}
//         anchor={
//           <TextInput
//             mode="outlined"
//             value={getSelectedName(districts, selectedDistrict)}
//             placeholder="Chọn Quận/Huyện"
//             onFocus={() => setVisibleDistrict(true)}
//             right={<TextInput.Icon icon="menu-down" />}
//             editable={false}
//             style={styles.input}
//             disabled={!selectedProvince || districts.length === 0}
//           />
//         }
//       >
//         {districts.map((d) => (
//           <Menu.Item
//             key={d.id}
//             onPress={() => {
//               setSelectedDistrict(d.id);
//               handleDistrictChange(d.id);
//               setVisibleDistrict(false);
//             }}
//             title={d.name}
//           />
//         ))}
//       </Menu>

//       <Text style={styles.label}>Phường/Xã</Text>
//       <Menu
//         visible={visibleWard}
//         onDismiss={() => setVisibleWard(false)}
//         anchor={
//           <TextInput
//             mode="outlined"
//             value={getSelectedName(wards, selectedWard)}
//             placeholder="Chọn Phường/Xã"
//             onFocus={() => setVisibleWard(true)}
//             right={<TextInput.Icon icon="menu-down" />}
//             editable={false}
//             style={styles.input}
//             disabled={!selectedDistrict || wards.length === 0}
//           />
//         }
//       >
//         {wards.map((w) => (
//           <Menu.Item
//             key={w.id}
//             onPress={() => {
//               setSelectedWard(w.id);
//               handleWardChange(w.id);
//               setVisibleWard(false);
//             }}
//             title={w.name}
//           />
//         ))}
//       </Menu>

//       <Text style={styles.label}>Thôn/Xóm (Tùy chọn)</Text>
//       <Menu
//         visible={visibleAddress}
//         onDismiss={() => setVisibleAddress(false)}
//         anchor={
//           <TextInput
//             mode="outlined"
//             value={getSelectedName(addresses, selectedAddress)}
//             placeholder="Chọn Thôn/Xóm (nếu có)"
//             onFocus={() => setVisibleAddress(true)}
//             right={<TextInput.Icon icon="menu-down" />}
//             editable={false}
//             style={styles.input}
//             disabled={!selectedWard || addresses.length === 0}
//           />
//         }
//       >
//         {addresses.map((a) => (
//           <Menu.Item
//             key={a.id}
//             onPress={() => {
//               setSelectedAddress(a.id);
//               setVisibleAddress(false);
//             }}
//             title={a.name}
//           />
//         ))}
//       </Menu>
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
//     marginBottom: 12,
//     backgroundColor: "white",
//   },
// });

// export default AddressForm;
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { Menu, TextInput } from "react-native-paper";
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
  const [visibleProvince, setVisibleProvince] = useState(false);
  const [visibleDistrict, setVisibleDistrict] = useState(false);
  const [visibleWard, setVisibleWard] = useState(false);
  const [visibleAddress, setVisibleAddress] = useState(false);

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

  // Hàm xử lý khi nhập địa chỉ
  const handleAddressInputChange = useCallback((text: string) => {
    setAddress(text);
  }, []);

  // Gọi callback khi có thay đổi
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
    address,
    onAddressChange,
  ]);

  // Hàm helper để lấy tên từ id
  const getSelectedName = (items: any[], id: number | null) => {
    return id ? items.find((item) => item.id === id)?.name || "Chọn" : "Chọn";
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      <Text style={styles.label}>Số nhà, tên đường</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        placeholder="Ví dụ: 57/4"
        value={address}
        onChangeText={handleAddressInputChange}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Tỉnh/Thành phố</Text>
      <Menu
        visible={visibleProvince}
        onDismiss={() => setVisibleProvince(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setVisibleProvince(true)}
            style={styles.touchableInput}
          >
            <Text style={styles.inputText}>
              {getSelectedName(provinces, selectedProvince)}
            </Text>
          </TouchableOpacity>
        }
      >
        {provinces.map((p) => (
          <Menu.Item
            key={p.id}
            onPress={() => {
              handleProvinceChange(p.id);
              setVisibleProvince(false);
            }}
            title={<Text>{p.name}</Text>}
          />
        ))}
      </Menu>

      <Text style={styles.label}>Quận/Huyện</Text>
      <Menu
        visible={visibleDistrict}
        onDismiss={() => setVisibleDistrict(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setVisibleDistrict(true)}
            style={[
              styles.touchableInput,
              (!selectedProvince || districts.length === 0) && styles.disabled,
            ]}
            disabled={!selectedProvince || districts.length === 0}
          >
            <Text style={styles.inputText}>
              {getSelectedName(districts, selectedDistrict)}
            </Text>
          </TouchableOpacity>
        }
      >
        {districts.map((d) => (
          <Menu.Item
            key={d.id}
            onPress={() => {
              setSelectedDistrict(d.id);
              handleDistrictChange(d.id);
              setVisibleDistrict(false);
            }}
            title={<Text>{d.name}</Text>}
          />
        ))}
      </Menu>

      <Text style={styles.label}>Phường/Xã</Text>
      <Menu
        visible={visibleWard}
        onDismiss={() => setVisibleWard(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setVisibleWard(true)}
            style={[
              styles.touchableInput,
              (!selectedDistrict || wards.length === 0) && styles.disabled,
            ]}
            disabled={!selectedDistrict || wards.length === 0}
          >
            <Text style={styles.inputText}>
              {getSelectedName(wards, selectedWard)}
            </Text>
          </TouchableOpacity>
        }
      >
        {wards.map((w) => (
          <Menu.Item
            key={w.id}
            onPress={() => {
              setSelectedWard(w.id);
              handleWardChange(w.id);
              setVisibleWard(false);
            }}
            title={<Text>{w.name}</Text>}
          />
        ))}
      </Menu>

      <Text style={styles.label}>Thôn/Xóm (Tùy chọn)</Text>
      <Menu
        visible={visibleAddress}
        onDismiss={() => setVisibleAddress(false)}
        anchor={
          <TouchableOpacity
            onPress={() => setVisibleAddress(true)}
            style={[
              styles.touchableInput,
              (!selectedWard || addresses.length === 0) && styles.disabled,
            ]}
            disabled={!selectedWard || addresses.length === 0}
          >
            <Text style={styles.inputText}>
              {getSelectedName(addresses, selectedAddress)}
            </Text>
          </TouchableOpacity>
        }
      >
        {addresses.map((a) => (
          <Menu.Item
            key={a.id}
            onPress={() => {
              setSelectedAddress(a.id);
              setVisibleAddress(false);
            }}
            title={<Text>{a.name}</Text>}
          />
        ))}
      </Menu>
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
    marginBottom: 12,
    backgroundColor: "white",
    height: 50,
  },
  touchableInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "white",
  },
  inputText: {
    fontSize: 16,
    color: "#000",
  },
  disabled: {
    backgroundColor: "#f0f0f0",
    opacity: 0.5,
  },
});

export default AddressForm;
