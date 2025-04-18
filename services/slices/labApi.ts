import api from './../api/apiConfig';

// Interface for pagination parameters
interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  searchKeyword?: string;
}

export const fetchLabMemberPagination = async ({
  comboId,
  pageIndex,
  pageSize,
  searchKeyword = '',
}: {
  comboId: number;
} & PaginationParams) => {
  try {
    const response = await api.post(
      `/api/lab/member/get-lab-pagination/${comboId}`,
      {
        pageIndex,
        pageSize,
        searchKeyword,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const fetchLabStorePagination = async ({
  pageIndex,
  pageSize,
  searchKeyword = '',
}: PaginationParams) => {
  try {
    const response = await api.post(
      '/api/lab/store-management/get-lab-pagination',
      {
        pageIndex,
        pageSize,
        searchKeyword,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const fetchLabCustomerPagination = async ({
  pageIndex,
  pageSize,
  searchKeyword = '',
}: PaginationParams) => {
  try {
    const response = await api.post(
      '/api/lab/user-management/get-lab-pagination',
      {
        pageIndex,
        pageSize,
        searchKeyword,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const fetchLabPlaylist = async (labId: number) => {
  try {
    const response = await api.get(`/api/lab/get-lab-playlist/${labId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const fetchLabInformation = async (labId: number) => {
  try {
    const response = await api.get(`/api/lab/get-lab-information/${labId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};