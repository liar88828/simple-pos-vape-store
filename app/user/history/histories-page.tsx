"use client"

import { confirmSale, deleteSale, GetHistoriesUser, getHistoriesUserDetail } from "@/app/user/user-action";
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
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ModalProps, SaleCustomers, SessionEmployeePayload, SessionUserPayload } from "@/interface/actionType"
import { STATUS_PREORDER } from "@/lib/constants";
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import { getRoleEmployeePage, toastResponse } from "@/lib/helper";
import { useSaleStore } from "@/store/use-sale-store";
import { Eye, ReceiptText } from "lucide-react"
import React, { useEffect, useRef, useState, useTransition } from "react"
import { useReactToPrint } from "react-to-print";

export function HistoriesPage(
    {
        session,
        title,
        histories,
    }: {
        session: SessionUserPayload
        title: string
        histories: GetHistoriesUser[],
    }) {

    const [ isHistory, setIsHistory ] = useState<GetHistoriesUser | null>(null)
    const [ isHistoryOpen, setIsHistoryOpen ] = useState(false)
    const [ saleData, setSaleData ] = useState<GetHistoriesUser | null>(null)
    const [ isSaleData, setIsSaleData ] = useState(false)

    return (
        <div className="p-6 max-w-7xl mx-auto">
            { isHistory &&
					<ModalInvoice
							history={ isHistory }
							isOpen={ isHistoryOpen }
							setOpenAction={ setIsHistoryOpen }
					/>
            }

            { saleData &&
					<ModalSalesDetail
							session={ session }
							history={ saleData }
							isOpen={ isSaleData }
							setOpenAction={ setIsSaleData }
					/>
            }

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{ title }</h1>
                <div className="flex space-x-2">

                </div>
            </div>


            {/* Detailed Sales */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Detail Pembelian</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                {/*<TableHead>Pelanggan</TableHead>*/ }
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                {/* <TableHead>Metode Bayar</TableHead> */ }
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { histories.map((sale, index) => (
                                <TableRow key={ index }>
                                    <TableCell>{ formatDateIndo(sale.date_buy) }</TableCell>
                                    {/*<TableCell>{ sale.Customer.name }</TableCell>*/ }
                                    <TableCell>{ sale.items }</TableCell>
                                    <TableCell>{ formatRupiah(sale.total) }</TableCell>
                                    {/* <TableCell>Cash</TableCell> */ }
                                    <TableCell>
                                        <Badge variant="default">{ sale.statusTransaction }</Badge>
                                    </TableCell>
                                    <TableCell className={ 'space-x-2' }>
                                        <Button
                                            size="sm" variant="outline"
                                            onClick={ () => {
                                                setIsSaleData(true)
                                                setSaleData(sale)
                                            } }>
                                            <Eye className="h-3 w-3"/>
                                        </Button>
                                        <Button
                                            disabled={ sale.statusTransaction === STATUS_PREORDER.PENDING }
                                            size="sm" variant="outline"
                                            onClick={ () => {
                                                setIsHistoryOpen(true)
                                                setIsHistory(sale)
                                            } }
                                        >
                                            <ReceiptText className="h-3 w-3"/>
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

export function ModalSalesDetail(
    {
        history, isOpen, setOpenAction, session
    }: {
        session: SessionEmployeePayload | SessionUserPayload,
        history: GetHistoriesUser,
        isOpen: boolean
        setOpenAction: (open: boolean) => void
    }) {
    const [ isPending, startTransition ] = useTransition()
    const { dataSaleDetail, isLoading, getDataSaleDetail,confirmSaleEmployee,removeSale } = useSaleStore()
    const [ statusTransaction, setStatusTransaction ] = useState<string>(dataSaleDetail?.statusTransaction ?? STATUS_PREORDER.PENDING)

    useEffect(() => {
        getDataSaleDetail(history.id).then()
    }, [ history.id, getDataSaleDetail ]);

    const handleDelete = async () => {
        startTransition(async () => {
            toastResponse({
                response: await removeSale(history.id),
                onSuccess: () => setOpenAction(false)
            })
        })
    }

    const handleConfirmEmployee = async () => {
        startTransition(async () => {
            toastResponse({
                response: await confirmSaleEmployee(history.id, statusTransaction),
                onSuccess: () => setOpenAction(false)
            })
        })
    }

    if (!history || !dataSaleDetail||isLoading) {
        return <NotFoundDialog isOpen={ isOpen } setOpenAction={ setOpenAction }/>
    }

    return (
        <Dialog
            open={ isOpen }
            onOpenChange={ setOpenAction }
        >
            {/*<DialogTrigger asChild>*/ }
            {/*    <Button size="sm" variant="outline">*/ }
            {/*        <Eye className="h-3 w-3"/>*/ }
            {/*    </Button>*/ }
            {/*</DialogTrigger>*/ }
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detail Transaksi</DialogTitle>
                    <DialogDescription>
                        Transaksi oleh { dataSaleDetail.Customer.name } pada { formatDateIndo(dataSaleDetail.date_buy) }
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 text-sm">
                    <p><strong>Nama Pelanggan:</strong> { dataSaleDetail.Customer.name }</p>
                    <p><strong>Tanggal:</strong> { formatDateIndo(dataSaleDetail.date_buy) }</p>
                    <p><strong>Total Pembelian:</strong> { formatRupiah(dataSaleDetail.total) }</p>
                    <p><strong>Jumlah Barang:</strong> { dataSaleDetail.items } item</p>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Daftar Produk:</strong></p>
                    <ul className="space-y-1">
                        { dataSaleDetail.SaleItems.map((item) => (
                            <li key={ item.id } className="flex justify-between">
                                <span>{ item.Product.name } : { item.quantity } × { formatRupiah(item.priceAtBuy) }</span>
                                <span>{ formatRupiah(item.priceAtBuy * item.quantity) }</span>
                            </li>
                        )) }
                    </ul>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total</span>
                        <span>{ formatRupiah(dataSaleDetail.total) }</span>
                    </div>
                </div>
                <DialogFooter>
                    <Select defaultValue={ statusTransaction } onValueChange={ setStatusTransaction }>
                        <SelectTrigger>
                            <SelectValue placeholder={ 'Select Transaction' }/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Transaction Status</SelectLabel>
                                { [ STATUS_PREORDER.SUCCESS, STATUS_PREORDER.PENDING ].map((item) => (
                                    <SelectItem key={ item } value={ item }>{ item }</SelectItem>
                                )) }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    { getRoleEmployeePage(session.role) &&
							<Button disabled={ isPending }
									onClick={ handleConfirmEmployee }>Confirm
							</Button>
                    }

                    {
                        dataSaleDetail.statusTransaction === STATUS_PREORDER.PENDING
                            ? <DialogClose asChild>
                                <Button disabled={ isPending }
                                        variant={ 'destructive' }
                                        onClick={ handleDelete }>Delete</Button>
                            </DialogClose>
                            : null
                    }

                    <DialogClose asChild>
                        <Button variant="outline">Tutup</Button>
                    </DialogClose>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

export function ModalInvoice({ history, isOpen, setOpenAction }: { history: GetHistoriesUser } & ModalProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const { dataSaleDetail, isLoading, getDataSaleDetail } = useSaleStore()
    useEffect(() => {
        getDataSaleDetail(history.id).then()
    }, [ history.id, getDataSaleDetail ]);

    if (!history || !dataSaleDetail || isLoading) {
        return <NotFoundDialog isOpen={ isOpen } setOpenAction={ setOpenAction }/>
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
                    <DialogDescription>Transaksi
                        pada { formatDateIndo(dataSaleDetail.date_buy) } oleh { dataSaleDetail.Customer.name }</DialogDescription>
                </DialogHeader>

                <div ref={ contentRef }>
                    <InvoiceLetter invoiceData={ dataSaleDetail }/>
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

export function NotFoundDialog(
    {
        desc = 'Data is not found',
        title = 'Data Not Found',
        isOpen, setOpenAction
    }: {
        title?: string,
        desc?: string,
        isOpen: boolean,
        setOpenAction: (value: boolean) => void
    }) {
    return (
        <Dialog
            onOpenChange={ setOpenAction }
            open={ isOpen }
        >
            <DialogContent
                className="w-full max-w-sm sm:max-w-xl md:max-w-4xl xl:max-w-6xl h-[90vh] overflow-y-scroll px-0 sm:px-4"
            >
                <DialogHeader>
                    <DialogTitle>{ title }</DialogTitle>
                    <DialogDescription>{ desc }</DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
