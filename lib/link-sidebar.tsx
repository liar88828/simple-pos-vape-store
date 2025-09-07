'use client'
import {
    Archive,
    BarChart3,
    Box,
    Briefcase,
    FlaskConical,
    History,
    Home,
    InboxIcon,
    LucideIcon,
    Package,
    SettingsIcon,
    ShoppingCart,
    Store,
    UserIcon,
    Users,
} from "lucide-react"
import { Route } from "next";

export type NavItems<T> = {
    title: string;
    icon: LucideIcon
    href: T;
    description: string;
    badge?: string,
    badgeVariant?: string
    separator?: boolean
}
export const adminNavItems: NavItems<Route>[] = [
    {
        title: "Dashboard",
        icon: Home,
        href: "/admin/dashboard",
        description: "Overview & Analytics",
    },

    {
        title: "POS Kasir",
        icon: ShoppingCart,
        href: "/admin/pos",
        description: "Point of Sale",
        badge: "Live",
    },

    {
        title: "Produk",
        icon: Package,
        href: "/admin/products",
        description: "Katalog & Inventory",
    },

    {
        title: "Inventori",
        icon: Archive,
        href: "/admin/inventory",
        description: "Stock Management",
        // badge: lowStockProducts.length > 0 ? lowStockProducts.length.toString() : null,
        // badgeVariant: "destructive" as const,
    },

    {
        title: "Laporan",
        icon: BarChart3,
        href: "/admin/reports",
        description: "Sales & Analytics",
    },

    //
    // {
    //     title: "Customers",
    //     icon: Users,
    //     path: "/customers",
    //     description: "Customers",
    // },

    {
        title: "Shop",
        icon: Store,
        href: "/admin/shop",
        description: "Shop",
    },

    {
        title: "Employee",
        icon: Briefcase,
        href: "/admin/employee",
        description: "Employee",
    },

    {
        title: "Customer",
        icon: Users,
        href: "/admin/customers",
        description: "Customer Management",
    },


    {
        title: "Setting",
        icon: SettingsIcon,
        href: "/admin/setting",
        description: "Setting App",
    },
    {
        title: "Test",
        icon: FlaskConical,
        href: "/admin/test",
        description: "For Test App",
    },

]

export const employeeNavItems: NavItems<Route>[] = [

    {
        title: "Profile",
        icon: UserIcon,
        href: "/employee",
        description: "User Profile",
    },

    {
        title: "Inventory",
        icon: Archive,
        href: "/employee/inventory",
        description: "Inventory",
        // badge: "Live",
    },

    {
        title: "POS",
        icon: ShoppingCart,
        href: "/employee/pos",
        description: "Point of Sale",
    },

    {
        title: "Inbox",
        icon: InboxIcon,
        href: "/employee/inbox",
        description: "Inbox",
        // badge: "Live",
    },
    {
        title: "stock",
        icon: Box,
        href: "/employee/stock",
        description: "Stock Management",
        separator: true,
        // badge: "Live",
    },

]

export const userNavItems: NavItems<Route>[] = [

    {
        title: "Home",
        icon: Home,
        href: "/user/home",
        description: "Point of Sale",
        badge: "Live",
    },


    {
        title: "History",
        icon: History,
        href: "/user/history",
        description: "Point of Sale",
    },

]
