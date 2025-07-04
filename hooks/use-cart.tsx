import { CartItem } from "@/interface/actionType";
import { Product } from "@/lib/generated/zod_gen";
import { useState } from "react";

export function useCart(initialItems?: CartItem[]) {
    const [ cartItems, setCartItems ] = useState<CartItem[]>(initialItems ?? []);

    const addToCart = (product: Product) => {
        const existingItem = cartItems.find((item) => item.id === product.id);
        if (existingItem) {
            setCartItems(cartItems.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCartItems([ ...cartItems, { ...product, quantity: 1 } ]);
        }
    };

    const removeFromCart = (productId: number) => {
        setCartItems(cartItems.filter((item) => item.id !== productId));
    };

    const incrementItem = (id: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decrementItem = (id: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    return {
        cartItems,
        addToCart,
        removeFromCart,
        incrementItem,
        decrementItem,
        setCartItems, // optional, in case you need full control
    };
}