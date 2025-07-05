import ProviderComponent from "@/components/provider-component";
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "VapeStore Pro",
    description: "Sistem manajemen toko vape lengkap",
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    // const cookieStore = await cookies()
    // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    // Example: check if a login token cookie exists
    // const token = cookieStore.get("token")?.value
    // const isLoggedIn = Boolean(token)

    // if (!isLoggedIn) {
    //     // If NOT logged in, show only the login page centered on screen
    //     return (
    //         <html lang="id" suppressHydrationWarning>
    //         <body className={ inter.className }>
    //         <ThemeProvider attribute="class" defaultTheme="dark">
    //             <div>
    //                 <HeaderComponent lowStockProducts={ [] } isLoggedIn={ false }/>
    //                 <div className="flex items-center justify-center min-h-screen">
    //                     { children }
    //                 </div>
    //             </div>
    //         </ThemeProvider>
    //         <Toaster position="top-right"/>
    //         </body>
    //         </html>
    //     )
    // }

    // If logged in, show the full app layout
    return (

        <html lang="id" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="dark">
                    {/*<SidebarProvider defaultOpen={ defaultOpen }>*/}
                    {/*    <AppSidebar*/}
                    {/*        lowStockProducts={ await getProductLowStock() }*/}
                    {/*        totalTransaction={ await getTransactionCountToday() }*/}
                    {/*        totalSellToday={ await getTotalSoldToday() }*/}
                    {/*    />*/}
                    {/*    <SidebarInset>*/}
                    {/*        <main className="flex-1 overflow-y-auto">*/}
                    {/*            <HeaderComponent lowStockProducts={ await getProductLowStock() } isLoggedIn={ isLoggedIn }/>*/}
                    {/*            { children }*/}
                    {/*        </main>*/}
                    {/*    </SidebarInset>*/}
                    {/*</SidebarProvider>*/}
                    <ProviderComponent>
                        {/*<ReactQueryDevtools initialIsOpen={false} />*/ }
                        { children }
                    </ProviderComponent>
                </ThemeProvider>
                <Toaster position="top-right" />
            </body>
        </html>
    )
}
