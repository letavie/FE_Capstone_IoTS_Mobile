import api from './../api/apiConfig';

export interface Notification {
  id: number;
  title: string;
  content: string;
  entityId: number;
  entityType: number;
  createdDate: string; // Changed from createdAt
  receiverId: number;
  metadata: any;
  isRead: boolean;
}

export const fetchAllNotifications = async (searchKeyword = '') => {
  try {
    const response = await api.get(
      `/api/notification/get-all?searchKeyword=${searchKeyword}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const countUnreadNotifications = async () => {
  try {
    const response = await api.get('/api/notification/count-not-read-notification');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    return { success: true };
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};