import { getShopAll } from "@/app/admin/employee/employee-action";
import { Market } from "@/lib/validation";
import { create } from "zustand";

interface SettingState {
    isLoading: boolean;
    markets: Market[];
    getMarkets: () => Promise<void>;

}

export const useSettingStore = create<SettingState>((set, get,) => ({
    isLoading: false,
    markets: [],
    getMarkets: async () => {
        const { markets } = get()
        if (markets.length === 0) {
            set({ isLoading: true });
            set({ markets: await getShopAll() })
            set({ isLoading: false });
        }
    }
}))

