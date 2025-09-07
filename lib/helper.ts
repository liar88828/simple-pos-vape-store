import { ActionResponse } from "@/interface/actionType";
import { ROLE_USER } from "@/lib/constants";
import { STATUS_ABSENT } from "@prisma/client";
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
        onStart?: (message: string) => void
        response: ActionResponse,
        onSuccess?: (message: string) => void,
        onFailure?: (message: string) => void
        onFinish?: (message: string) => void
    }
) => {
    try {
        onStart('Loading ...')
    if (response.success) {
        toast.success(response.message)
        onSuccess(response.message)
    } else {
        toast.error(response.message,)
        onFailure(response.message)
    }
        onFinish('Finished successfully.')
    } catch (e) {
        toast.error('Something went wrong ... 😭😭😭')
        onFailure('Error: Something went wrong')
        onFinish('Finish failed...')
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

export function statusAbsent(
    timeForAbsent: string,     // format "HH:MM"
    timeForPresent: string,    // format "HH:MM"
): STATUS_ABSENT {
    // convert "HH:MM" to minutes
    const toMinutes = (time: string) => {
        const [ h, m ] = time.split(":").map(Number)
        return h * 60 + m
    }

    const currentDate = new Date()
    const nowMinutes = currentDate.getHours() * 60 + currentDate.getMinutes()
    const absentMinutes = toMinutes(timeForAbsent)
    const presentMinutes = toMinutes(timeForPresent)

    // determine status
    if (nowMinutes < absentMinutes) {
        return STATUS_ABSENT.Absent
    } else if (nowMinutes < presentMinutes) {
        return STATUS_ABSENT.Present
    } else return STATUS_ABSENT.Late
}

// delay helper
export const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export function generateRekening(length: number = 10): string {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10); // random digit 0–9
    }
    return result;
}

export function getRoleEmployeePage(role: string) {
    return [ ROLE_USER.ADMIN, ROLE_USER.EMPLOYEE ].includes(role)
}