import * as z from "zod";
import {
    CustomerModel,
    InventoryModel,
    PaymentListModel,
    PaymentModel,
    ProductModel, SalesItemModel,
    ShippingListModel,
    ShippingModel,
    StoreModel
} from "@/lib/generated/zod";

export const CustomerModelNew = z.object({
    name: z.string().min(1),
})

export type CustomerModelType = z.infer<typeof CustomerModelNew>
export type CustomerModelComplete = z.infer<typeof CustomerModel>
export type ProductModelType = z.infer<typeof ProductModel>
export type StoreModelType = z.infer<typeof StoreModel>
export type InventoryModelType = z.infer<typeof InventoryModel>

export type SalesItemModelType = z.infer<typeof SalesItemModel>

export type PaymentModelType = z.infer<typeof PaymentModel>
export type PaymentListModelType = z.infer<typeof PaymentListModel>

export type ShippingModelType = z.infer<typeof ShippingModel>
export type ShippingListModelType = z.infer<typeof ShippingListModel>
