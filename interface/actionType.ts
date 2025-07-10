import { Customer, Product, Sale, SalesItem } from "@/lib/validation";
import { JWTPayload } from "jose";

export type ActionResponse<T = any> = {
    success: boolean,
    message: string,
    data?: T,
    error?: any,
}

export type LowStockProducts = { stock: number, minStock: number, id: number };

export type CartItem = Product & {
    quantity: number
}

export type ProductParam = {
    range: string,
    productName: string
    productCoil: string
    productCotton: string
    productFluid: string
    productBattery: string
    productCategory: string
    productNicotine: string
    productResistant: string
    productTypeDevice: string
    productBrand: string
    productPage: string
    productLimit: string
//
    inventoryName: string
    inventoryStock: string
    inventoryExpired: string
    inventoryLimit: string
    inventoryPage: string
}

export type ContextPage = {
    params: Promise<{ slug: string }>
    searchParams: Promise<(
        ProductParam &
        { customerName: string }
        )>
}

export type RangeStats = 'today' | "week" | "month" | "year"

export type ChartData = { name: string, desktop: number }
export type LastBuyer = Customer & {
    Sales: Sale[]
};
export type SaleCustomers = Sale & {
    customer: Customer
    SaleItems: (SalesItem & { product: Product })[]
};

// session

export type UserPayload = { userId: string, email: string, role: string, name: string };
export type SessionPayload = JWTPayload & UserPayload


export type ModalProps = {
    setOpenAction: (value: boolean) => void,
    isOpen: boolean
}
