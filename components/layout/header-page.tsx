"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";

type LowStockProduct = { stock: number }

interface HeaderComponentProps {
    lowStockProducts: LowStockProduct[]
    isLoggedIn: boolean
}

export default function HeaderComponent({ lowStockProducts, isLoggedIn }: HeaderComponentProps) {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean) // remove empty strings

    // Build cumulative paths like /admin, /admin/users, etc.
    const pathArray = segments.map((seg, i) => ({
        name: decodeURIComponent(seg),
        href: '/' + segments.slice(0, i + 1).join('/'),
        isLast: i === segments.length - 1,
    }))

    return (
        <header className="bg-background sticky top-0 flex shrink-0 items-center gap-2 border-b p-4">
            <SidebarTrigger
                variant="outline"
                className="size-9"
            />

            {/*<h1 className="text-2xl font-bold">VapeStore Pro</h1>*/ }
            <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"


            />
            <Breadcrumb>
                <BreadcrumbList>
                    { pathArray.map((segment, idx) => {
                        const isHidden = idx !== 0 ? 'hidden md:block' : '';

                        return (
                            <Fragment key={ segment.href }>
                                <BreadcrumbItem>
                                    { !segment.isLast ? (
                                        <BreadcrumbLink asChild>
                                            <Link className={ "capitalize hidden md:block" }
                                                /*@ts-ignore*/
                                                  href={ segment.href }>
                                                { segment.name }
                                            </Link>
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage className="capitalize">{ segment.name }</BreadcrumbPage>
                                    ) }
                                </BreadcrumbItem>

                                { !segment.isLast && (
                                    <BreadcrumbSeparator className={ `hidden md:block` }/>
                                ) }
                            </Fragment>
                        );
                    }) }
                </BreadcrumbList>
            </Breadcrumb>
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