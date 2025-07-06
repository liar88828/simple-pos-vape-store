"use client"

import { TopSellingProducts } from "@/action/sale-action";
import { ModalSalesDetail } from "@/components/reports-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SaleCustomers } from "@/interface/actionType";
import { Product } from "@/lib/generated/zod_gen";
import { formatDateIndo, formatRupiah, formatRupiahShort } from "@/lib/my-utils";
import { cn } from "@/lib/utils"
import { AlertTriangle, Clock, DollarSign, Package, ShoppingCart, Star, TrendingUp, Users } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react";

interface DashboardPageProps {
    topSelling: TopSellingProducts[],
    lastBuyer: SaleCustomers[],
    preOrders: number,
    lowStockProducts: Product[],
    todayVsYesterdaySales: {
        todayTotal: number;
        percentChange: number
    }
}

export function DashboardPage(
    {
        topSelling,
        lastBuyer,
        preOrders,
        lowStockProducts,
        todayVsYesterdaySales
    }: DashboardPageProps) {

    const [ isSaleModal, setIsSaleModal ] = useState(false)
    const [ isSale, setIsSale ] = useState<SaleCustomers | null>(null)

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <ModalSalesDetail sale={ isSale }
                              isOpen={ isSaleModal }
                              setOpenAction={ setIsSaleModal }
            />


            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div className="">

                    <h1 className="text-lg sm:text-3xl font-bold">Dashboard</h1>
                    <p className={ "text-sm sm:text-base text-muted-foreground mt-1" }>Selamat datang di VapeStore
                        Management System</p>
                </div>
                <Button asChild><Link href="/admin/pos"><ShoppingCart/> Buka POS</Link></Button>
            </div>

            {/* Alert untuk stok rendah */ }
            { lowStockProducts.length > 0 && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4"/>
                    <AlertTitle>Peringatan Stok Rendah!</AlertTitle>
                    <AlertDescription>
                        { lowStockProducts.length } produk memiliki stok di bawah minimum. <Button variant="outline">
                        <Link href="/admin/inventory">Lihat detail</Link>
                    </Button>
                    </AlertDescription>
                </Alert>
            ) }

            {/* Stats Cards */ }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                {/* Card 1 - Penjualan Hari Ini */ }
                <Card className={ "relative overflow-hidden" }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Penjualan Hari Ini</CardTitle>
                        <div className={ "p-2 rounded-lg bg-chart-2/50" }>
                            <DollarSign className={ "h-4 w-4 text-chart-2" }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={ "text-2xl font-bold text-primary" }>
                            { formatRupiahShort(todayVsYesterdaySales.todayTotal) }
                        </div>
                        <div
                            className={ cn(
                                "flex items-center mt-2",
                                {
                                    "text-green-600 dark:text-green-400": todayVsYesterdaySales.percentChange > 0,
                                    "text-destructive": todayVsYesterdaySales.percentChange < 0,
                                }
                            ) }
                        >
                            <TrendingUp className={ "h-3 w-3 mr-1" }/>
                            <p className="text-xs font-medium">
                                { (todayVsYesterdaySales.percentChange).toFixed(1) }% dari kemarin
                            </p>
                        </div>
                    </CardContent>
                    <div
                        className={ "absolute top-0 right-0 w-20 h-20 bg-chart-2/20 rounded-full -mr-10 -mt-10" }></div>
                </Card>

                {/* Card 2 - Total Produk */ }
                <Card
                    className={ "relative overflow-hidden" }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Total Produk</CardTitle>
                        <div className={ "p-2 bg-chart-1/40 rounded-lg" }>
                            <Package className={ "h-4 w-4 text-chart-1" }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={ "text-2xl font-bold text-primary" }>{ topSelling.length }</div>
                        <p className={ "text-xs text-muted-foreground mt-2" }>5 kategori tersedia</p>
                    </CardContent>
                    <div
                        className={ "absolute top-0 right-0 w-20 h-20 bg-chart-1/20 rounded-full -mr-10 -mt-10" }></div>
                </Card>

                {/* Card 3 - Stok Rendah */ }
                <Card
                    className={ "relative overflow-hidden" }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Stok Rendah</CardTitle>
                        <div className={ "p-2 bg-chart-5/40 rounded-lg" }>
                            <AlertTriangle className={ "h-4 w-4 text-chart-5" }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={ "text-2xl font-bold text-red-600" }>{ lowStockProducts.length }</div>
                        <p className={ "text-xs text-chart-5 mt-2" }>Perlu reorder segera</p>
                    </CardContent>
                    <div
                        className={ "absolute top-0 right-0 w-20 h-20 bg-chart-5/20 rounded-full -mr-10 -mt-10" }></div>
                </Card>

                {/* Card 4 - Pre-Order */ }
                <Card
                    className={ "relative overflow-hidden" }>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Pre-Order</CardTitle>
                        <div className={ "p-2 bg-chart-3/40 rounded-lg" }>
                            <Clock className={ "h-4 w-4 text-chart-3" }/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={ "text-2xl font-bold text-primary" }>{ preOrders }</div>
                        <p className={ "text-xs text-muted-foreground mt-2" }>Menunggu
                            konfirmasi</p>
                    </CardContent>
                    <div
                        className={ "absolute top-0 right-0 w-20 h-20 bg-chart-3/20 rounded-full -mr-10 -mt-10" }></div>
                </Card>

            </div>

            {/* Main Content Grid */ }
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Sales */ }
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Penjualan Terbaru</CardTitle>
                            <CardDescription className="mt-1"> Transaksi hari ini </CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/reports">Lihat Semua</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            { lastBuyer.map((sale, index) => (
                                <div
                                    key={ index }
                                    className={ "flex items-center justify-between p-3 bg-muted rounded-lg" }
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center dark:bg-blue-900">
                                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                                        </div>
                                        <div>
                                            <p className={ "font-medium text-primary" }>
                                                { sale.customer.name }
                                            </p>
                                            <p className={ "text-sm text-muted-foreground" }>
                                                { sale.SaleItems.length } items • { formatDateIndo(sale.date) }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className={ "font-bold text-primary" }>
                                            { formatRupiah(sale.SaleItems.reduce((a, b) => a + (b.priceAtBuy * b.quantity), 0)) }
                                        </p>
                                        {/*<Badge variant="default">*/ }
                                        {/*    { sale.statusTransaction }*/ }
                                        {/*</Badge>*/ }

                                        <Button size="sm" onClick={ () => {
                                            setIsSale(sale)
                                            setIsSaleModal(true)
                                        } }
                                        >
                                            { sale.statusTransaction }
                                            {/*<Eye className="size-3 "/>*/ }
                                        </Button>

                                    </div>

                                </div>
                            )) }
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */ }
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription> Aksi cepat untuk operasional </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" asChild>
                            <Link href="/admin/pos">
                                <ShoppingCart className="mr-2 h-4 w-4"/>
                                Buka POS Kasir
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/admin/products">
                                <Package className="mr-2 h-4 w-4"/>
                                Tambah Produk
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/admin/inventory">
                                <AlertTriangle className="mr-2 h-4 w-4"/>
                                Cek Stok Rendah
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link href="/admin/customers">
                                <Users className="mr-2 h-4 w-4"/>
                                Kelola Pelanggan
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Grid */ }
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Products */ }
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center">
                                <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
                                Stok Rendah
                            </CardTitle>
                            <CardDescription className="mt-1">Produk yang perlu direstock</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/inventory">Kelola</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            { lowStockProducts.length === 0 ? (
                                <div className="text-center py-6">
                                    <Package className="h-12 w-12 mx-auto mb-3"/>
                                    <p>Semua produk stok aman</p>
                                </div>
                            ) : (
                                lowStockProducts.slice(0, 4).map((product) => (
                                    <div
                                        key={ product.id }
                                        className={ "flex items-center justify-between p-3 bg-muted rounded-lg border-red-200 border " }

                                    >
                                        <div className="flex items-center space-x-3">
                                            <picture>
                                                <img
                                                    src={ product.image || "/placeholder.svg" }
                                                    alt={ product.name }
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                            </picture>
                                            <div>
                                                <p className="font-medium text-primary">{ product.name }</p>
                                                <p className="text-sm text-muted-foreground">{ product.category }</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="destructive" className="mb-1">
                                                { product.stock } tersisa
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">Min: { product.minStock }</p>
                                        </div>
                                    </div>
                                ))
                            ) }
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */ }
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Star className="h-5 w-5 text-chart-3 mr-2"/> Produk Terlaris </CardTitle>
                        <CardDescription>Berdasarkan penjualan bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            { topSelling.slice(0, 4).map((product, index) => (
                                <div
                                    key={ product.product?.id }
                                    className={ "flex items-center justify-between p-3 bg-muted rounded-lg" }
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={ "w-8 h-8 bg-chart-3/20 rounded-full flex items-center justify-center" }>
                                            <span className={ "text-sm font-bold text-chart-3" }>#{ index + 1 }</span>
                                        </div>
                                        <picture>
                                            <img
                                                src={ product.product?.image }
                                                alt={ product.product?.name }
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                        </picture>
                                        <div>
                                            <p className={ "font-medium text-primary" }>{ product.product?.name }</p>
                                            <p className={ "text-sm text-muted-foreground" }>{ product.product?.category }</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={ "font-bold text-primary" }>{ product.totalSold } terjual</p>
                                        <p className={ "text-sm text-muted-foreground" }> { formatRupiah(product.totalPrice) }</p>
                                    </div>
                                </div>
                            )) }
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
