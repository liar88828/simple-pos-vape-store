import React from 'react';
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getProductLowStock } from "@/action/product-action";
import { getTotalSoldToday, getTransactionCountToday } from "@/action/sale-action";
import HeaderComponent from "@/components/header-page";
import { cookies } from "next/headers";
import { adminNavItems } from "@/lib/link-sidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    // Example: check if a login token cookie exists
    const token = cookieStore.get("token")?.value
    const isLoggedIn = Boolean(token)

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar
                asLink='/admin'
                navItems={adminNavItems}
                lowStockProducts={await getProductLowStock()}
            // totalTransaction={ await getTransactionCountToday() }
            // totalSellToday={ await getTotalSoldToday() }
            />
            <SidebarInset>
                <main className="flex-1 overflow-y-auto">
                    <HeaderComponent lowStockProducts={await getProductLowStock()} isLoggedIn={isLoggedIn} />
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

