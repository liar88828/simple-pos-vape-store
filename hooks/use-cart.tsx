import { create } from "zustand";
import { CartItem } from "@/interface/actionType";
import { Product } from "@/lib/validation";

interface CartState {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    incrementItem: (cartId: string) => void;
    decrementItem: (cartId: string) => void;
    setCartItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    cartItems: [],

    addToCart: (product) => {
        const { cartItems } = get();
        const existingItem = cartItems.find((item) => item.id === product.id);

        if (existingItem) {
            set({
                cartItems: cartItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        } else {
            set({
                cartItems: [ ...cartItems, { ...product, quantity: 1 } ],
            });
        }
    },

    removeFromCart: (productId) =>
        set((state) => ({
            cartItems: state.cartItems.filter((item) => item.id !== productId),
        })),

    incrementItem: (id) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            ),
        })),

    decrementItem: (id) =>
        set((state) => ({
            cartItems: state.cartItems.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ),
        })),

    setCartItems: (items) => set({ cartItems: items }),
}));
