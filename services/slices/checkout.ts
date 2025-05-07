import api from "../api/apiConfig";
import { Alert } from "react-native";

interface CreateOrderParams {
  address: string;
  contactNumber: string;
  notes?: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  addressId?: number;
  deliver_option: string;
}

interface ApiResponse {
  data: {
    paymentUrl: string;
    orderId?: string;
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

interface OrderResponse {
  paymentUrl: string;
  orderId?: string;
  message?: string;
}

interface CartPreviewResponse {
  data: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: CartItem[]; // Mảng sản phẩm thực sự nằm ở đây
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

interface CartItem {
  id: number;
  parentId: number | null;
  imageUrl: string;
  productId: number;
  createdBy: number;
  createdByStore: string;
  productType: number;
  productName: string;
  productSummary: string;
  quantity: number;
  price: number;
  numberOfIncludedLabs: number;
  totalPrice: number;
  isSelected: boolean;
}
interface TotalPriceData {
  totalCartItemsAmount: number;
  totalSelectedItemsPrice: number;
}

interface TotalPriceResponse {
  data: TotalPriceData;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

export const createOrder = async (
  params: CreateOrderParams
): Promise<OrderResponse> => {
  try {
    const response = await api.post(`/api/Order/create-order-by-mobile`, {
      address: params.address,
      contactNumber: params.contactNumber,
      notes: params.notes,
      provinceId: params.provinceId,
      districtId: params.districtId,
      wardId: params.wardId,
      addressId: params.addressId,
      deliver_option: params.deliver_option,
    });

    console.log("API Response:", JSON.stringify(response.data, null, 2)); // Log full response

    if (!response.data?.data?.paymentUrl) {
      throw new Error(
        response.data?.message || "Không nhận được URL thanh toán từ server"
      );
    }

    return {
      paymentUrl: response.data.data.paymentUrl,
      orderId: response.data.data.orderId,
      message: response.data.message,
    };
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(
      error.response?.data?.message || error.message || "Không thể tạo đơn hàng"
    );
  }
};
export const checkSuccessOrder = async (urlResponse: string): Promise<any> => {
  try {
    const response = await api.get(
      `/api/Order/check-success-order?urlResponse=${encodeURIComponent(
        urlResponse
      )}`
    );

    if (!response.data) {
      throw new Error("Không nhận được dữ liệu từ server");
    }

    return response.data;
  } catch (error: any) {
    console.error("Error checking order status:", error);
    throw new Error(
      error.response?.data?.message || "Không thể kiểm tra trạng thái đơn hàng"
    );
  }
};

export const fetchCartsPreview = async (): Promise<CartPreviewResponse> => {
  try {
    const response = await api.get("/api/cart/get-preview-cart-order");
    return response.data;
  } catch (error: any) {
    Alert.alert("Error", error);
    throw new Error(error || "Không thể tải danh sách giỏ hàng");
  }
};

export const fetchGetTotalPrice = async (): Promise<TotalPriceResponse> => {
  try {
    const response = await api.get("api/cart/get-cart-total-information");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching total price:", error);
    throw new Error(
      error.response?.data?.message || "Không thể tải tổng giá đơn hàng"
    );
  }
};

export const getFeeShip = async (params: {
  provinceId: number;
  districtId: number;
  wardId: number;
  addressId?: number;
  address: string;
  deliver_option: string;
}): Promise<number> => {
  try {
    const response = await api.post("/api/Shipping/get-fee", params); // Dùng POST
    console.log("getFeeShip response:", response.data[0]?.fee); // Debug API response
    return response.data[0]?.fee || 0;
  } catch (error: any) {
    console.error("Error fetching shipping fee:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch shipping fee"
    );
  }
};
