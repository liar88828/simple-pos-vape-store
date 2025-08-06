import HeaderComponent from "@/components/layout/header-page";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <SidebarProvider defaultOpen={ false }>
            <main className="flex-1 overflow-y-auto">
                <HeaderComponent lowStockProducts={ [] } isLoggedIn={ false }/>
                <div className="flex items-center justify-center min-h-screen">
                    { children }
                </div>
            </main>
        </SidebarProvider>
    );
}

