import api from './../api/apiConfig';

export const fetchAllMaterialCategories = async (searchKeyword = '') => {
  try {
    const response = await api.get(
      `/api/material-category/get-all-material-categories?searchKeyword=${searchKeyword}`
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const fetchPaginatedMaterialCategories = async ({
  pageIndex,
  pageSize,
  searchKeyword = '',
  statusFilter,
  startFilterDate,
  endFilterDate,
}: {
  pageIndex: number;
  pageSize: number;
  searchKeyword?: string;
  statusFilter?: number;
  startFilterDate?: string;
  endFilterDate?: string;
}) => {
  try {
    const response = await api.post(
      `/api/material-category/get-pagination`,
      {
        pageIndex,
        pageSize,
        searchKeyword: searchKeyword || '',
        ...(startFilterDate && { startFilterDate }),
        ...(endFilterDate && { endFilterDate }),
      },
      {
        params: { statusFilter },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const fetchMaterialCategoryById = async (id: string) => {
  try {
    const response = await api.get(`/api/material-category/${id}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};