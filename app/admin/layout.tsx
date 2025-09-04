import { getSessionUserPage } from "@/action/auth-action";
import { getProductLowStock } from "@/action/product-action";
import { AppSidebar } from "@/components/layout/app-sidebar";
import HeaderComponent from "@/components/layout/header-page";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { adminNavItems } from "@/lib/link-sidebar";
import { cookies } from "next/headers";
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    const session = await getSessionUserPage()
    const lowStockProducts = await getProductLowStock()
    return (
        <SidebarProvider defaultOpen={ defaultOpen }>
            <AppSidebar
                asLink='/admin'
                navItems={ adminNavItems }
                lowStockProducts={ lowStockProducts }
                session={ session }
                // totalTransaction={ await getTransactionCountToday() }
                // totalSellToday={ await getTotalSoldToday() }
            />
            <SidebarInset>
                <main className="flex-1 overflow-y-auto">
                    <HeaderComponent
                        lowStockProducts={ lowStockProducts }
                        isLoggedIn={ Boolean(session) }/>
                    {/*<div className={'p-6'}></div>*/ }
                    { children }
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

