// ============ DOMAIN TYPES ============

export type Role = "CUSTOMER" | "ADMIN";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";
export type DiscountType = "PERCENTAGE" | "FIXED";

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface ProductSpec {
  id: string;
  name: string;
  value: string;
  group: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  parentId: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  sku: string | null;
  brand: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
  specs?: ProductSpec[];
  // Computed from reviews
  avgRating?: number;
  reviewCount?: number;
  orderCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  adminReply: string | null;
  isAutoReply: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  productId: string;
  user?: { name: string | null; image: string | null };
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId: string | null;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCost: number;
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  notes: string | null;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string | null;
  type: DiscountType;
  value: number;
  minOrder: number;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date | null;
}

// ============ CART TYPES ============

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ============ WISHLIST TYPES ============

export interface WishlistState {
  items: string[]; // product IDs
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

// ============ COMPARE TYPES ============

export interface CompareState {
  items: string[]; // product IDs (max 4)
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearAll: () => void;
}

// ============ API RESPONSE TYPES ============

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============ FILTER TYPES ============

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  inStock?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}
