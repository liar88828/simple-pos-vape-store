import { ProductPreorder } from "@/action/product-action";
import { getSettingPaymentFirst } from "@/app/admin/setting/setting-action";
import { CartItem } from "@/interface/actionType";
import { PaymentSetting } from "@/lib/validation";
import { create } from "zustand";

interface CartState {
    isLoading: boolean;
    cartItems: CartItem[];
    payment: PaymentSetting | null
    total: number;
    grandTotal: number;
    tax: number;
    clientMoney:number,
    setField: <K extends keyof CartState>(
        field: K,
        value: CartState[K]
    ) => void
    getPayment: () => Promise<void>
    calculateCart: () => { total: number, tax: number,grandTotal:number; };
    addToCart: (product: ProductPreorder) => void;
    removeFromCart: (productId: string) => void;
    incrementItem: (cartId: string) => void;
    decrementItem: (cartId: string) => void;
    setCartItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    total: 0,
    tax: 0,
    isLoading: false,
    grandTotal: 0,
    payment: null,
    clientMoney:0,
    setField: (field, value) =>
        set((state) => ({
            ...state,
            [field]: value,
        })),
    getPayment: async () => {
        const payment = get().payment
        if (payment) return
        set({ isLoading: true })
        set({ payment: await getSettingPaymentFirst() })
        set({ isLoading: false })
    },
    calculateCart: () => {
        const { payment, cartItems } = get()

        const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

        const tax = payment && payment.isTax
            ? (total * payment.valueTax) / 100
            : 0
        const grandTotal = total + tax
        const calculate = { total, tax, grandTotal }
        set({ ...calculate })
        return calculate;
    },

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
                cartItems: [ ...cartItems, { ...product, quantity: 1, preorderId: product.PreOrders[0].id } ],
            });
        }
        // get().calculateTotal()
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
