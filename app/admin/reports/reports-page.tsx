"use client"

import { ProductPreorder } from "@/action/product-action";
import { DashboardStats, TopSellingProducts, } from "@/action/sale-action";
import { transactionStatusAction } from "@/app/admin/reports/reports-action";
import { ResponsiveModalOnly } from "@/components/mini/modal-components";
import { InvoiceLetter } from "@/components/page/invoice-letter";
import { ProductDetailDialogOnly } from "@/components/page/product-detail-dialog-only";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ModalProps, RangeStats, SaleCustomers } from "@/interface/actionType"
import { formatDateIndo, formatRupiah, formatRupiahShort, getGrowthColorClass } from "@/lib/formatter";
import { toastResponse } from "@/lib/helper";
import { BarChart3, Eye, ReceiptText } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';

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

export function ReportsPage({ range, sales, stats, topSellers, }: ReportsPageProps) {
    const router = useRouter();
    const [ selectedRange, setSelectedRange ] = useState<RangeStats>(range);

    const [ isProductModal, setIsProductModal ] = useState(false);
    const [ isProduct, setIsProduct ] = useState<ProductPreorder | null>(null)
    const [ isSaleModal, setIsSaleModal ] = useState(false)
    const [ isSale, setIsSale ] = useState<SaleCustomers | null>(null)
    const handleSelectChange = (value: RangeStats) => {
        setSelectedRange(value);
        const params = new URLSearchParams(window.location.search);
        params.set("range", value);
        router.push(`?${ params.toString() }`);
    };

    function exportToExcel(
        allSales: ReportsPageProps['sales'],
        topSellingProducts: TopSellingProducts[]
    ): void {
        const rows: Record<string, any>[] = [];
        let prevSaleId: string | null = null;

        allSales.forEach((sale) => {
            sale.SaleItems.forEach((item, index) => {
                rows.push({
                    SaleID: sale.id === prevSaleId ? '' : sale.id, // add '' if same sale id
                    Date: sale.id === prevSaleId ? '' : formatDateIndo(sale.date_buy),
                    "Customer Name": sale.id === prevSaleId ? '' : sale.Customer.name,
                    "Customer Status": sale.id === prevSaleId ? '' : sale.Customer.status,
                    "Product Name": item.Product.name,
                    Category: item.Product.category,
                    Quantity: item.quantity,
                    "Unit Price": item.priceAtBuy.toLocaleString('en-US'),      // comma thousands separator
                    "Total Price": (item.quantity * item.priceAtBuy).toLocaleString('en-US'), // comma thousands separator
                    "Nicotine": item.Product.nicotineLevel,
                    Flavor: item.Product.flavor,
                    Type: item.Product.type,
                });

                prevSaleId = sale.id;
            });
        });
        const worksheetSales = XLSX.utils.json_to_sheet(rows);

        worksheetSales['!cols'] = [
            { wch: 6 }, // A: SaleID
            { wch: 15 }, // B: Date
            { wch: 10 }, // C: CustomerName
            { wch: 14 }, // D: CustomerStatus
            { wch: 50 }, // E: ProductName
            { wch: 8 }, // F Category (wider)
            { wch: 8 }, // G: Quantity
            { wch: 10 }, // H: UnitPrice
            { wch: 10 }, // I: TotalPrice
            { wch: 8 }, // J: NicotineLevel
            { wch: 18 }, // K: Flavor (wider)
            { wch: 15 }, // L: Type (wider)
        ];

        // === Sheet Produk Terlaris ===
        const topProdukRows = topSellingProducts.map((item, index) => ({
            No: index + 1,
            "Product ID": item.productId,
            "Product Name": item.Product?.name || "-",
            "Total Sold": item.totalSold,
            "Total Price": item.totalPrice.toLocaleString('en-US'),
            Category: item.Product?.category || "-",
            Flavor: item.Product?.flavor || "-",
            // "Nicotine Level": item.Product?.nicotineLevel || "-",
            Type: item.Product?.type || "-",
        }));

        const worksheetProduk = XLSX.utils.json_to_sheet(topProdukRows);

        worksheetProduk['!cols'] = [
            { wch: 5 }, // No
            { wch: 8 }, // Product ID
            { wch: 30 }, // Product Name
            { wch: 8 }, // Total Sold
            { wch: 12 }, // Total Price
            { wch: 10 }, // Category
            { wch: 20 }, // Flavor
            // { wch: 15 }, // Nicotine Level
            { wch: 10 }, // Type
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheetSales, 'SalesData');
        XLSX.utils.book_append_sheet(workbook, worksheetProduk, 'TopProduk');

        const today = new Date().toISOString().split('T')[0];
        XLSX.writeFile(workbook, `Sales_Report_${ today }.xlsx`);
    }

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            { isProduct &&
					<ProductDetailDialogOnly product={ isProduct }
											 isOpen={ isProductModal }
											 setOpenAction={ setIsProductModal }
					/>
            }

            <ModalSalesDetail sale={ isSale }
                              isOpen={ isSaleModal }
                              setOpenAction={ setIsSaleModal }
            />

            {/*Header*/ }
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-3xl font-bold">Laporan Penjualan</h1>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
                    <Select value={ selectedRange } onValueChange={ handleSelectChange }>
                        <SelectTrigger className="w-full sm:w-auto">
                            <SelectValue placeholder="Pilih rentang waktu"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hari Ini</SelectItem>
                            <SelectItem value="week">Minggu Ini</SelectItem>
                            <SelectItem value="month">Bulan Ini</SelectItem>
                            <SelectItem value="year">Tahun Ini</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        className="w-full sm:w-auto"
                        onClick={ () => {
                            if (confirm("Apakah Anda ingin Meng-Export data ini")) {
                                exportToExcel(sales, topSellers)
                            }
                        } }
                    >
                        Export <BarChart3 className="h-4 w-4 ml-2"/>
                    </Button>
                </div>
            </div>


            {/* Sales Summary */ }
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Total Penjualan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{ formatRupiahShort(stats.totalSales) }</div>
                        <p className={ `text-sm ${ getGrowthColorClass(stats.salesGrowth) }` }>
                            { stats.salesGrowth.toFixed(2) }%
                            {/*dari {rangeIndo} lalu*/ }
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Rata-rata Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{ formatRupiahShort(stats.avgTransaction) }</div>
                        <p className={ `text-sm ${ getGrowthColorClass(stats.avgTransactionGrowth) }` }>
                            { stats.avgTransactionGrowth.toFixed(2) }%
                            {/*dari {rangeIndo} lalu*/ }
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{ stats.transactions }</div>
                        <p className={ `text-sm ${ getGrowthColorClass(stats.transactionsGrowth) }` }>
                            { stats.transactionsGrowth.toFixed(2) }%
                            {/*dari {rangeIndo} lalu*/ }
                        </p>
                    </CardContent>
                </Card>


                <Card>
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Produk Terlaris</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/*truncate*/ }
                        <div className="text-xs sm:text-lg font-bold ">
                            { stats.topProduct.Product?.name }
                        </div>
                        <p className="text-sm text-muted-foreground">
                            { stats.topProduct.unitsSold } unit terjual
                        </p>
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
                                {/* <TableHead>Metode Bayar</TableHead> */ }
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { sales.map((sale, index) => (
                                <TableRow key={ index }>
                                    <TableCell>{ formatDateIndo(
                                        sale.date_buy,
                                        range === 'today' ? 'time' : 'long') }
                                    </TableCell>
                                    <TableCell>{ sale.Customer.name }</TableCell>
                                    <TableCell>{ sale.items }</TableCell>
                                    <TableCell>{ formatRupiah(sale.total) }</TableCell>
                                    {/* <TableCell>Cash</TableCell> */ }
                                    <TableCell>
                                        <Badge variant="default">{ sale.statusTransaction }</Badge>
                                    </TableCell>
                                    <TableCell className={ 'flex items-center gap-2' }>
                                        <Button size="sm" variant="outline"
                                                onClick={ () => {
                                                    setIsSale(sale)
                                                    setIsSaleModal(true)
                                                } }
                                        >
                                            <Eye className="size-3 "/>
                                        </Button>
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
                    <Table className="text-xs sm:text-base ">
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Produk</TableHead>
                                <TableHead>Gambar</TableHead>
                                {/*<TableHead>Jumlah</TableHead>*/ }
                                <TableHead>Total</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { topSellers.map((item, index) => (
                                <TableRow key={ item.productId }>
                                    <TableCell>{ index + 1 }</TableCell>
                                    <TableCell className={ 'min-w-32 ' }>
                                        <div className="text-wrap">
                                            { item.Product?.name }
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        { item.Product?.image ? (
                                            <picture>

                                                <img
                                                    src={ item.Product.image }
                                                    alt={ item.Product.name }
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                            </picture>

                                        ) : (
                                            "-"
                                        ) }
                                    </TableCell>
                                    {/*<TableCell>{ item.totalSold }</TableCell>*/ }
                                    <TableCell>
                                        <p>Terjual { item.totalSold }</p>
                                        <p> {
                                            // formatRupiah(item.totalSold * (item.Product?.price ?? 1))
                                            formatRupiah(item.totalPrice)
                                        }
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Button size={ 'sm' }
                                                variant="outline"
                                                onClick={ () => {
                                                    setIsProduct(item.Product ?? null)
                                                    setIsProductModal(true)
                                                } }>
                                            <Eye/>
                                        </Button>
                                    </TableCell>

                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}

export function ModalSalesDetail({ sale, isOpen, setOpenAction }: { sale: SaleCustomers | null } & ModalProps) {
    const [ selectStatus, setSelectStatus ] = useState(sale?.statusTransaction)

    if (!sale) {
        return <Dialog open={ isOpen } onOpenChange={ setOpenAction }>
            <DialogContent>
                <DialogHeader>Data is Not Found</DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Tutup</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    }

    return (
        <ResponsiveModalOnly
            isOpen={ isOpen }
            setOpenAction={ setOpenAction }
            title={ `Detail Transaksi : ${ sale.id }` }
            description={ `Transaksi oleh ${ sale.Customer.name } pada ${ formatDateIndo(sale.date_buy) }` }
            footer={
                <>
                    <Select value={ selectStatus } onValueChange={ setSelectStatus }
                    >
                        <SelectTrigger className={ 'w-full sm:w-fit' }>
                            <SelectValue placeholder="Pilih Status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Success">Success</SelectItem>
                            {/* <SelectItem value="year"></SelectItem> */ }
                        </SelectContent>
                    </Select>
                    <Button variant="default"
                            onClick={ async () => {
                                if (selectStatus) {
                                    toastResponse({ response: await transactionStatusAction(selectStatus, sale) })
                                }
                            } }>
                        Simpan
                    </Button>
                </>

            }

        >


            <div className="space-y-2 text-sm">
                <p><strong>Nama Pelanggan:</strong> { sale.Customer.name }</p>
                <p><strong>Tanggal:</strong> { formatDateIndo(sale.date_buy) }</p>
                <p><strong>Total Pembelian:</strong> { formatRupiah(sale.total) }</p>
                <p><strong>Jumlah Barang:</strong> { sale.items } item</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
                <p><strong>Daftar Produk:</strong></p>
                <ul className="space-y-3">
                    { sale.SaleItems.map((item) => (
                        <li key={ item.id } className="flex justify-between">
                            <span className={ 'w-auto' }>{ item.Product.name }</span>
                            <div className={ 'text-end' }>
                                <div
                                    className={ 'text-nowrap' }>{ item.quantity } × { formatRupiah(item.priceAtBuy) }</div>

                                <div>{ formatRupiah(item.priceAtBuy * item.quantity) }</div>
                            </div>
                        </li>
                    )) }
                </ul>
                <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>{ formatRupiah(sale.total) }</span>
                </div>
            </div>

        </ResponsiveModalOnly>
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
            {/* min-w-4xl mx-auto  */ }
            <DialogContent className=" sm:min-w-3xl  mx-auto w-full overflow-y-scroll h-screen sm:h-auto mt-10 sm:mt-0 pb-20 sm:pb-5">
                <DialogHeader>
                    <DialogTitle>Invoice</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Transaksi pada { formatDateIndo(sale.date_buy) } oleh { sale.Customer.name }
                    </p>
                </DialogHeader>
                <div ref={ contentRef }>
                    <InvoiceLetter invoiceData={ sale }/>
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