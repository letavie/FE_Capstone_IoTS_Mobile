import api from './../api/apiConfig';

// Định nghĩa các kiểu dữ liệu (Types)
export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  searchKeyword: string;
  storeFilterId?: number;
  categoryFilterId?: number;
  deviceTypeFilter?: number;
}

export interface IotDevice {
  id: number;
  deviceType: number;
  deviceTypeLabel: string;
  name: string;
  summary: string;
  storeId: number;
  categoryId: number;
  categoryName: string;
  storeNavigationName: string;
  storeNavigationImageUrl: string;
  quantity: number;
  price: number;
  imageUrl: string;
  isActive: number;
  secondHandPrice: number;
  secondhandQualityPercent: number;
  rating: number;
  warrantyMonth: number;
}

export interface IotDeviceDetail {
  id: number;
  name: string;
  deviceType: number;
  summary: string;
  description: string;
  weight: number;
  categoryId: number;
  manufacturer: string;
  model: string;
  serialNumber: string;
  applicationSerialNumber: string;
  specifications: string;
  notes: string;
  rating: number;
  price: number;
  quantity: number;
  storeId: number;
  createdDate: string;
  createdBy: number;
  updatedDate: string;
  updatedBy: number;
  isActive: number;
  imageUrl: string;
  warrantyMonth: number;
  category: {
    id: number;
    label: string;
    description: string;
    createdBy: number;
    createdDate: string;
    isActive: number;
  };
  storeInfo: {
    id: number;
    name: string;
    description: string;
    contactNumber: string;
    address: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    addressId: number;
    summary: string;
    ownerId: number;
    imageUrl: string;
    createdDate: string;
    updatedDate: string;
    updatedBy: number;
    storeNumberOfProducts: number;
    numberOfFeedbacks: number;
  };
  attachments: Array<{
    id: number;
    imageUrl: string;
    metaData: string;
  }>;
  deviceSpecificationsList?: Array<{
    name: string;
    deviceSpecificationItemsList: Array<{
      specificationProperty: string;
      specificationValue: string;
    }>;
  }>;
  secondHandPrice: number;
  secondhandQualityPercent: number;
  isEdit: boolean;
}

export interface Combo {
  id: number;
  name: string;
  storeId: number;
  storeNavigationName: string;
  summary: string;
  applicationSerialNumber: string;
  quantity: number;
  imageUrl: string;
  price: number;
  createdDate: string;
  updateDate: string;
  createdBy: number;
  updatedBy: number;
  description: string; 
  specifications: string; 
  notes: string; 
  attachmentsList: { id: number; imageUrl: string; metaData: string }[];
  deviceComboList: { deviceName: string; deviceSummary: string; amount: number; imageUrl: string; iotDeviceId: number; originalPrice: number }[];
  rating: number;
  isActive: number;
}

export interface ComboDetail {
  id: number;
  name: string;
  storeId: number;
  quantity: number;
  storeNavigationName: string;
  summary: string;
  description: string;
  specifications: string;
  notes: string;
  serialNumber: string;
  applicationSerialNumber: string;
  imageUrl: string;
  price: number;
  weight: number;
  createdDate: string;
  updateDate: string;
  createdBy: number;
  updatedBy: number;
  rating: number;
  deviceComboList: Array<{
    deviceComboId: number;
    iotDeviceId: number;
    deviceName: string;
    deviceSummary: string;
    amount: number;
    originalPrice: number;
    imageUrl: string;
  }>;
  attachmentsList: Array<{
    id: number;
    imageUrl: string;
    metaData: string;
  }>;
  storeInfo: {
    id: number;
    name: string;
    description: string;
    contactNumber: string;
    address: string;
    provinceId: number;
    districtId: number;
    wardId: number;
    addressId: number;
    summary: string;
    ownerId: number;
    imageUrl: string;
    createdDate: string;
    updatedDate: string;
    updatedBy: number;
    storeNumberOfProducts: number;
    numberOfFeedbacks: number;
  };
  isActive: number;
}

export interface MaterialCategory {
  id: number;
  label: string;
  createdDate: string;
  description: string;
  isActive: number;
  createdBy: number;
  createdByEmail: string;
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

interface PaginatedResponse<T> {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}

// API để lấy danh sách IotDevice với phân trang
export const getIotDevices = async (params: PaginationParams): Promise<PaginatedResponse<IotDevice>> => {
  const response = await api.post<ApiResponse<PaginatedResponse<IotDevice>>>('/api/iot-device/get-pagination', params);
  return response.data.data;
};

// API để lấy chi tiết IotDevice theo ID
export const getIotDeviceDetails = async (id: number): Promise<IotDeviceDetail> => {
  const response = await api.get<ApiResponse<IotDeviceDetail>>(`/api/iot-device/get-iot-device-details-by-id/${id}`);
  return response.data.data;
};

// API để lấy danh sách Combo với phân trang
export const getCombos = async (params: PaginationParams): Promise<PaginatedResponse<Combo>> => {
  const response = await api.post<ApiResponse<PaginatedResponse<Combo>>>('/api/combo/get-pagination', params);
  return response.data.data;
};

// API để lấy chi tiết Combo theo ID
export const getComboDetails = async (comboId: number): Promise<ComboDetail> => {
  const response = await api.get<ApiResponse<ComboDetail>>(`/api/combo/get-combo-details/${comboId}`);
  return response.data.data;
};

// API để lấy danh sách MaterialCategory
export const getMaterialCategories = async (): Promise<MaterialCategory[]> => {
  const response = await api.get<ApiResponse<MaterialCategory[]>>('/api/material-category/get-all-material-categories');
  return response.data.data;
};

export const addToCart = async (data: { productId: string; productType: number; quantity: number }) => {
    const response = await api.post(`/api/cart/add-to-cart`, data);
    return response.data;
  };

  export const getFeedbackHistory = async (params: any) => {
    const response = await api.post(`/api/feedback/product/get-pagination`, params);
    return response.data;
  };