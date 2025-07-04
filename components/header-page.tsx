"use client"

import { ModeToggle } from "@/components/theme-provider";
import { SidebarTrigger } from "@/components/ui/sidebar"
import type React from "react";

type LowStockProduct = { stock: number }

interface HeaderComponentProps {
    lowStockProducts: LowStockProduct[]
    isLoggedIn: boolean
}

export default function HeaderComponent({ lowStockProducts, isLoggedIn }: HeaderComponentProps) {
    return (
        <header className="bg-muted shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-end gap-4">
                        { isLoggedIn && (
                            <SidebarTrigger
                                variant="outline"
                                className="size-9"
                            />
                        ) }
                        <h1 className="text-2xl font-bold">VapeStore Pro</h1>
                    </div>
                    <ModeToggle/>

                </div>
            </div>
        </header>
    )
}


// { isLoggedIn ? (
//     <div className="flex items-center space-x-4">
//         <Button variant="outline" size="sm">
//             <Bell className="h-4 w-4"/>
//             <span className={ 'hidden sm:block' }>
//                                 Notifikasi
//                                 </span>
//             { lowStockProducts.length > 0 && (
//                 <Badge variant="destructive" className="ml-2">
//                     { lowStockProducts.length }
//                 </Badge>
//             ) }
//         </Button>
//         <Link href={ '/setting' }>
//             <Button variant="outline" size="sm">
//                 <Settings className="h-4 w-4"/>
//                 <span className={ 'hidden sm:block' }>
//
//                                     Pengaturan</span>
//             </Button>
//         </Link>
//         <ModeToggle/>
//
//     </div>
// ) : (
//     // If not logged in, optionally show nothing or some simple UI
//     <div>
//         {/* Could put something else here, like login/signup buttons */ }
//     </div>
// ) }