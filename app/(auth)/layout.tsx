import React from 'react';
import HeaderComponent from "@/components/header-page";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div>
            <HeaderComponent lowStockProducts={ [] } isLoggedIn={ false }/>
            <div className="flex items-center justify-center min-h-screen">
                { children }
            </div>
        </div>
    );
}

