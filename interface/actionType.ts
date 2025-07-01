import { Customer, Product, Sale, SalesItem } from "@/lib/generated/zod_gen";
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

export type ContextPage = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{
        range: string,
        productName: string
        customerName: string
    }>
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
export type SESSION = JWTPayload & UserPayload