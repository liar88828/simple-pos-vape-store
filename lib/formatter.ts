export function formatRupiah(amount: number): string {
    return amount.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export function formatDateIndo(
    dateStr?: Date | string | null,
    format: "numeric" | "long" | "full" | "time" | "datetime" = "long"
): string {
    if (!dateStr) {
        return '-'
    }

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

export function getNumberSmall(value: number): string {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    return value.toString();
}

export function truncateText(text: string, maxLength: number) {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
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

export function getGrowthColorClass(growth: number | boolean) {
    if (typeof growth === "boolean") {
        return growth ? "text-green-600" : "text-red-600";
    }

    return growth < 0 ? "text-red-600" : "text-green-600";
}