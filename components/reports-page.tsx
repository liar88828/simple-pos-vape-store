"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Eye, ReceiptText, TrendingDown, TrendingUp } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateIndo, formatRupiah, formatRupiahShort } from "@/lib/my-utils";
import { DashboardStats, TopSellingProducts } from "@/action/sale-action";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import clsx from "clsx"
import { Invoice } from "./invoice"
import React, { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation"
import { ChartData, RangeStats, SaleCustomers } from "@/interface/actionType"
import * as XLSX from 'xlsx';
import { DailySalesReport_x5_indonesia } from "@/components/daily-report";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

function getGrowthColorClass(growth: number | boolean) {
    if (typeof growth === "boolean") {
        return growth ? "text-green-600" : "text-red-600";
    }

    return growth < 0 ? "text-red-600" : "text-green-600";
}

interface ReportsPageProps {
    range: RangeStats,
    sales: SaleCustomers[],
    stats: DashboardStats,
    trending: {
        changeText: string,
        isUp: boolean,
        value: number
    },
    topSellers: TopSellingProducts[]
}

export function ReportsPage({ range, sales, trending, stats, topSellers, }: ReportsPageProps) {
    // console.log({ range, sales, chartData, trending, stats })
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null)
    const onPrintPage = useReactToPrint({ contentRef })
    const [ selectedRange, setSelectedRange ] = useState<RangeStats>(range);
    const handleSelectChange = (value: RangeStats) => {
        setSelectedRange(value);
        const params = new URLSearchParams(window.location.search);
        params.set("range", value);
        router.push(`?${ params.toString() }`);
    };

    const rangeIndo = clsx({
        'Bulan': range === 'month',
        'Hari': range === 'today',
        'Tahun': range === 'year',
        'Minggu': range === 'week',
    })

    function exportToExcel(salesx: ReportsPageProps['sales']): void {
        const rows: Record<string, any>[] = [];
        let prevSaleId: number | null = null;

        salesx.forEach((sale) => {
            sale.SaleItems.forEach((item, index) => {
                rows.push({
                    SaleID: sale.id === prevSaleId ? '' : sale.id, // add '' if same sale id
                    Date: sale.id === prevSaleId ? '' : formatDateIndo(sale.date),
                    "Customer Name": sale.id === prevSaleId ? '' : sale.customer.name,
                    "Customer Status": sale.id === prevSaleId ? '' : sale.customer.status,
                    "Product Name": item.product.name,
                    Category: item.product.category,
                    Quantity: item.quantity,
                    "Unit Price": item.price.toLocaleString('en-US'),      // comma thousands separator
                    "Total Price": (item.quantity * item.price).toLocaleString('en-US'), // comma thousands separator
                    "Nicotine": item.product.nicotineLevel,
                    Flavor: item.product.flavor,
                    Type: item.product.type,
                });

                prevSaleId = sale.id;
            });
        });
        const worksheet = XLSX.utils.json_to_sheet(rows);

        worksheet['!cols'] = [
            { wch: 6 }, // A: SaleID
            { wch: 15 }, // B: Date
            { wch: 10 }, // C: CustomerName
            { wch: 14 }, // D: CustomerStatus
            { wch: 15 }, // E: ProductName
            { wch: 8 }, // F Category (wider)
            { wch: 8 }, // G: Quantity
            { wch: 10 }, // H: UnitPrice
            { wch: 10 }, // I: TotalPrice
            { wch: 8 }, // J: NicotineLevel
            { wch: 18 }, // K: Flavor (wider)
            { wch: 9 }, // L: Type (wider)
        ];
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'SalesData');

        const today = new Date().toISOString().split('T')[0];
        XLSX.writeFile(workbook, `Sales_Report_${ today }.xlsx`);
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Laporan Penjualan</h1>
                <div className="flex space-x-2">
                    <Select value={ selectedRange } onValueChange={ handleSelectChange }>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih rentang waktu"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hari Ini</SelectItem>
                            <SelectItem value="week">Minggu Ini</SelectItem>
                            <SelectItem value="month">Bulan Ini</SelectItem>
                            <SelectItem value="year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <BarChart3 className="h-4 w-4 mr-2"/>
                                Export
                            </Button>
                        </DialogTrigger>
                        <DialogContent
                            className="min-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            <DialogHeader>
                                <DialogTitle>Daily Sales Report</DialogTitle>
                                <DialogDescription>
                                    A detailed export of daily sales performance including stats and trends.
                                </DialogDescription>
                            </DialogHeader>

                            <div ref={ contentRef } className="py-4">
                                <DailySalesReport_x5_indonesia
                                    sales={ sales }
                                    stats={ stats }
                                    range={ range }
                                    trending={ trending }
                                />
                            </div>

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button onClick={ () => exportToExcel(sales) }>Excel</Button>
                                </DialogClose>

                                <DialogClose asChild>
                                    <Button onClick={ () => onPrintPage() }>Print</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button variant="secondary">Close</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sales Summary */ }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Penjualan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ formatRupiahShort(stats.totalSales) }</div>
                        <p className={ `text-sm ${ getGrowthColorClass(stats.salesGrowth) }` }>
                            { stats.salesGrowth.toFixed(2) }% dari { rangeIndo } lalu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ stats.transactions }</div>
                        <p className={ `text-sm ${ getGrowthColorClass(stats.transactionsGrowth) }` }>
                            { (stats.transactionsGrowth).toFixed(2) }% dari { rangeIndo } lalu
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rata-rata Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ formatRupiahShort(stats.avgTransaction) }</div>
                        <p className={ `text-sm ${ getGrowthColorClass(stats.avgTransactionGrowth) }` }>
                            { stats.avgTransactionGrowth.toFixed(2) }% dari { rangeIndo } lalu</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Produk Terlaris</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">{ stats.topProduct.product?.name }</div>
                        <p className="text-sm text-muted-foreground">{ stats.topProduct.unitsSold } unit terjual</p>
                    </CardContent>
                </Card>
            </div>


            {/* Detailed Sales */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Detail Penjualan</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Metode Bayar</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { sales.map((sale, index) => (
                                <TableRow key={ index }>
                                    <TableCell>{ formatDateIndo(
                                        sale.date,
                                        range === 'today' ? 'time' : 'long') }
                                    </TableCell>
                                    <TableCell>{ sale.customer.name }</TableCell>
                                    <TableCell>{ sale.items }</TableCell>
                                    <TableCell>{ formatRupiah(sale.total) }</TableCell>
                                    <TableCell>Cash</TableCell>
                                    <TableCell>
                                        <Badge variant="default">Selesai</Badge>
                                    </TableCell>
                                    <TableCell className={ 'space-x-2' }>
                                        <ModalSalesDetail sale={ sale }/>
                                        <ModalInvoice sale={ sale }/>
                                    </TableCell>

                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Top Produk Terlaris ({ getRangeLabel(range) })</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Gambar</TableHead>
                                <TableHead>Jumlah Terjual</TableHead>
                                <TableHead>Total Harga</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { topSellers.map((item, index) => (
                                <TableRow key={ item.productId }>
                                    <TableCell>{ index + 1 }</TableCell>
                                    <TableCell>{ item.product?.name ?? "-" }</TableCell>
                                    <TableCell>
                                        { item.product?.image ? (
                                            <img
                                                src={ item.product.image }
                                                alt={ item.product.name }
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        ) : (
                                            "-"
                                        ) }
                                    </TableCell>
                                    <TableCell>{ item.totalSold }</TableCell>
                                    <TableCell>{ formatRupiah(item.totalSold * item.actualPrice)}</TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}

export function ModalSalesDetail({ sale }: { sale: SaleCustomers }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Transaksi</DialogTitle>
                    <DialogDescription>
                        Transaksi oleh { sale.customer.name } pada { formatDateIndo(sale.date) }
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <p><strong>Nama Pelanggan:</strong> { sale.customer.name }</p>
                    <p><strong>Tanggal:</strong> { formatDateIndo(sale.date) }</p>
                    <p><strong>Total Pembelian:</strong> { formatRupiah(sale.total) }</p>
                    <p><strong>Jumlah Barang:</strong> { sale.items } item</p>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Daftar Produk:</strong></p>
                    <ul className="space-y-1">
                        { sale.SaleItems.map((item) => (
                            <li key={ item.id } className="flex justify-between">
                                <span>{ item.product.name } : { item.quantity } × { formatRupiah(item.price) }</span>
                                <span>{ formatRupiah(item.price * item.quantity) }</span>
                            </li>
                        )) }
                    </ul>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>{ formatRupiah(sale.total) }</span>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button variant="outline">Tutup</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );

}

export function ModalInvoice({ sale }: { sale: SaleCustomers }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <ReceiptText className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            {/* overflow-scroll  */ }
            <DialogContent className="min-w-4xl mx-auto  ">
                <DialogHeader>
                    <DialogTitle>Invoice</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Transaksi pada { formatDateIndo(sale.date) } oleh { sale.customer.name }
                    </p>
                </DialogHeader>
                <div ref={ contentRef }>
                    <Invoice invoiceData={ sale }/>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={ reactToPrintFn }>Print</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="outline">Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function ReportsPageChart({ range, sales, chartData, trending, stats }: {
    range: RangeStats,
    sales: SaleCustomers[],
    chartData: ChartData[]
    stats: DashboardStats,
    trending: {
        changeText: string,
        isUp: boolean,
        value: number
    }
}) {

    const rangeIndo = clsx({
        'Bulan': range === 'month',
        'Hari': range === 'today',
        'Tahun': range === 'year',
        'Minggu': range === 'week',
    })

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="capitalize">Grafik Penjualan { range }</CardTitle>

                <CardDescription>
                    { `${ chartData[0].name } to ${ chartData[chartData.length - 1].name } ${ new Date().getFullYear() }` }
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={ chartConfig }>
                    <BarChart accessibilityLayer data={ chartData }>
                        <CartesianGrid vertical={ false }/>
                        <XAxis
                            dataKey="name"
                            tickLine={ false }
                            tickMargin={ 10 }
                            axisLine={ false }
                            tickFormatter={ (value) => value.slice(0, 3) }
                        />
                        <ChartTooltip
                            cursor={ false }
                            content={ <ChartTooltipContent hideLabel/> }
                        />
                        <Bar dataKey="desktop"
                             fill="var(--color-desktop)"
                             radius={ 8 }/>
                    </BarChart>
                </ChartContainer>

            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className={ `flex gap-2 leading-none font-medium ${ getGrowthColorClass(trending.isUp) }` }>
                    { trending.changeText } { trending.isUp
                    ? <TrendingUp className="h-4 w-4 "/>
                    : <TrendingDown className="h-4 w-4 "/> }
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last { chartData.length } { rangeIndo }
                </div>
            </CardFooter>
        </Card>

    );
}

function getRangeLabel(range: RangeStats) {
    switch (range) {
        case "today":
            return "Hari Ini";
        case "week":
            return "7 Hari Terakhir";
        case "month":
            return "1 Bulan Terakhir";
        case "year":
            return "1 Tahun Terakhir";
        default:
            return "";
    }
}