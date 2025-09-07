import { createTransactionAction } from "@/app/admin/pos/pos-action";
import {
    confirmSale, createTransactionUserAction,
    createTransactionUserPendingAction,
    deleteSale,
    getHistoriesUserDetail
} from "@/app/user/user-action";
import { ActionResponse, CartItem, SaleCustomers } from "@/interface/actionType";
import { Customer, Product } from "@/lib/validation";
import { create } from "zustand";

interface CartState {
    isLoading: boolean;
    dataSale: SaleCustomers[];
    dataSaleDetail: SaleCustomers | null;
    getDataSaleDetail: (idSale: string) => Promise<void>;

    createSaleUser: (product: Product) => void;
    createSaleEmployee: (product: Product) => void;
    createSaleAdmin: (product: CartItem[], customer: Customer | null, marketId: string,) => Promise<ActionResponse>;
    createSaleUserPending: (product: CartItem[], salePending: SaleCustomers) => Promise<ActionResponse>
    createSaleUserAction: (    cartItem: CartItem[], marketId: string,) => Promise<ActionResponse>

    confirmSaleEmployee: (idSale: string, statusTransaction: string) => Promise<ActionResponse>
    removeSale: (idSale: string,) => Promise<ActionResponse>


}

export const useSaleStore = create<CartState>((set, get,) => ({
    isLoading: false,
    dataSale: [],
    dataSaleDetail: null,
    getDataSaleDetail: async (idSale) => {
        const dataSaleDetail = get().dataSaleDetail
        if (dataSaleDetail?.id === idSale) return
        set({ isLoading: true })
        set({ dataSaleDetail: await getHistoriesUserDetail(idSale) })
        set({ isLoading: false })
    },

    confirmSaleEmployee: async (idSale, statusTransaction) => confirmSale(idSale, statusTransaction),
    createSaleAdmin: async (product, customer, marketId) => createTransactionAction(product, customer, marketId),
    createSaleUserPending: async (product, salePending) => createTransactionUserPendingAction(product, salePending),
    createSaleUserAction: async (cartItem, marketId) => createTransactionUserAction(cartItem, marketId),

    removeSale: async (idSale) => deleteSale(idSale),

    setCartItems: () => {
    },
    createSaleUser: (product) => {

    },

    createSaleEmployee: (product) => {

    },


}));
