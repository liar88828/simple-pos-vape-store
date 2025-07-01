"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { formatDateIndo, formatRupiah } from "@/lib/my-utils";
import { DashboardStats } from "@/action/sale-action";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import clsx from "clsx"
import { Invoice } from "./invoice"
import React, { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import { ChartData, RangeStats, SaleCustomers } from "@/interface/actionType"

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

export function HistoriesPage({ histories, }: { histories: SaleCustomers[] }) {
    // const contentRef = useRef<HTMLDivElement>(null)


    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">History Pembelian</h1>
                <div className="flex space-x-2">

                </div>
            </div>



            {/* Detailed Sales */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Detail Pembelian</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Pelanggan</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                {/* <TableHead>Metode Bayar</TableHead> */}
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {histories.map((sale, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {formatDateIndo(sale.date)}
                                    </TableCell>
                                    <TableCell>{sale.customer.name}</TableCell>
                                    <TableCell>{sale.items}</TableCell>
                                    <TableCell>{formatRupiah(sale.total)}</TableCell>
                                    {/* <TableCell>Cash</TableCell> */}
                                    <TableCell>
                                        <Badge variant="default">{sale.statusTransaction}</Badge>
                                    </TableCell>
                                    <TableCell className={'space-x-2'}>
                                        <ModalSalesDetail sale={sale} />
                                        <ModalInvoice sale={sale} />
                                    </TableCell>

                                </TableRow>
                            ))}
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
                    <Eye className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Transaksi</DialogTitle>
                    <DialogDescription>
                        Transaksi oleh {sale.customer.name} pada {formatDateIndo(sale.date)}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <p><strong>Nama Pelanggan:</strong> {sale.customer.name}</p>
                    <p><strong>Tanggal:</strong> {formatDateIndo(sale.date)}</p>
                    <p><strong>Total Pembelian:</strong> {formatRupiah(sale.total)}</p>
                    <p><strong>Jumlah Barang:</strong> {sale.items} item</p>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Daftar Produk:</strong></p>
                    <ul className="space-y-1">
                        {sale.SaleItems.map((item) => (
                            <li key={item.id} className="flex justify-between">
                                <span>{item.product.name} : {item.quantity} × {formatRupiah(item.price)}</span>
                                <span>{formatRupiah(item.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>{formatRupiah(sale.total)}</span>
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
                    <ReceiptText className="h-3 w-3" />
                </Button>
            </DialogTrigger>

            <DialogContent
                className="w-full max-w-sm sm:max-w-xl md:max-w-4xl xl:max-w-6xl h-[90vh] overflow-y-scroll px-0 sm:px-4"
            >
                <DialogHeader>
                    <DialogTitle>Invoice</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Transaksi pada {formatDateIndo(sale.date)} oleh {sale.customer.name}
                    </p>
                </DialogHeader>

                <div ref={contentRef}>
                    <Invoice invoiceData={sale} />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={reactToPrintFn}>Print</Button>
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
                <CardTitle className="capitalize">Grafik Penjualan {range}</CardTitle>

                <CardDescription>
                    {`${chartData[0].name} to ${chartData[chartData.length - 1].name} ${new Date().getFullYear()}`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="desktop"
                            fill="var(--color-desktop)"
                            radius={8} />
                    </BarChart>
                </ChartContainer>

            </CardContent>

            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className={`flex gap-2 leading-none font-medium ${getGrowthColorClass(trending.isUp)}`}>
                    {trending.changeText} {trending.isUp
                        ? <TrendingUp className="h-4 w-4 " />
                        : <TrendingDown className="h-4 w-4 " />}
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total visitors for the last {chartData.length} {rangeIndo}
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