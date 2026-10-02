/**
 * Typed API client for TN78 Backend API.
 * Reads base URL from NEXT_PUBLIC_API_URL and unwraps the {"error": {"code", "message"}} envelope.
 */

export interface ApiErrorDetail {
  code: string;
  message: string;
}

export interface ApiValidationError {
  msg: string;
  type?: string;
  loc?: (string | number)[];
}

export interface ApiErrorEnvelope {
  error?: ApiErrorDetail;
  detail?: string | ApiValidationError[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string;
  guestToken?: string;
}

const GUEST_TOKEN_KEY = "tn78_guest_token";
const AUTH_TOKEN_KEY = "tn78_auth_token";
const INDICATOR_COOKIE_NAME = "tn78_has_session";

export function getStoredGuestToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(GUEST_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredGuestToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_TOKEN_KEY, token);
  } catch {}
}

export function clearStoredGuestToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_TOKEN_KEY);
  } catch {}
}

/**
 * Checks whether an active authentication session exists.
 * Does NOT expose the sensitive JWT token to client-side JavaScript.
 */
export function getStoredAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    // 1. Check if non-sensitive session indicator cookie is set
    if (document.cookie.split(";").some((c) => c.trim().startsWith(`${INDICATOR_COOKIE_NAME}=`))) {
      return "cookie_session";
    }
    // 2. Migration check: if legacy token is still in localStorage, migrate it to HttpOnly cookie
    const legacyToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (legacyToken) {
      setStoredAuthToken(legacyToken);
      return "cookie_session";
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Stores authentication token in a secure HttpOnly cookie via the server session API.
 * Removes any legacy token from localStorage.
 */
export async function setStoredAuthToken(token: string): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ token }),
      credentials: "same-origin",
    });
  } catch (err) {
    console.error("Failed to store authentication session in HttpOnly cookie:", err);
  }
}

/**
 * Revokes session and deletes the HttpOnly authentication cookie.
 */
