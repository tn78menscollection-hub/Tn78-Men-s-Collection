"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CartDto,
  WishlistItemDto,
  addToCart as apiAddToCart,
  addToWishlist as apiAddToWishlist,
  getCart as apiGetCart,
  getStoredAuthToken,
  getWishlist as apiGetWishlist,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
  removeFromWishlist as apiRemoveFromWishlist,
  removeFromWishlistByProduct as apiRemoveWishlistByProduct,
  updateCartItem as apiUpdateCartItem,
} from "@/lib/api";

interface CartWishlistContextType {
  cart: CartDto | null;
  cartCount: number;
  wishlist: WishlistItemDto[];
  wishlistCount: number;
  wishlistIds: Set<string>;
  isLoadingCart: boolean;
  isLoadingWishlist: boolean;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  addToCart: (variantId: string, quantity?: number, customizationNote?: string | null) => Promise<CartDto>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<CartDto>;
  removeFromCart: (itemId: string) => Promise<CartDto>;
  clearCart: () => Promise<void>;
  toggleWishlist: (productId: string, variantId?: string) => Promise<boolean>;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  removeFromWishlist: (itemId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

const CartWishlistContext = createContext<CartWishlistContextType | undefined>(
  undefined
);

export function CartWishlistProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItemDto[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const openCartDrawer = useCallback(() => setIsCartDrawerOpen(true), []);
  const closeCartDrawer = useCallback(() => setIsCartDrawerOpen(false), []);

  // Compute total quantity of items in cart
  const cartCount = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Memoized wishlist count for granular subscriptions
  const wishlistCount = useMemo(() => wishlist.length, [wishlist.length]);

  // Set of wishlisted product IDs for fast O(1) lookup
  const wishlistIds = useMemo(() => {
    return new Set(wishlist.map((item) => item.product_id));
  }, [wishlist]);

  // Refresh cart from server
  const refreshCart = useCallback(async () => {
    setIsLoadingCart(true);
    try {
      const data = await apiGetCart();
      setCart(data);
    } catch (err) {
      console.warn("Failed to load active cart:", err);
    } finally {
      setIsLoadingCart(false);
    }
  }, []);

  // Refresh wishlist from server
  const refreshWishlist = useCallback(async () => {
    const token = getStoredAuthToken();
    if (!token) return;

    setIsLoadingWishlist(true);
    try {
      const data = await apiGetWishlist();
      setWishlist(data.items);
    } catch (err) {
      console.warn("Failed to load wishlist:", err);
    } finally {
      setIsLoadingWishlist(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  // Add item to cart
  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1, customizationNote?: string | null) => {
      const updatedCart = await apiAddToCart(variantId, quantity, customizationNote);
      setCart(updatedCart);
      return updatedCart;
    },
    []
  );

  // Update quantity of line item
  const updateCartQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      const updatedCart = await apiUpdateCartItem(itemId, quantity);
      setCart(updatedCart);
      return updatedCart;
    },
    []
  );

  // Remove line item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    const updatedCart = await apiRemoveCartItem(itemId);
    setCart(updatedCart);
    return updatedCart;
  }, []);

  // Clear entire cart
  const clearCart = useCallback(async () => {
    await apiClearCart();
    setCart(null);
  }, []);

  // Remove single item from wishlist by item ID
  const removeFromWishlist = useCallback(
    async (itemId: string) => {
      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
      try {
        await apiRemoveFromWishlist(itemId);
      } catch {
        refreshWishlist();
      }
    },
    [refreshWishlist]
  );

  // Toggle wishlist state for a product
  const toggleWishlist = useCallback(
    async (productId: string, variantId?: string): Promise<boolean> => {
      const isCurrentlySaved = wishlistIds.has(productId);

      if (isCurrentlySaved) {
        // Optimistically remove from state
        setWishlist((prev) => prev.filter((item) => item.product_id !== productId));
        try {
          await apiRemoveWishlistByProduct(productId);
        } catch {
          // Revert if request failed
          refreshWishlist();
        }
        return false;
      } else {
        try {
          const newItem = await apiAddToWishlist(productId, variantId);
          setWishlist((prev) => [newItem, ...prev]);
          return true;
        } catch {
          // If unauthenticated, we can still toggle a local optimistic state
          const mockItem: WishlistItemDto = {
            id: `guest-${productId}`,
            product_id: productId,
            variant_id: variantId || null,
            product_name: "Saved Piece",
            product_slug: "saved-piece",
            category_name: "MENSWEAR",
            base_price: 0,
            created_at: new Date().toISOString(),
          };
          setWishlist((prev) => [mockItem, ...prev]);
          return true;
        }
      }
    },
    [wishlistIds, refreshWishlist]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.has(productId),
    [wishlistIds]
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      wishlist,
      wishlistCount,
      wishlistIds,
      isLoadingCart,
      isLoadingWishlist,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
    }),
    [
      cart,
      cartCount,
      wishlist,
      wishlistCount,
      wishlistIds,
      isLoadingCart,
      isLoadingWishlist,
      refreshCart,
      refreshWishlist,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
    ]
  );

  return (
    <CartWishlistContext.Provider value={value}>
      {children}
    </CartWishlistContext.Provider>
  );
}

export function useCartWishlist() {
  const context = useContext(CartWishlistContext);
  if (!context) {
    throw new Error(
      "useCartWishlist must be used within a CartWishlistProvider"
    );
  }
  return context;
}
