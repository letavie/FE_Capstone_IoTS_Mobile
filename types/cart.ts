// types/cart.ts

// Represents an item in the cart
export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    imageUrl: string | null;
    price: number;
    totalPrice: number;
    quantity: number;
    isSelected: boolean;
    productType: number; // Matches ProductType (e.g., 1 for IOT_DEVICE, 2 for COMBO)
    numberOfIncludedLabs: number; // For combos
  }
  
  // Represents a lab included in a combo
  export interface Lab {
    id: number;
    labName: string;
    labSummary: string;
    price: number;
    imageUrl: string | null;
  }
  
  // Response structure for fetchCarts and fetchCartsPreview
  export interface CartResponse {
    data: CartItem[];
    totalCount: number;
  }
  
  // Response structure for getCartTotalInformation
  export interface TotalInformation {
    totalSelectedItemsPrice: number;
  }