export async function clearStoredAuthToken(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    document.cookie = `${INDICATOR_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    await fetch("/api/auth/session", {
      method: "DELETE",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "same-origin",
    });
  } catch (err) {
    console.error("Failed to clear authentication session:", err);
  }
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (typeof window !== "undefined") {
    // If NEXT_PUBLIC_API_URL points to an external custom domain, use it; otherwise use the current browser origin (e.g. ngrok or LAN IP) so Next.js rewrites proxy to backend
    if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
      return envUrl;
    }
    return window.location.origin;
  }
  return envUrl || "http://127.0.0.1:8001";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, token, guestToken, headers: customHeaders, body, ...fetchOptions } = options;

  // Build URL with query parameters
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${getApiBaseUrl()}${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = new Headers(customHeaders);

  if (!headers.has("X-Requested-With")) {
    headers.set("X-Requested-With", "XMLHttpRequest");
  }

  const effectiveToken = token || getStoredAuthToken();
  if (effectiveToken && effectiveToken !== "cookie_session") {
    headers.set("Authorization", `Bearer ${effectiveToken}`);
  }

  const effectiveGuestToken = guestToken || getStoredGuestToken();
  if (effectiveGuestToken && !headers.has("X-Guest-Token")) {
    headers.set("X-Guest-Token", effectiveGuestToken);
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (typeof body === "object" && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
      requestBody = JSON.stringify(body);
    } else {
      requestBody = body as BodyInit;
    }
  }

  const response = await fetch(url.toString(), {
    ...fetchOptions,
    headers,
    body: requestBody,
    credentials: fetchOptions.credentials || "same-origin",
  });

  if (!response.ok) {
    let errorCode = "HTTP_ERROR";
    let errorMessage = `HTTP request failed with status ${response.status}: ${response.statusText}`;

    try {
      const data = (await response.json()) as Partial<ApiErrorEnvelope>;
      if (data && typeof data === "object") {
        if (data.error) {
          errorCode = data.error.code || errorCode;
          errorMessage = data.error.message || errorMessage;
        } else if (data.detail) {
          const detail = data.detail;
          if (typeof detail === "string") {
            errorMessage = detail;
          } else if (Array.isArray(detail)) {
            errorMessage = detail.map((d: ApiValidationError) => d.msg).join("; ");
          }
        }
      }
    } catch {
      // Body is not JSON or is empty, use status text defaults
    }

    throw new ApiError(response.status, errorCode, errorMessage);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

// ============================================================================
// CATALOG & INVENTORY DTOs AND FETCH FUNCTIONS (Phase 4)
// ============================================================================

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface ProductImageDto {
  id: string;
  url: string;
  display_order: number;
  alt_text?: string | null;
}

export interface ProductVariantDto {
  id: string;
  size: string;
  color: string;
  sku: string;
  price_override?: number | null;
  mrp_override?: number | null;
}

export interface ProductListItemDto {
  id: string;
  name: string;
  slug: string;
  category_slug: string;
  category_name: string;
  base_price: number;
  mrp?: number | null;
  gst_rate?: number;
  hsn_code?: string | null;
  is_active: boolean;
  created_at: string;
  images: ProductImageDto[];
  sizes?: string[];
}

export interface ProductDetailDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: CategoryDto;
  base_price: number;
  mrp?: number | null;
  gst_rate?: number;
  hsn_code?: string | null;
  is_active: boolean;
  created_at: string;
  variants: ProductVariantDto[];
  images: ProductImageDto[];
  average_rating?: number | null;
  review_count?: number;
}

export interface ProductListResponseDto {
  items: ProductListItemDto[];
  total: number;
  page: number;
  page_size: number;
}

export interface InventoryDto {
  variant_id: string;
  quantity: number;
  is_in_stock: boolean;
  updated_at: string;
}

export interface GetProductsParams {
  category?: string;
  min_price?: number;
  max_price?: number;
  size?: string;
  color?: string;
  sort?: string;
  page?: number;
  page_size?: number;
}

/**
 * Fetch all catalog categories.
 */
export async function getCategories(
  options?: RequestOptions
): Promise<CategoryDto[]> {
  return apiClient<CategoryDto[]>("/api/v1/catalog/categories", options);
}

/**
 * Fetch paginated products with optional category, price, size, color filters and sorting.
 */
export async function getProducts(
  params?: GetProductsParams,
  options?: RequestOptions
): Promise<ProductListResponseDto> {
  return apiClient<ProductListResponseDto>("/api/v1/catalog/products", {
    ...options,
    params: params as Record<string, string | number | boolean | undefined | null>,
  });
}

/**
 * Search products by query term.
 */
export async function searchProducts(
  q: string,
  params?: { page?: number; page_size?: number },
  options?: RequestOptions
): Promise<ProductListResponseDto> {
  return apiClient<ProductListResponseDto>("/api/v1/catalog/search", {
    ...options,
    params: { q, ...params },
  });
}

/**
 * Fetch detailed product by slug.
 */
export async function getProductBySlug(
  slug: string,
  options?: RequestOptions
): Promise<ProductDetailDto> {
  return apiClient<ProductDetailDto>(`/api/v1/catalog/products/${slug}`, options);
}

/**
 * Fetch stock level and status for a product variant.
 */
export async function getVariantInventory(
  variantId: string,
  options?: RequestOptions
): Promise<InventoryDto> {
  return apiClient<InventoryDto>(`/api/v1/inventory/variants/${variantId}`, options);
}

// ============================================================================
// WISHLIST DTOs & API METHODS (Phase 6)
// ============================================================================

export interface WishlistItemDto {
  id: string;
  product_id: string;
  variant_id?: string | null;
  product_name: string;
  product_slug: string;
  category_name: string;
  base_price: number;
  image_url?: string | null;
  created_at: string;
}

export interface WishlistResponseDto {
  items: WishlistItemDto[];
  total: number;
}

export async function getWishlist(
  options?: RequestOptions
): Promise<WishlistResponseDto> {
  return apiClient<WishlistResponseDto>("/api/v1/wishlist", options);
}

export async function addToWishlist(
  productId: string,
  variantId?: string,
  options?: RequestOptions
): Promise<WishlistItemDto> {
  return apiClient<WishlistItemDto>("/api/v1/wishlist", {
    ...options,
    method: "POST",
    body: { product_id: productId, variant_id: variantId || null },
  });
}

export async function removeFromWishlist(
  itemId: string,
  options?: RequestOptions
): Promise<void> {
  return apiClient<void>(`/api/v1/wishlist/${itemId}`, {
    ...options,
    method: "DELETE",
  });
}

export async function removeFromWishlistByProduct(
  productId: string,
  options?: RequestOptions
): Promise<void> {
  return apiClient<void>(`/api/v1/wishlist/product/${productId}`, {
    ...options,
    method: "DELETE",
  });
}

// ============================================================================
// CART DTOs & API METHODS (Phase 6)
// ============================================================================

export interface CartItemDto {
  id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  size: string;
  color: string;
  sku: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  image_url?: string | null;
  in_stock_quantity: number;
  customization_note?: string | null;
}

export interface CartDto {
  id: string;
  guest_token?: string | null;
  items: CartItemDto[];
  total_items: number;
  subtotal: number;
  updated_at: string;
}

export async function getCart(
  options?: RequestOptions
): Promise<CartDto> {
  const cart = await apiClient<CartDto>("/api/v1/cart", options);
  if (cart.guest_token) {
    setStoredGuestToken(cart.guest_token);
  }
  return cart;
}

export async function addToCart(
  variantId: string,
  quantity: number = 1,
  customizationNote?: string | null,
  options?: RequestOptions
): Promise<CartDto> {
  if (
    !variantId ||
    variantId.startsWith("00000000-0000-") ||
    variantId.startsWith("synthetic-") ||
    variantId.startsWith("mock-")
  ) {
    throw new Error("This piece is an Atelier preview silhouette and cannot be added to cart yet.");
  }
  const cart = await apiClient<CartDto>("/api/v1/cart/items", {
    ...options,
    method: "POST",
    body: {
      variant_id: variantId,
      quantity,
      customization_note: customizationNote || null,
    },
  });
  if (cart.guest_token) {
    setStoredGuestToken(cart.guest_token);
  }
  return cart;
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
  options?: RequestOptions
): Promise<CartDto> {
  const cart = await apiClient<CartDto>(`/api/v1/cart/items/${itemId}`, {
    ...options,
    method: "PATCH",
    body: { quantity },
  });
  if (cart.guest_token) {
    setStoredGuestToken(cart.guest_token);
  }
  return cart;
}

export async function removeCartItem(
  itemId: string,
  options?: RequestOptions
): Promise<CartDto> {
  const cart = await apiClient<CartDto>(`/api/v1/cart/items/${itemId}`, {
    ...options,
    method: "DELETE",
  });
  if (cart.guest_token) {
    setStoredGuestToken(cart.guest_token);
  }
  return cart;
}

export async function clearCart(
  options?: RequestOptions
): Promise<CartDto> {
  const cart = await apiClient<CartDto>("/api/v1/cart", {
    ...options,
    method: "DELETE",
  });
  return cart;
}

export async function mergeCart(
  guestToken: string,
  options?: RequestOptions
): Promise<CartDto> {
  const cart = await apiClient<CartDto>("/api/v1/cart/merge", {
    ...options,
    method: "POST",
    body: { guest_token: guestToken },
  });
  clearStoredGuestToken();
  return cart;
}

// ============================================================================
// SHIPPING & ADDRESSES DTOs & API METHODS (Phase 7)
// ============================================================================

export interface AddressDto {
  id: string;
  user_id?: string | null;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressCreateDto {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  is_default?: boolean;
}

export interface ShippingMethodDto {
  code: string;
  name: string;
  description: string;
  cost: number;
  estimated_days: string;
  is_free: boolean;
  zone_label?: string | null;
  location_predicted?: boolean;
}

export interface ShippingRatesConfigDto {
  local_tn_rate: number;
  south_zone_rate: number;
  pan_india_rate: number;
  express_rate: number;
  free_shipping_threshold: number;
}

export async function getSavedAddresses(
  options?: RequestOptions
): Promise<AddressDto[]> {
  return apiClient<AddressDto[]>("/api/v1/shipping/addresses", options);
}

export async function createSavedAddress(
  payload: AddressCreateDto,
  options?: RequestOptions
): Promise<AddressDto> {
  return apiClient<AddressDto>("/api/v1/shipping/addresses", {
    ...options,
    method: "POST",
    body: payload,
  });
}

export async function updateSavedAddress(
  id: string,
  payload: Partial<AddressCreateDto>,
  options?: RequestOptions
): Promise<AddressDto> {
  return apiClient<AddressDto>(`/api/v1/shipping/addresses/${id}`, {
    ...options,
    method: "PATCH",
    body: payload,
  });
}

export async function deleteSavedAddress(
  id: string,
  options?: RequestOptions
): Promise<void> {
  return apiClient<void>(`/api/v1/shipping/addresses/${id}`, {
    ...options,
    method: "DELETE",
  });
}

export async function getShippingMethods(
  subtotal: number = 0,
  pincode?: string,
  state?: string,
  options?: RequestOptions
): Promise<ShippingMethodDto[]> {
  let url = `/api/v1/shipping/methods?subtotal=${subtotal}`;
  if (pincode && pincode.trim()) {
    url += `&pincode=${encodeURIComponent(pincode.trim())}`;
  }
  if (state && state.trim()) {
    url += `&state=${encodeURIComponent(state.trim())}`;
  }
  return apiClient<ShippingMethodDto[]>(url, options);
}

export async function adminGetShippingRates(options?: RequestOptions): Promise<ShippingRatesConfigDto> {
  return apiClient<ShippingRatesConfigDto>("/api/v1/shipping/rates-config", options);
}

export async function adminUpdateShippingRates(
  rates: Partial<ShippingRatesConfigDto>,
  options?: RequestOptions
): Promise<ShippingRatesConfigDto> {
  return apiClient<ShippingRatesConfigDto>("/api/v1/shipping/rates-config", {
    ...options,
    method: "PUT",
    body: rates,
  });
}

// ============================================================================
// COUPONS DTOs & API METHODS (Phase 7)
// ============================================================================

export interface CouponValidateResponse {
  code: string;
  is_valid: boolean;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  discount_amount: number;
  message: string;
}

export async function validateCoupon(
  code: string,
  cartSubtotal: number,
  options?: RequestOptions
): Promise<CouponValidateResponse> {
  return apiClient<CouponValidateResponse>("/api/v1/coupons/validate", {
    ...options,
    method: "POST",
    body: { code, cart_subtotal: cartSubtotal },
  });
}

// ============================================================================
// CHECKOUT DRAFT & ORDER SUMMARY (Phase 7)
// ============================================================================

export interface CouponSummaryDto {
  code: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number;
  message: string;
}

export interface CheckoutSummaryDto {
  cart_id: string;
  items: CartItemDto[];
  total_items: number;
  subtotal: number;
  applied_coupon?: CouponSummaryDto | null;
  discount_amount: number;
  points_to_redeem?: number;
  points_discount_amount?: number;
  user_points_balance?: number | null;
  shipping_method?: ShippingMethodDto | null;
  shipping_cost: number;
  is_gift_package?: boolean;
  gift_package_fee?: number;
  gift_recipient_name?: string | null;
  gift_sender_name?: string | null;
  gift_message?: string | null;
  gift_hide_price?: boolean;
  total: number;
  shipping_address?: AddressDto | null;
  is_ready_for_payment: boolean;
}

export interface CartCheckoutUpdateDto {
  shipping_address_id?: string | null;
  guest_address?: AddressCreateDto | null;
  shipping_method_code?: string | null;
  coupon_code?: string | null;
  points_to_redeem?: number | null;
  is_gift_package?: boolean | null;
  gift_recipient_name?: string | null;
  gift_sender_name?: string | null;
  gift_message?: string | null;
  gift_hide_price?: boolean | null;
}

export async function getCheckoutSummary(
  options?: RequestOptions
): Promise<CheckoutSummaryDto> {
  return apiClient<CheckoutSummaryDto>("/api/v1/cart/checkout-summary", options);
}

export async function updateCheckout(
  payload: CartCheckoutUpdateDto,
  options?: RequestOptions
): Promise<CheckoutSummaryDto> {
  return apiClient<CheckoutSummaryDto>("/api/v1/cart/checkout", {
    ...options,
    method: "PATCH",
    body: payload,
  });
}

// ============================================================================
// PAYMENTS DTOs & API METHODS (Phase 8)
// ============================================================================

export interface PaymentCreateResponse {
  payment_id: string;
  gateway: string;
  gateway_order_id: string;
  amount: number;
  amount_subunits: number;
  currency: string;
  key_id: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
}

export interface PaymentVerifyRequest {
  gateway_order_id: string;
  gateway_payment_id: string;
  gateway_signature: string;
}

export interface PaymentVerifyResponse {
  payment_id: string;
  status: string;
  gateway_order_id: string;
  gateway_payment_id?: string | null;
  amount: number;
  currency: string;
  message: string;
  order_id?: string | null;
  order_number?: string | null;
}

export async function createPaymentOrder(
  options?: RequestOptions
): Promise<PaymentCreateResponse> {
  return apiClient<PaymentCreateResponse>("/api/v1/payments/create", {
    ...options,
    method: "POST",
  });
}

export async function verifyPayment(
  payload: PaymentVerifyRequest,
  options?: RequestOptions
): Promise<PaymentVerifyResponse> {
  return apiClient<PaymentVerifyResponse>("/api/v1/payments/verify", {
    ...options,
    method: "POST",
    body: payload,
  });
}

export interface PaymentUpiVerifyRequest {
  gateway_order_id: string;
  upi_utr: string;
  guest_email?: string;
}

export async function verifyUpiPayment(
  payload: PaymentUpiVerifyRequest,
  options?: RequestOptions
): Promise<PaymentVerifyResponse> {
  return apiClient<PaymentVerifyResponse>("/api/v1/payments/verify-upi", {
    ...options,
    method: "POST",
    body: payload,
  });
}

export async function getSandboxSignature(
  orderId: string,
  paymentId?: string,
  options?: RequestOptions
): Promise<PaymentVerifyRequest> {
  return apiClient<PaymentVerifyRequest>("/api/v1/payments/sandbox-signature", {
    ...options,
    method: "POST",
    body: {
      gateway_order_id: orderId,
      gateway_payment_id: paymentId,
    },
  });
}

// ============================================================================
// PHASE 9: ORDERS & POST-PURCHASE
// ============================================================================

export interface OrderItemOut {
  id: string;
  order_id: string;
  variant_id?: string | null;
  product_name_snapshot: string;
  product_slug_snapshot: string;
  variant_label_snapshot: string;
  image_url_snapshot?: string | null;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
  customization_note?: string | null;
}

export interface OrderPaymentOut {
  id: string;
  gateway: string;
  gateway_order_id: string;
  gateway_payment_id?: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface OrderOut {
  id: string;
  order_number: string;
  user_id?: string | null;
  guest_email?: string | null;
  status: string;
  subtotal: number;
  discount_amount: number;
  shipping_cost: number;
  total: number;
  points_redeemed?: number;
  points_discount_amount?: number;
  points_awarded?: number;
  coupon_code_snapshot?: string | null;
  shipping_method_snapshot?: string | null;
  courier_partner?: string | null;
  tracking_number?: string | null;
  estimated_delivery_date?: string | null;
  delivery_notes?: string | null;
  shipping_full_name: string;
  shipping_phone: string;
  shipping_line1: string;
  shipping_line2?: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  is_gift_package?: boolean;
  gift_package_fee?: number;
  gift_recipient_name?: string | null;
  gift_sender_name?: string | null;
  gift_message?: string | null;
  gift_hide_price?: boolean;
  created_at: string;
  updated_at: string;
  items: OrderItemOut[];
  payments: OrderPaymentOut[];
}

export async function lookupGuestOrder(
  orderNumber: string,
  email: string,
  options?: RequestOptions
): Promise<OrderOut> {
  const query = new URLSearchParams({
    order_number: orderNumber.trim().toUpperCase(),
    email: email.trim().toLowerCase(),
  });
  return apiClient<OrderOut>(`/api/v1/orders/lookup?${query.toString()}`, {
    ...options,
    method: "GET",
  });
}

export async function getMyOrders(
  options?: RequestOptions
): Promise<OrderOut[]> {
  return apiClient<OrderOut[]>("/api/v1/orders/me", {
    ...options,
    method: "GET",
  });
}

export async function getOrderByNumber(
  orderNumber: string,
  options?: RequestOptions
): Promise<OrderOut> {
  return apiClient<OrderOut>(`/api/v1/orders/${encodeURIComponent(orderNumber.trim())}`, {
    ...options,
    method: "GET",
  });
}

export function getOrderInvoicePdfUrl(orderNumber: string): string {
  return `${getApiBaseUrl()}/api/v1/orders/${encodeURIComponent(orderNumber.trim())}/invoice.pdf`;
}

export function getOrderDispatchSlipPdfUrl(orderNumber: string): string {
  return `${getApiBaseUrl()}/api/v1/orders/${encodeURIComponent(orderNumber.trim())}/dispatch-slip.pdf`;
}

// ============================================================================
// AUTH PROFILE & SESSION
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function loginUser(email: string, password: string): Promise<AuthTokens> {
  const res = await apiClient<AuthTokens>("/api/v1/auth/login", {
    method: "POST",
    body: { email, password },
  });
  if (res.access_token) {
    await setStoredAuthToken(res.access_token);
  }
  return res;
}

export async function getCurrentUser(options?: RequestOptions): Promise<UserProfile> {
  return apiClient<UserProfile>("/api/v1/auth/me", {
    ...options,
    method: "GET",
  });
}

// ============================================================================
// PHASE 10: ADMIN PORTAL APIS
// ============================================================================

export interface AdminVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  sku: string;
  price_override?: number | null;
  mrp_override?: number | null;
  stock_quantity: number;
}

export interface AdminVariantCreateInput {
  size: string;
  color: string;
  sku: string;
  price_override?: number | null;
  mrp_override?: number | null;
  initial_stock: number;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category_id: string;
  category_name?: string | null;
  category_slug?: string | null;
  base_price: number;
  mrp?: number | null;
  gst_rate?: number;
  hsn_code?: string | null;
  is_active: boolean;
  created_at: string;
  images: { id: string; url: string; display_order: number; alt_text?: string | null }[];
  variants: AdminVariant[];
}

export interface AdminProductCreateInput {
  name: string;
  slug?: string;
  description?: string;
  category_id: string;
  base_price: number;
  mrp?: number;
  gst_rate?: number;
  hsn_code?: string;
  is_active?: boolean;
  variants?: AdminVariantCreateInput[];
  images?: {
    url: string;
    alt_text?: string;
    display_order?: number;
  }[];
}

export interface AdminProductUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  category_id?: string;
  base_price?: number;
  mrp?: number;
  gst_rate?: number;
  hsn_code?: string;
  is_active?: boolean;
  variants?: AdminVariantCreateInput[];
}

export interface AdminInventoryItem {
  variant_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  is_in_stock: boolean;
  updated_at: string;
}

export interface AdminOrderListResponse {
  items: OrderOut[];
  total: number;
  page: number;
  page_size: number;
}

export async function adminGetProducts(options?: RequestOptions): Promise<AdminProduct[]> {
  return apiClient<AdminProduct[]>("/api/v1/admin/products", {
    ...options,
    method: "GET",
  });
}

export async function adminGetProduct(id: string, options?: RequestOptions): Promise<AdminProduct> {
  return apiClient<AdminProduct>(`/api/v1/admin/products/${id}`, {
    ...options,
    method: "GET",
  });
}

export async function adminCreateProduct(
  data: AdminProductCreateInput,
  options?: RequestOptions
): Promise<AdminProduct> {
  return apiClient<AdminProduct>("/api/v1/admin/products", {
    ...options,
    method: "POST",
    body: data,
  });
}

export async function adminUpdateProduct(
  id: string,
  data: AdminProductUpdateInput,
  options?: RequestOptions
): Promise<AdminProduct> {
  return apiClient<AdminProduct>(`/api/v1/admin/products/${id}`, {
    ...options,
    method: "PATCH",
    body: data,
  });
}

export async function adminDeleteProduct(
  id: string,
  options?: RequestOptions
): Promise<AdminProduct> {
  return apiClient<AdminProduct>(`/api/v1/admin/products/${id}`, {
    ...options,
    method: "DELETE",
  });
}

export async function adminGetCategories(options?: RequestOptions): Promise<CategoryDto[]> {
  return apiClient<CategoryDto[]>("/api/v1/catalog/categories", {
    ...options,
    method: "GET",
  });
}

export async function adminCreateCategory(
  data: { name: string; slug?: string; display_order?: number },
  options?: RequestOptions
): Promise<CategoryDto> {
  return apiClient<CategoryDto>("/api/v1/admin/categories", {
    ...options,
    method: "POST",
    body: data,
  });
}

export async function adminGetInventory(options?: RequestOptions): Promise<AdminInventoryItem[]> {
  return apiClient<AdminInventoryItem[]>("/api/v1/admin/inventory", {
    ...options,
    method: "GET",
  });
}

export async function adminUpdateInventory(
  variantId: string,
  quantity: number,
  options?: RequestOptions
): Promise<AdminInventoryItem> {
  return apiClient<AdminInventoryItem>(`/api/v1/admin/inventory/${variantId}`, {
    ...options,
    method: "PATCH",
    body: { quantity },
  });
}

export async function adminGetOrders(
  params?: { status?: string; page?: number; page_size?: number },
  options?: RequestOptions
): Promise<AdminOrderListResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") query.append("status", params.status);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.page_size) query.append("page_size", params.page_size.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient<AdminOrderListResponse>(`/api/v1/admin/orders${qs}`, {
    ...options,
    method: "GET",
  });
}

export async function adminGetOrder(
  orderNumber: string,
  options?: RequestOptions
): Promise<OrderOut> {
  return apiClient<OrderOut>(`/api/v1/admin/orders/${encodeURIComponent(orderNumber.trim())}`, {
    ...options,
    method: "GET",
  });
}

export async function adminUpdateOrderStatus(
  orderNumber: string,
  payload: string | { 
    status: string; 
    courier_partner?: string; 
    tracking_number?: string;
    estimated_delivery_date?: string | null;
    delivery_notes?: string | null;
  },
  options?: RequestOptions
): Promise<OrderOut> {
  const body = typeof payload === "string" ? { status: payload } : payload;
  return apiClient<OrderOut>(
    `/api/v1/admin/orders/${encodeURIComponent(orderNumber.trim())}/status`,
    {
      ...options,
      method: "PATCH",
      body,
    }
  );
}

// ============================================================================
// COUPON MANAGEMENT DTOs & API METHODS
// ============================================================================

export interface AdminCouponDto {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value?: number | null;
  max_uses?: number | null;
  times_used: number;
  valid_from: string;
  valid_until?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminCouponCreateInput {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_value?: number;
  max_uses?: number;
  valid_until?: string;
  is_active?: boolean;
}

export interface AdminCouponUpdateInput {
  code?: string;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  min_order_value?: number;
  max_uses?: number;
  valid_until?: string;
  is_active?: boolean;
}

export async function adminGetCoupons(options?: RequestOptions): Promise<AdminCouponDto[]> {
  return apiClient<AdminCouponDto[]>("/api/v1/admin/coupons", {
    ...options,
    method: "GET",
  });
}

export async function adminCreateCoupon(
  payload: AdminCouponCreateInput,
  options?: RequestOptions
): Promise<AdminCouponDto> {
  return apiClient<AdminCouponDto>("/api/v1/admin/coupons", {
    ...options,
    method: "POST",
    body: payload,
  });
}

export async function adminUpdateCoupon(
  id: string,
  payload: AdminCouponUpdateInput,
  options?: RequestOptions
): Promise<AdminCouponDto> {
  return apiClient<AdminCouponDto>(`/api/v1/admin/coupons/${id}`, {
    ...options,
    method: "PATCH",
    body: payload,
  });
}

export async function adminDeleteCoupon(
  id: string,
  options?: RequestOptions
): Promise<void> {
  return apiClient<void>(`/api/v1/admin/coupons/${id}`, {
    ...options,
    method: "DELETE",
  });
}

// ============================================================================
// NOTIFICATIONS DTOs & API METHODS (Phase 11)
// ============================================================================

export interface NotificationLogDto {
  id: string;
  user_id?: string | null;
  recipient_email: string;
  notification_type: "order_confirmed" | "order_status_changed" | "payment_failed";
  related_order_id?: string | null;
  order_number?: string | null;
  subject: string;
  status: "sent" | "failed";
  error_message?: string | null;
  sent_at: string;
}

export interface NotificationListResponse {
  items: NotificationLogDto[];
  total: number;
  page: number;
  page_size: number;
}

export async function adminGetNotifications(
  params?: {
    status?: string;
    notification_type?: string;
    page?: number;
    page_size?: number;
  },
  options?: RequestOptions
): Promise<NotificationListResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") query.append("status", params.status);
  if (params?.notification_type && params.notification_type !== "all") {
    query.append("notification_type", params.notification_type);
  }
  if (params?.page) query.append("page", params.page.toString());
  if (params?.page_size) query.append("page_size", params.page_size.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient<NotificationListResponse>(`/api/v1/admin/notifications${qs}`, {
    ...options,
    method: "GET",
  });
}

// ============================================================================
// REWARDS, REVIEWS & RETURNS DTOs & API METHODS (Phase 12)
// ============================================================================

export interface RewardsTransactionDto {
  id: string;
  order_id?: string | null;
  points_change: number;
  reason: string;
  created_at: string;
}

export interface RewardsBalanceDto {
  points_balance: number;
  equivalent_value_inr: number;
  recent_transactions: RewardsTransactionDto[];
}

export async function getRewardsBalance(
  options?: RequestOptions
): Promise<RewardsBalanceDto> {
  return apiClient<RewardsBalanceDto>("/api/v1/rewards/balance", {
    ...options,
    method: "GET",
  });
}

export interface ReviewDto {
  id: string;
  user_id: string;
  user_name?: string | null;
  product_id: string;
  order_item_id?: string | null;
  rating: number;
  title?: string | null;
  review_text: string;
  is_verified_purchase: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface ReviewCreateDto {
  product_id: string;
  rating: number;
  title?: string | null;
  review_text: string;
}

export interface ReviewEligibilityDto {
  is_eligible: boolean;
  product_id: string;
  order_item_id?: string | null;
  message: string;
}

export async function getProductReviews(
  slug: string,
  options?: RequestOptions
): Promise<ReviewDto[]> {
  return apiClient<ReviewDto[]>(
    `/api/v1/catalog/products/${encodeURIComponent(slug)}/reviews`,
    options
  );
}

export async function checkReviewEligibility(
  productId: string,
  options?: RequestOptions
): Promise<ReviewEligibilityDto> {
  return apiClient<ReviewEligibilityDto>(
    `/api/v1/reviews/eligibility/${productId}`,
    options
  );
}

export async function submitReview(
  data: ReviewCreateDto,
  options?: RequestOptions
): Promise<ReviewDto> {
  return apiClient<ReviewDto>("/api/v1/reviews", {
    ...options,
    method: "POST",
    body: data,
  });
}

export interface AdminReviewListResponse {
  items: ReviewDto[];
  total: number;
  page: number;
  page_size: number;
}

export async function adminGetReviews(
  params?: { status?: string; page?: number; page_size?: number },
  options?: RequestOptions
): Promise<AdminReviewListResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") query.append("status", params.status);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.page_size) query.append("page_size", params.page_size.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient<AdminReviewListResponse>(`/api/v1/admin/reviews${qs}`, {
    ...options,
    method: "GET",
  });
}

export async function adminModerateReview(
  reviewId: string,
  status: "approved" | "rejected",
  options?: RequestOptions
): Promise<ReviewDto> {
  return apiClient<ReviewDto>(`/api/v1/admin/reviews/${reviewId}/status`, {
    ...options,
    method: "PATCH",
    body: { status },
  });
}

export interface ReturnRequestDto {
  id: string;
  order_item_id: string;
  order_id: string;
  order_number?: string | null;
  product_name?: string | null;
  variant_label?: string | null;
  unit_price?: number | null;
  quantity?: number | null;
  user_id: string;
  user_email?: string | null;
  reason: string;
  status: "requested" | "approved" | "rejected" | "refunded";
  admin_notes?: string | null;
  requested_at: string;
  resolved_at?: string | null;
}

export interface ReturnCreateDto {
  order_item_id: string;
  reason: string;
}

export interface AdminReturnListResponse {
  items: ReturnRequestDto[];
  total: number;
  page: number;
  page_size: number;
}

export async function getUserReturns(
  options?: RequestOptions
): Promise<ReturnRequestDto[]> {
  return apiClient<ReturnRequestDto[]>("/api/v1/returns", {
    ...options,
    method: "GET",
  });
}

export async function submitReturnRequest(
  data: ReturnCreateDto,
  options?: RequestOptions
): Promise<ReturnRequestDto> {
  return apiClient<ReturnRequestDto>("/api/v1/returns", {
    ...options,
    method: "POST",
    body: data,
  });
}

export async function adminGetReturns(
  params?: { status?: string; page?: number; page_size?: number },
  options?: RequestOptions
): Promise<AdminReturnListResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== "all") query.append("status", params.status);
  if (params?.page) query.append("page", params.page.toString());
  if (params?.page_size) query.append("page_size", params.page_size.toString());

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient<AdminReturnListResponse>(`/api/v1/admin/returns${qs}`, {
    ...options,
    method: "GET",
  });
}

export async function adminModerateReturn(
  returnId: string,
  status: "approved" | "rejected" | "refunded",
  adminNotes?: string,
  options?: RequestOptions
): Promise<ReturnRequestDto> {
  return apiClient<ReturnRequestDto>(`/api/v1/admin/returns/${returnId}/status`, {
    ...options,
    method: "PATCH",
    body: {
      status,
      admin_notes: adminNotes,
    },
  });
}

// ============================================================================
// SHIPPING & DISPATCH TIMER
// ============================================================================

export interface DispatchStatusDto {
  server_time_ist: string;
  cut_off_time_ist: string;
  is_same_day_dispatch_active: boolean;
  seconds_until_cut_off: number;
  dispatch_window_label: string;
  estimated_delivery_date: string;
  hub_name: string;
  courier_partners: string[];
}

export interface PincodeCheckDto {
  pincode: string;
  city: string;
  state: string;
  is_serviceable: boolean;
  express_air_available: boolean;
  estimated_days: string;
  estimated_delivery_date: string;
  cod_available: boolean;
  message: string;
}

export async function getDispatchStatus(
  options?: RequestOptions
): Promise<DispatchStatusDto> {
  return apiClient<DispatchStatusDto>("/api/v1/shipping/dispatch-status", {
    ...options,
    method: "GET",
  });
}

export async function checkPincodeServiceability(
  pincode: string,
  options?: RequestOptions
): Promise<PincodeCheckDto> {
  const clean = pincode.trim();
  return apiClient<PincodeCheckDto>(`/api/v1/shipping/pincode-check?pincode=${encodeURIComponent(clean)}`, {
    ...options,
    method: "GET",
  });
}

// ============================================================================
// CUSTOMER AUTHENTICATION & SESSION MANAGEMENT
// ============================================================================

export type UserOutDto = UserProfile;
export type TokenPairDto = AuthTokens;

export interface CustomerRegisterDto {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface CustomerLoginDto {
  email: string;
  password: string;
}

/**
 * Sign in customer, persist access token, and merge guest cart
 */
export async function loginCustomer(
  credentials: CustomerLoginDto,
  options?: RequestOptions
): Promise<TokenPairDto> {
  const tokens = await apiClient<TokenPairDto>("/api/v1/auth/login", {
    ...options,
    method: "POST",
    body: credentials,
  });

  if (tokens?.access_token) {
    await setStoredAuthToken(tokens.access_token);

    // If guest cart exists, merge it into the newly authenticated account
    const guestToken = getStoredGuestToken();
    if (guestToken) {
      try {
        await mergeCart(guestToken, { token: tokens.access_token });
      } catch (mergeErr) {
        console.warn("Could not merge guest cart into account:", mergeErr);
      }
    }
  }

  return tokens;
}

/**
 * Register a new customer and immediately sign in
 */
export async function registerCustomer(
  payload: CustomerRegisterDto,
  options?: RequestOptions
): Promise<TokenPairDto> {
  await apiClient<UserProfile>("/api/v1/auth/register", {
    ...options,
    method: "POST",
    body: {
      email: payload.email,
      full_name: payload.full_name,
      password: payload.password,
      phone: payload.phone || undefined,
    },
  });

  // Automatically sign in upon successful registration
  return loginCustomer(
    { email: payload.email, password: payload.password },
    options
  );
}

/**
 * Clear customer session and auth token
 */
export function logoutCustomer(): void {
  clearStoredAuthToken();
}

