import { ActionResponse } from "@/interface/actionType";
import { toast } from "sonner";
import { Product } from "@prisma/client";
import { match } from "ts-pattern";

export type Variant = "default" | "secondary" | "destructive" | "outline" | null | undefined;

export function variantStatus_(flags: {
    default?: boolean;
    secondary?: boolean;
    destructive?: boolean
}): "default" | "secondary" | "destructive" | "outline" | null | undefined {
    if (flags.default) return "default";
    if (flags.secondary) return "secondary";
    if (flags.destructive) return "destructive";
    return "default"; // fallback
}

export function variantStatus(flags: {
    default?: boolean;
    secondary?: boolean;
    destructive?: boolean;
}): "default" | "secondary" | "destructive" | "outline" | null | undefined | string {
    return match(flags)
    .with({ default: true }, () => "default")
    .with({ secondary: true }, () => "secondary")
    .with({ destructive: true }, () => "destructive")
    .otherwise(() => "default");
}
export function formatRupiah(amount: number): string {
    return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export function formatRupiahShort(amount: number): string {
    const formatter = new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 1,
    });

    if (amount >= 1_000_000_000) {
        return `Rp ${ formatter.format(amount / 1_000_000_000) }B`;
    } else if (amount >= 1_000_000) {
        return `Rp ${ formatter.format(amount / 1_000_000) }M`;
    } else if (amount >= 1_000) {
        return `Rp ${ formatter.format(amount / 1_000) }K`;
    } else {
        return `Rp ${ formatter.format(amount) }`;
    }
}
export function getStatusLabel(status: string): string {
    switch (status) {
        case "verified":
            return "Terverifikasi";
        case "pending":
            return "Pending";
        default:
            return "Ditolak";
    }
}

export function choose<T>(...cases: [condition: boolean, result: T][]): T | undefined {
    for (const [cond, result] of cases) {
        if (cond) return result;
    }
    return undefined;
}

export function formatDateIndo(
    dateStr: Date | string,
    format: "numeric" | "long" | "full" | "time" | "datetime" = "long"
): string {
    const date = new Date(dateStr);

    switch (format) {
        case "long":
            return date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });

        case "numeric":
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            return `${ day }/${ month }/${ year }`;

        case "full":
            return date.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            });

        case "time":
            return date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

        case "datetime":
            return date.toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

        default:
            throw new Error('Invalid format type. Use "long", "numeric", "full", "time", or "datetime".');
    }
}

export const toastResponse = (
    {
        response,
        onSuccess = () => {
        },
        onFailure = () => {
        },
    }: {
        response: ActionResponse,
        onSuccess?: () => void,
        onFailure?: () => void
    }
) => {
    if (response.success) {
        toast.success(response.message)
        onSuccess()
    } else {
        toast.error(response.message)
        onFailure()
    }
}

export const formatDateForInput = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${ year }-${ month }-${ day }`;
};

export const formatDateTimeLocal = (date?: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${ year }-${ month }-${ day }T${ hours }:${ minutes }`;
};

export function calculateAverage(numbers: number[]) {
    if (!numbers.length) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    const avgData = sum / numbers.length;
    return parseFloat(avgData.toFixed(2))
}

export function chooseStatus(status: string): string {
    if (status === "verified") return "Valid";
    if (status === "pending") return "Pending";
    return "Ditolak";
}

export function getStatusVariant(status: string): "default" | "secondary" | "destructive" {
    if (status === "verified") return "default";
    if (status === "pending") return "secondary";
    return "destructive";
}

export function totalProduct(products: Product[]) {
    return products.reduce((a, b) => a + (b.price + b.price), 0);
}

// export function getValueLabel(value: number) {
//     if (value <= 100) return `${value}`;

//     const power = Math.pow(10, Math.floor(Math.log10(value)));
//     const rounded = Math.floor(value / power) * power;

//     return `${rounded}+`;
// }

export function getValueLabel(value: number) {
    if (value > 100) return `+100`;
    return value
}

export function truncateText(text: string, maxLength: number) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export function newParam(params: Record<string, string | undefined>) {
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