'use client';

import { getSettingPayment, GetSettingPaymentAll, getStoreLoader } from "@/app/admin/setting/setting-action";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/ui/table';
import { SaleCustomers } from '@/interface/actionType';
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import { Store } from "@/lib/validation";
import React, { useEffect, useState } from 'react';

export function InvoiceLetter({ invoiceData }: { invoiceData: SaleCustomers }) {
    const [ store, setStore ] = useState<Store | null>(null)
    const [ payments, setPayments ] = useState<GetSettingPaymentAll | null>()

    useEffect(() => {
        getStoreLoader().then(setStore)
        getSettingPayment().then(setPayments)
    }, []);

    const calculateSubtotal = (quantity: number, price: number) => quantity * price;
    // container mx-auto  p-4 md:p-8
    // if(!store){
    //     return <LoadingComponentSkeleton count={2}/>
    // }

    return (
        <Card className={'w-full'}>
            {/* Header */}
            <CardHeader >
                <div className="flex flex-col md:flex-row print:flex-row justify-between items-start gap-4">
                    <div>
                        <CardTitle className="text-3xl font-bold">INVOICE</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground">
                            Invoice #{invoiceData.id}
                        </CardDescription>
                    </div>
                    { !store
                        ? <div>Loading ...</div>
                        : <div className="text-left md:text-right text-sm md:text-base">
                            <div className="text-2xl font-bold text-primary mb-2">{ store.name }</div>
                            <p className="text-muted-foreground">{ store.address }</p>
                            {/*<p className="text-muted-foreground">{store.}</p>*/ }
                            <p className="text-muted-foreground">Phone: { store.phone }</p>
                        </div>
                    }

                </div>
            </CardHeader>
            <Separator />

            <CardContent>
                {/* Bill To & Invoice Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2  ">
                    <div>
                        <h1 className="text-2xl font-bold">Bill To:</h1>
                        <div className="space-y-1 text-sm">
                            <p className="font-medium">{ invoiceData.Customer.name }</p>
                            <p className="text-muted-foreground">Customer ID: { invoiceData.Customer.id }</p>
                            <p className="text-muted-foreground">Age: { invoiceData.Customer.age }</p>
                            <p>
                                Status:
                                <span
                                    className={ `ml-1 px-2 py-1 rounded-full text-xs font-medium ${ invoiceData.Customer.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}
                                >
                                    { invoiceData.Customer.status.toUpperCase() }
                                </span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">Invoice Details:</h1>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Date:</span>
                                <span>{formatDateIndo(invoiceData.date_buy)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Items:</span>
                                <span>{invoiceData.items}</span>
                            </div>
                            {/*<div className="flex justify-between">*/ }
                            {/*    <span className="text-muted-foreground">Customer Total Purchases:</span>*/ }
                            {/*    <span>{formatRupiah(invoiceData.Customer.totalPurchase)}</span>*/ }
                            {/*</div>*/ }
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mt-8">
                    <h1 className="text-2xl font-bold mb-4">Items</h1>
                    <Table className='text-xs'>
                        <TableHeader>
                            <TableRow className="whitespace-nowrap">
                                {/* <TableHead>#</TableHead> */}
                                <TableHead>Product</TableHead>
                                <TableHead>Details</TableHead>
                                {/* <TableHead className="text-center">Qty</TableHead> */}
                                <TableHead className="text-right">Unit Price</TableHead>
                                {/* <TableHead className="text-right">Subtotal</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoiceData.SaleItems.map((item, index) => (
                                <TableRow key={item.id} className="whitespace-nowrap">
                                    {/* <TableCell>{index + 1}</TableCell> */}
                                    <TableCell className=" space-y-1">
                                        <div className="font-medium text-wrap">{index + 1}. {item.Product.name}</div>
                                        <div className="text-muted-foreground ">
                                            Category: {item.Product.category}
                                        </div>
                                    </TableCell>
                                    <TableCell className=" space-y-1">
                                        <p>Type: {item.Product.type}</p>
                                        <p className='flex-wrap'>Flavor: {item.Product.flavor}</p>
                                        <p>Nicotine: {item.Product.nicotineLevel}</p>
                                        {/* <p>Description: {item.Product.description}</p> */}
                                    </TableCell>
                                    {/* <TableCell className="text-center">{item.quantity}</TableCell> */}
                                    <TableCell className="text-right space-y-2">
                                        <div> { item.quantity } x { formatRupiah(item.priceAtBuy) } </div>
                                        <div>{ formatRupiah(calculateSubtotal(item.quantity, item.priceAtBuy)) }</div>

                                    </TableCell>
                                    {/* <TableCell className="text-right font-semibold">
                                            
                                        </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mt-6">
                    <div className="w-full md:w-80">
                        <div className="space-y-3 py-6">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Subtotal:</span>
                                <span>{formatRupiah(invoiceData.total)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Tax (0%):</span>
                                <span>{formatRupiah(0)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-primary">{formatRupiah(invoiceData.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

            <Separator />

            {/* Footer */}
            <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm  print:grid-cols-3 ">
                { !payments
                    ? <div>Loading ...</div>
                    : <div className={'space-y-2'}>
                        <h4 className="font-semibold mb-1">Payment Information:</h4>
                        <p className="text-muted-foreground">Please make payment within 30 days of invoice date.</p>
                        <p>Bank Transfer: </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {payments.PaymentList.map((item) => (
                                <li key={item.id} className="flex justify-between   ">
                                    <p> {item.title} ({formatRupiah(item.fee)}) </p> <p><b> {item.rekening}</b></p>
                                </li>
                            ))}
                        </ul>
                    </div>

                }
                <div>
                    <h4 className="font-semibold mb-1">Thank You!</h4>
                    <p className="text-muted-foreground">
                        We appreciate your business and look forward to serving you again.
                    </p>
                </div>
            </CardFooter>

            <Separator />
            <div className="text-center text-xs text-muted-foreground mt-4">
                This is a computer-generated invoice. No signature required.
            </div>
        </Card>
    );
}
