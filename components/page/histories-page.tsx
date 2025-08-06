"use client"

import { getSaleById } from "@/action/product-action";
import { InvoiceLetter } from "@/components/page/invoice-letter";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ModalProps, SaleCustomers } from "@/interface/actionType"
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import { useQuery } from "@tanstack/react-query";
import { Eye, ReceiptText } from "lucide-react"
import React, { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";

export function HistoriesPage({ histories, }: { histories: SaleCustomers[] }) {
    // const contentRef = useRef<HTMLDivElement>(null)
    const [ isSale, setIsSale ] = useState<SaleCustomers | null>(null)
    const [ isSaleOpen, setIsSaleOpen ] = useState(false)
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <ModalInvoice sale={ isSale } isOpen={ isSaleOpen } setOpenAction={ setIsSaleOpen }/>

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

                                        <Button size="sm" variant="outline"
                                                onClick={ () => {
                                                    setIsSaleOpen(true)
                                                    setIsSale(sale)
                                                } }
                                        >
                                            <ReceiptText className="h-3 w-3"/>
                                        </Button>
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
                                <span>{ item.product.name } : { item.quantity } × { formatRupiah(item.priceAtBuy) }</span>
                                <span>{ formatRupiah(item.priceAtBuy * item.quantity) }</span>
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

export function ModalInvoice({ sale, isOpen, setOpenAction }: { sale: SaleCustomers | null } & ModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    if (!sale) {
        return <Dialog
            onOpenChange={ setOpenAction }
            open={ isOpen }
        >
            <DialogContent
                className="w-full max-w-sm sm:max-w-xl md:max-w-4xl xl:max-w-6xl h-[90vh] overflow-y-scroll px-0 sm:px-4"
            >
                <DialogHeader>
                    <DialogTitle>Invoice Not Found</DialogTitle>
                </DialogHeader>

                Data is not found
            </DialogContent>
        </Dialog>
    }

    return (
        <Dialog
            onOpenChange={ setOpenAction }
            open={ isOpen }
        >
            {/*<DialogTrigger asChild>*/ }
            {/*    <Button size="sm" variant="outline">*/ }
            {/*        <ReceiptText className="h-3 w-3" />*/ }
            {/*    </Button>*/ }
            {/*</DialogTrigger>*/ }

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
                    <InvoiceLetter invoiceData={ sale }/>
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

export function ModalInvoiceFetch({ saleId, isOpen, setOpenAction }: { saleId: number } & ModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const { data, isLoading, isError } = useQuery({
        queryKey: [ 'sale', saleId ],
        gcTime: 30 * 60 * 24,
        queryFn: () => getSaleById(saleId as number),
        enabled: !!saleId, // only fetch if idProduct is truthy
    });

    if (!data || !data.data || isLoading) {
        return <Dialog
            onOpenChange={ setOpenAction }
            open={ isOpen }
        >
            <DialogContent
                className="w-full max-w-sm sm:max-w-xl md:max-w-4xl xl:max-w-6xl h-[90vh] overflow-y-scroll px-0 sm:px-4"
            >
                <DialogHeader>
                    <DialogTitle>Invoice Not Found</DialogTitle>
                </DialogHeader>
                Data is not found
            </DialogContent>
        </Dialog>
    }
    const { data: sale } = data
    return (
        <Dialog
            onOpenChange={ setOpenAction }
            open={ isOpen }
        >
            {/*<DialogTrigger asChild>*/ }
            {/*    <Button size="sm" variant="outline">*/ }
            {/*        <ReceiptText className="h-3 w-3" />*/ }
            {/*    </Button>*/ }
            {/*</DialogTrigger>*/ }

            <DialogContent
                className="w-full max-w-sm sm:max-w-xl md:max-w-4xl xl:max-w-6xl h-[90vh] overflow-y-scroll px-0 sm:px-4"
            >
                <DialogHeader>
                    <DialogTitle>Invoice</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        Transaksi pada { formatDateIndo(sale.date) } oleh { sale.customer.name }
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