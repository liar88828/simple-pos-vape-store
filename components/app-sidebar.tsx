"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    Archive,
    BarChart3,
    ChevronsUpDown,
    FlaskConical,
    LogOutIcon,
    Package,
    Settings,
    ShoppingCart,
    Users,
} from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteCookie } from "@/action/auth-action";

export function AppSidebar({ lowStockProducts, totalTransaction, totalSellToday }: {
    lowStockProducts: { stock: number }[],
    totalTransaction: number,
    totalSellToday: number
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
        return pathname === path
    }

    const mainNavItems = [
        // {
        //     title: "Dashboard",
        //     icon: Home,
        //     path: "/dashboard",
        //     description: "Overview & Analytics",
        // },
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
            badge: lowStockProducts.length > 0 ? lowStockProducts.length.toString() : null,
            badgeVariant: "destructive" as const,
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
            title: "Test",
            icon: FlaskConical,
            path: "/test",
            description: "For Test App",
        },
    ]

    return (
        <Sidebar collapsible={ 'icon' }>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div
                                        className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <Avatar>
                                            <AvatarImage src="/logo.png" alt="logo image"/>
                                            <AvatarFallback>AD</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium"> Menu </span>
                                        <span className="truncate text-xs"> Dashboard </span>
                                    </div>
                                    {/*<ChevronsUpDown className="ml-auto"/>*/ }
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                        </DropdownMenu>
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
                            { mainNavItems.map((item) => (
                                <SidebarMenuItem key={ item.path }>
                                    <SidebarMenuButton asChild isActive={ isActive(item.path) } title={ item.title }>
                                        <Link href={ item.path }>
                                            <item.icon/>
                                            <span>  { item.title }</span>
                                        </Link>
                                    </SidebarMenuButton>
                                    <SidebarMenuBadge> { item.badge }</SidebarMenuBadge>
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
                                        <AvatarImage src="/placeholder.svg" alt="Admin"/>
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{ 'admin@vapestore.com' }</span>
                                        <span className="truncate text-xs">{ 'admin' }</span>
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
                                            <AvatarImage src="/placeholder.svg" alt={ 'user' }/>
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{ 'admin@vapestore.com' }</span>
                                            <span className="truncate text-xs">{ 'admin' }</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link href="/setting" className={ 'flex items-center gap-2' }>
                                            <Settings/>
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
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
