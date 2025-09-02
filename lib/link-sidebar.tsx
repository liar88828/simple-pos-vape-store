'use client'
import {
    Archive,
    BarChart3,
    FlaskConical,
    History,
    Home,
    LucideIcon,
    Package, SettingsIcon,
    ShoppingCart,
    Users,
} from "lucide-react"

export type NavItems = {
    title: string;
    icon: LucideIcon
    path: string;
    description: string;
    badge?: string,
    badgeVariant?: string
}
export const adminNavItems: NavItems[] = [
    {
        title: "Dashboard",
        icon: Home,
        path: "/dashboard",
        description: "Overview & Analytics",
    },
    {
        title: "POS Kasir",
        icon: ShoppingCart,
        path: "/pos",
        description: "Point of Sale",
        badge: "Live",
    },

    {
        title: "Produk",
        icon: Package,
        path: "/products",
        description: "Katalog & Inventory",
    },
    {
        title: "Inventori",
        icon: Archive,
        path: "/inventory",
        description: "Stock Management",
        // badge: lowStockProducts.length > 0 ? lowStockProducts.length.toString() : null,
        // badgeVariant: "destructive" as const,
    },
    {
        title: "Pelanggan",
        icon: Users,
        path: "/customers",
        description: "Customer Management",
    },

    {
        title: "Laporan",
        icon: BarChart3,
        path: "/reports",
        description: "Sales & Analytics",
    },

    {
        title: "Setting",
        icon: SettingsIcon,
        path: "/setting",
        description: "Setting App",
    },
    {
        title: "Test",
        icon: FlaskConical,
        path: "/test",
        description: "For Test App",
    },

]


export const userNavItems: NavItems[] = [

    {
        title: "Home",
        icon: Home,
        path: "/home",
        description: "Point of Sale",
        badge: "Live",
    },


    {
        title: "History",
        icon: History,
        path: "/history",
        description: "Point of Sale",
    },

]
