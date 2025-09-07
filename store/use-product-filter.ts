import { create } from "zustand";

type ProductFilterState = {
    // Pagination
    itemsPerPage: number;
    page: number;

    // Filters
    isLowStock: string;
    isLowExpired: string;
    isNameProduct: string;

    // Actions
    setItemsPerPage: (value: number) => void;
    setPage: (value: number | ((prev: number) => number)) => void;
    setIsLowStock: (value: string) => void;
    setIsLowExpired: (value: string) => void;
    setIsNameProduct: (value: string) => void;

    reset: () => void;
};

export const useProductFilter = create<ProductFilterState>((set) => ({
    // Initial State
    itemsPerPage: 10,
    page: 0,
    isLowStock: "-",
    isLowExpired: "-",
    isNameProduct: "",

    // Actions
    setItemsPerPage: (value) => set({ itemsPerPage: value }),
    setPage: (value) =>
        set((state) => ({
            page: typeof value === "function" ? value(state.page) : value,
        })),
    setIsLowStock: (value) => set({ isLowStock: value }),
    setIsLowExpired: (value) => set({ isLowExpired: value }),
    setIsNameProduct: (value) => set({ isNameProduct: value }),

    reset: () =>
        set({
            itemsPerPage: 10,
            page: 0,
            isLowStock: "-",
            isLowExpired: "-",
            isNameProduct: "",
        }),
}));
