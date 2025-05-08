// types/LabTypes.ts

// Interface for pagination parameters (already defined in labApi.ts, but included here for completeness)
export interface PaginationParams {
  pageIndex: number;
  pageSize: number;
  searchKeyword?: string;
}

// Interface for a single lab item (from /api/lab/user-management/get-lab-pagination)
export interface Lab {
  id: number;
  title: string;
  summary: string;
  comboId: number;
  comboNavigationName: string;
  storeId: number;
  storeName: string;
  applicationSerialNumber: string;
  imageUrl: string;
  price: number;
  hasBeenAddToCartAlready: boolean;
  hasBeenBought: boolean;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
  rating: number;
  status: number;
}

// Interface for the paginated lab response (from /api/lab/user-management/get-lab-pagination)
export interface PaginatedLabResponse {
  data: {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    data: Lab[];
  };
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

// Interface for detailed lab information (from /api/lab/get-lab-information/{labId})
export interface LabDetails {
  id: number;
  title: string;
  summary: string;
  comboId: number;
  comboNavigationName: string;
  description: string;
  remark: string | null;
  serialNumber: string;
  applicationSerialNumber: string;
  imageUrl: string;
  previewVideoUrl: string;
  price: number;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  createdByNavigationEmail: string;
  updatedBy: number;
  rating: number;
  status: number;
  hasAbilityToViewPlaylist: boolean;
}

// Interface for the lab details response
export interface LabDetailsResponse {
  data: LabDetails;
  isSuccess: boolean;
  statusCode: number;
  message: string;
}

// Interface for a single playlist item (from /api/lab/get-lab-playlist/{labId})
export interface LabPlaylistItem {
  id: number;
  labId: number;
  title: string;
  description: string;
  videoUrl: string;
  orderIndex: number;
  createdDate: string;
  updatedDate: string;
}

// Interface for the lab playlist response
export interface LabPlaylistItemResponse {
  data: LabPlaylistItem[];
  isSuccess: boolean;
  statusCode: number;
  message: string;
}
