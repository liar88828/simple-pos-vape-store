import { getSessionUserPage } from "@/action/auth-action";
import { getProductLowStock } from "@/action/product-action";
import { AppSidebar } from "@/components/layout/app-sidebar";
import HeaderComponent from "@/components/layout/header-page";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { userNavItems } from '@/lib/link-sidebar';
import { cookies } from "next/headers";
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    // Example: check if a login token cookie exists
    const session = await getSessionUserPage()

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar
                session={ session }
                navItems={userNavItems}
                lowStockProducts={await getProductLowStock()}
            // totalTransaction={await getTransactionCountToday()}
            // totalSellToday={await getTotalSoldToday()}
            />
            <SidebarInset>
                <main className="flex-1 overflow-y-auto">
                    <HeaderComponent
                        lowStockProducts={ await getProductLowStock() }
                        isLoggedIn={ Boolean(session) }/>
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

