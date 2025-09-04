"use client"
import { deleteCookie } from "@/action/auth-action";
import { ModeToggle } from "@/components/layout/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { UserPayload } from "@/interface/actionType";
import { ROLE } from "@/lib/constants";
import { NavItems } from "@/lib/link-sidebar";
import { ChevronsUpDown, LogOutIcon, Settings, } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react";
import { match } from "ts-pattern";

export function AppSidebar(
    {
        lowStockProducts,
        navItems,
        asLink,
        session
    }: {
        lowStockProducts: { stock: number }[],
        navItems: NavItems[],
        asLink: string,
        session: UserPayload
    }) {
    const pathname = usePathname()
    const {
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
    } = useSidebar()
    const isActive = (path: string) => {
        // console.log(`pathname ${pathname}`)
        // console.log(`path ${path}`)
        return pathname === path
    }

    return (
        <Sidebar collapsible={ 'icon' }>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className={ 'flex items-center' }>

                        {/* ✅ This becomes the dropdown trigger button */ }
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div
                                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <Avatar>
                                    <AvatarImage src="/logo.png" alt="logo image"
                                                 className={ 'dark:invert-0 invert  ' }/>
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium"> Menu </span>
                                <span className="truncate text-xs"> Dashboard </span>
                            </div>
                        </SidebarMenuButton>
                        <ModeToggle/>


                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* Main Navigation */ }
                <SidebarGroup>
                    <SidebarGroupLabel
                        className="text-xs font-semibold uppercase tracking-wider px-3 py-2">
                        Main Menu
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            { navItems.map((item) => (
                                <SidebarMenuItem key={ item.path }>
                                    <SidebarMenuButton asChild isActive={ isActive(asLink + item.path) }
                                                       title={ item.title }>

                                        <Link
                                            // @ts-expect-error
                                            href={ asLink + item.path }>
                                            <item.icon/>
                                            <span>  { item.title }</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuBadge>
                                        {
                                            match(item.title)
                                            .with("Inventori", () => `${ lowStockProducts.length }`)
                                            .with("POS Kasir", () => item.badge ?? null)
                                            .otherwise(() => null)
                                        }</SidebarMenuBadge>
                                </SidebarMenuItem>
                            )) }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


            </SidebarContent>

            <SidebarFooter className={ 'border-t' }>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"

                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {/*<AvatarImage src="/placeholder.svg" alt="Admin" />*/ }
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{ session.email }</span>
                                        <span className="truncate text-xs">{ session.name }</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4"/>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={ isMobile ? "bottom" : "right" }
                                align="end"
                                sideOffset={ 4 }
                            >

                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            {/*<AvatarImage src="/placeholder.svg" alt={'user'} />*/ }
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{ session.email }</span>
                                            <span className="truncate text-xs">{ session.userId }</span>
                                            <span className="truncate text-xs">{ session.name }</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                { session.role === ROLE.ADMIN
                                    ? <DropdownMenuGroup>
                                        <DropdownMenuItem>
                                            <Link href="/admin/setting" className={ 'flex items-center gap-2' }>
                                                <Settings/>
                                                <span>Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    : null
                                }
                                <DropdownMenuGroup>

                                    <DropdownMenuItem className="text-red-600" onClick={ deleteCookie }>
                                        <LogOutIcon/>
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
