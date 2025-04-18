// services/slices/cartApi.ts
import api from '../api/apiConfig';
import { Alert } from 'react-native';
// Định nghĩa các giá trị productType
const ProductType = {
  IOT_DEVICE: 1,
  COMBO: 2,
  LAB: 3,
};

// Lấy danh sách giỏ hàng
const fetchCarts = async ({
  pageIndex = 0,
  pageSize = 100,
  searchKeyword = '',
  startFilterDate = null,
  endFilterDate = null,
}: {
  pageIndex?: number;
  pageSize?: number;
  searchKeyword?: string;
  startFilterDate?: string | null;
  endFilterDate?: string | null;
}): Promise<{ data: any[]; totalCount: number }> => {
  try {
    const response = await api.post('/api/cart/get-pagination', {
      pageIndex,
      pageSize,
      searchKeyword,
      startFilterDate,
      endFilterDate,
    });
    return response.data.data;
  } catch (error: any) {
    const message = error.message || 'Failed to fetch cart items.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
const addToCart = async ({
  productId,
  productType,
  quantity,
}: {
  productId: number;
  productType: number;
  quantity: number;
}): Promise<any> => {
  try {
    const response = await api.post('/api/cart/add-to-cart', {
      productId,
      productType,
      quantity,
    });
    Alert.alert('Success', 'Item added to cart.');
    return response.data;
  } catch (error: any) {
    const message = error.message || 'Failed to add item to cart.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartQuantity = async ({
  cartId,
  quantity,
}: {
  cartId: number;
  quantity: number;
}): Promise<any> => {
  try {
    const response = await api.put('/api/cart/update-cart-quantity', {
      cartId,
      quantity,
    });
    return response.data;
  } catch (error: any) {
    const message = error.message || 'Failed to update cart quantity.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const deleteCartItem = async ({ cartId }: { cartId: number }): Promise<any> => {
  try {
    const response = await api.delete(`/api/cart/remove-cart-item/${cartId}`);
    Alert.alert('Success', 'Item removed from cart.');
    return response.data;
  } catch (error: any) {
    const message = error.message || 'Failed to remove item from cart.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Chọn sản phẩm trong giỏ hàng
const selectCartItem = async ({ cartId }: { cartId: number }): Promise<any> => {
  try {
    const response = await api.post(`/api/cart/select-cart-item/${cartId}`);
    return response.data;
  } catch (error: any) {
    const message = error.message || 'Failed to select cart item.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Bỏ chọn sản phẩm trong giỏ hàng
const unselectCartItem = async ({ cartId }: { cartId: number }): Promise<any> => {
  try {
    const response = await api.post(`/api/cart/unselect-cart-item/${cartId}`);
    return response.data;
  } catch (error: any) {
    const message = error.message || 'Failed to unselect cart item.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Lấy tổng giá trị giỏ hàng
const getCartTotalInformation = async (): Promise<{ totalSelectedItemsPrice: number }> => {
  try {
    const response = await api.get('/api/cart/get-cart-total-information');
    return response.data.data;
  } catch (error: any) {
    const message = error.message || 'Failed to fetch cart total.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Lấy danh sách lab của combo
const fetchComboIncludedLabs = async ({ cartId }: { cartId: number }): Promise<any[]> => {
  try {
    const response = await api.get(`/api/cart/get-all-combo-included-labs/${cartId}`);
    return response.data.data;
  } catch (error: any) {
    const message = error.message || 'Failed to fetch included labs.';
    Alert.alert('Error', message);
    throw error;
  }
};

// Lấy thông tin preview giỏ hàng
const fetchCartsPreview = async (): Promise<{ data: any[]; totalCount: number }> => {
  try {
    const response = await api.get('/api/cart/get-preview-cart-order');
    return response.data.data;
  } catch (error: any) {
    const message = error.message || 'Failed to fetch cart preview.';
    Alert.alert('Error', message);
    throw error;
  }
};

export {
  fetchCarts,
  addToCart,
  updateCartQuantity,
  deleteCartItem,
  selectCartItem,
  unselectCartItem,
  getCartTotalInformation,
  fetchComboIncludedLabs,
  fetchCartsPreview,
  ProductType,
};