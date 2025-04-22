import api from '../api/apiConfig';
import { Alert } from 'react-native';

// Interface for pagination parameters (used in fetchHistoryOrder and fetchHistoryOrderStoreTrainer)
interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  searchKeyword?: string;
  startFilterDate?: string | null;
  endFilterDate?: string | null;
  statusFilter?: number;
}

// Interface for the changeCancelledStatus payload
interface CancelOrderPayload {
  contactNumber: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface FeedbackData {
  orderId: number;
  sellerId: number;
  sellerRole: number;
  feedbackList: Array<{
    orderItemId: number;
    comment: string;
    rating: number;
  }>;
}
// Fetch history orders for customers
export const fetchHistoryOrder = async ({
  pageIndex,
  pageSize,
  searchKeyword = '',
  startFilterDate = null,
  endFilterDate = null,
  statusFilter,
}: PaginationParams) => {
  try {
    const response = await api.post(
      '/api/Order/customer/get-pagination',
      {
        pageIndex,
        pageSize,
        searchKeyword,
        startFilterDate,
        endFilterDate,
      },
      {
        params: { orderItemStatusFilter: statusFilter },
      }
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch customer order history.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Fetch history orders for store trainers
export const fetchHistoryOrderStoreTrainer = async ({
  pageIndex,
  pageSize,
  searchKeyword = '',
  startFilterDate = null,
  endFilterDate = null,
  statusFilter,
}: PaginationParams) => {
  try {
    const response = await api.post(
      '/api/Order/store-trainer/get-pagination',
      {
        pageIndex,
        pageSize,
        searchKeyword,
        startFilterDate,
        endFilterDate,
      },
      {
        params: { orderItemStatusFilter: statusFilter },
      }
    );
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch store trainer order history.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Change order status to "Packing"
export const changePackingStatus = async ({
  orderId,
  orderProductInfo,
}: {
  orderId: number;
  orderProductInfo: any;
}) => {
  try {
    const response = await api.post(
      `/api/Order/order-status/packing/${orderId}`,
      { orderProductInfo }
    );
    Alert.alert('Success', response.data.message || 'Order status updated to Packing.');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status to Packing.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Change order status to "Delivering"
export const changeDeliveringStatus = async ({ orderId }: { orderId: number }) => {
  try {
    const response = await api.post(`/api/Order/order-status/delivering/${orderId}`);
    Alert.alert('Success', response.data.message || 'Order status updated to Delivering.');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status to Delivering.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Change order status to "Pending Feedback"
export const changeFeedbackStatus = async ({
  orderId,
  sellerId,
}: {
  orderId: number;
  sellerId: number;
}) => {
  try {
    const response = await api.post(
      `/api/Order/order-status/pending-to-feedback/${orderId}`,
      null,
      {
        params: { sellerId },
      }
    );
    Alert.alert('Success', response.data.message || 'Order status updated to Pending Feedback.');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status to Pending Feedback.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Change order status to "Success"
export const changeSuccessOrderStatus = async ({ orderId }: { orderId: number }) => {
  try {
    const response = await api.post(`/api/Order/order-status/success-order/${orderId}`);
    Alert.alert('Success', response.data.message || 'Order status updated to Success.');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status to Success.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Change order status to "Cancelled" (with bank details for refund)
export const changeCancelledStatus = async ({
  orderId,
  contactNumber,
  accountName,
  accountNumber,
  bankName,
}: {
  orderId: number;
} & CancelOrderPayload) => {
  try {
    const response = await api.post(`/api/Order/order-status/cancelled/${orderId}`, {
      contactNumber,
      accountName,
      accountNumber,
      bankName,
    });
    Alert.alert('Success', response.data.message || 'Order status updated to Cancelled.');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status to Cancelled.';
    Alert.alert('Warning', message);
    throw message;
  }
};

// Change order status to "Cancelled" for cash payment
export const changeCancelledCashPayment = async ({ orderId }: { orderId: number }) => {
  try {
    const response = await api.post(`/api/Order/order-status/cash-payment/cancelled/${orderId}`);
    Alert.alert('Success', response.data.message || 'Order status updated to Cancelled (Cash Payment).');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to update order status to Cancelled (Cash Payment).';
    Alert.alert('Warning', message);
    throw message;
  }
};

// Get print label for an order (downloadable PDF)
export const getPrintLabel = async ({ trackingId }: { trackingId: string }) => {
  try {
    const response = await api.get(`/api/ghtk/print-label/${trackingId}-download`, {
      responseType: 'blob',
    });

    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `shipping-label-${trackingId}.pdf`;
    Alert.alert('Success', 'Successfully received order label.');
    return { blob: response.data, filename };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to retrieve shipping label.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Get preview of print label for an order
export const getPreviewPrintLabel = async ({ trackingId }: { trackingId: string }) => {
  try {
    const response = await api.get(`/api/ghtk/print-label/${trackingId}`, {
      responseType: 'blob',
    });
    return { blob: response.data };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to preview shipping label.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Get tracking information from GHTK
export const getTrackingGhtk = async ({ trackingId }: { trackingId: string }) => {
  try {
    const response = await api.get(`/api/ghtk/${trackingId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to retrieve tracking information.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Fetch feedback history
export const fetchFeedbackHistory = async ({
  pageIndex,
  pageSize,
  searchKeyword = '',
  startFilterDate = null,
  endFilterDate = null,
  statusFilter,
}: PaginationParams) => {
  try {
    const response = await api.post('/api/feedback/product/get-pagination', {
      pageIndex,
      pageSize,
      searchKeyword,
      startFilterDate,
      endFilterDate,
      statusFilter,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch feedback history.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Create feedback
export const createFeedback = async (feedbackData: FeedbackData) => {
  try {
    const response = await api.post('/api/feedback/create', feedbackData);
    Alert.alert('Success', response.data.message || 'Feedback created successfully.');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to create feedback.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Fetch activity log
export const fetchActivityLog = async ({
  userId,
  pageIndex,
  pageSize,
  searchKeyword = '',
  startFilterDate = null,
  endFilterDate = null,
  statusFilter,
}: { userId: number } & PaginationParams) => {
  try {
    const response = await api.post(`/api/activity-log/get-pagination-activity-log/${userId}`, {
      pageIndex,
      pageSize,
      searchKeyword,
      startFilterDate,
      endFilterDate,
      statusFilter,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch activity log.';
    Alert.alert('Error', message);
    throw message;
  }
};

// Fetch reports
export const fetchReports = async ({
  pageIndex,
  pageSize,
  searchKeyword = '',
  startFilterDate = null,
  endFilterDate = null,
  statusFilter,
}: PaginationParams) => {
  try {
    const response = await api.post('/api/report/get-pagination', {
      pageIndex,
      pageSize,
      searchKeyword,
      startFilterDate,
      endFilterDate,
      statusFilter,
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch reports.';
    Alert.alert('Error', message);
    throw message;
  }
};