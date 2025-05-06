import api from "../api/apiConfig";

// Lấy danh sách tỉnh/thành phố
export const fetchProvinces = async (): Promise<any> => {
  try {
    const response = await api.get("/api/location/provinces");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching provinces:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch provinces"
    );
  }
};

// Lấy danh sách quận/huyện theo tỉnh
export const fetchDistricts = async (provinceId: number): Promise<any> => {
  try {
    const response = await api.get("/api/location/districts", {
      params: { provinceId },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching districts:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch districts"
    );
  }
};

// Lấy danh sách phường/xã theo quận/huyện
export const fetchWards = async (prodistrictId: number): Promise<any> => {
  try {
    const response = await api.get("/api/location/wards", {
      params: { prodistrictId },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching wards:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch wards");
  }
};

// Lấy địa chỉ theo phường/xã
export const fetchAddressByProwardId = async (
  prowardId: number
): Promise<any> => {
  try {
    const response = await api.get("/api/location/address", {
      params: { prowardId },
    });
    console.log("API Response for prowardId", prowardId, ":", response.data); // Debug API response
    return response.data;
  } catch (error: any) {
    console.error("Error fetching address by prowardId:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch address by prowardId"
    );
  }
};
