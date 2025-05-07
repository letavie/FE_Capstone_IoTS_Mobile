import api from "../api/apiConfig";

// Interfaces for Store Details
export interface StoreAttachment {
  id: number;
  storeId: number;
  createdDate: string;
  createdBy: number;
  imageUrl: string;
}

export interface StoreDetails {
  id: number;
  name: string;
  description: string;
  contactNumber: string;
  address: string;
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardId: number;
  wardName: string;
  addressId: number;
  addressName: string;
  summary: string;
  ownerId: number;
  imageUrl: string;
  createdDate: string;
  createdBy: number | null;
  updatedDate: string;
  updatedBy: number;
  storeAttachments: StoreAttachment[];
  storeNumberOfProducts: number;
  numberOfFeedbacks: number;
}

// Interfaces for Paginated Products
export interface DeviceIot {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  createdDate: string;
}

export interface Combo {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  createdDate: string;
}

export interface PaginatedStoreProducts {
  storeId: number;
  storeName: string;
  ownerId: number;
  ownerName: string;
  devicesIot: DeviceIot[];
  combos: Combo[];
  totalDevices: number;
  totalCombos: number;
}

// Fetch store details by storeId
export const fetchStoreDetailsById = async (storeId: string) => {
  try {
    const response = await api.get(
      `/api/store/get-store-details-by-store-id/${storeId}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

// Fetch paginated products by storeId
export const fetchPaginatedProductsByStoreId = async ({
  storeId,
  pageIndex,
  pageSize,
  searchKeyword = "",
  startFilterDate,
  endFilterDate,
}: {
  storeId: string;
  pageIndex: number;
  pageSize: number;
  searchKeyword?: string;
  startFilterDate?: string;
  endFilterDate?: string;
}) => {
  try {
    const response = await api.post(
      `/api/store/get-pagination-product-by-stores-id`,
      {
        pageIndex,
        pageSize,
        searchKeyword: searchKeyword || "",
        ...(startFilterDate && { startFilterDate }),
        ...(endFilterDate && { endFilterDate }),
      },
      {
        params: { storeId },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
