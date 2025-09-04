import { ActionResponse } from "@/interface/actionType";
import { toast } from "sonner";
import { match } from "ts-pattern";

export const toastResponse = (
    {
        response,
        onSuccess = () => {
        },
        onFailure = () => {
        },
        onFinish = () => {
        },
        onStart = () => {
        },
    }: {
        onStart?: () => void
        response: ActionResponse,
        onSuccess?: () => void,
        onFailure?: () => void
        onFinish?: () => void
    }
) => {
    try {

    onStart()
    if (response.success) {
        toast.success(response.message)
        onSuccess()
    } else {
        toast.error(response.message)
        onFailure()
    }
    onFinish()
    } catch (e) {
        toast.error('Something went wrong ... 😭😭😭')
        onFailure()
        onFinish()
    }
}

export function newParam(params: Record<string, string | undefined>): string {
    const searchParams = new URLSearchParams();

    for (const key in params) {
        const value = params[key];
        if (value) {
            searchParams.set(key, value);
        }
    }

    return `?${ searchParams.toString() }`;
}

export function newParamTypes(params: Record<string, string | undefined>): string {
    const searchParams = new URLSearchParams();

    for (const key in params) {
        const value = params[key];
        if (value) {
            searchParams.set(key, value);
        }
    }

    return `?${ searchParams.toString() }`;
}

export const getBadgeVariant = (stock: number, minStock: number): "default" | "secondary" | "destructive" => {
    return match(stock)
    .when(s => s === 0, () => "destructive" as const)
    .when(s => s > 0 && s <= minStock, () => "secondary" as const)
    .when(s => s > minStock, () => "default" as const)
    .otherwise(() => "default" as const);
};

export function getStockLabel(stock: number, minStock: number) {
    return match(stock)
    .with(0, () => "Habis")
    .when((s) => s <= minStock, () => "Stok Rendah")
    .otherwise(() => "Tersedia");
}