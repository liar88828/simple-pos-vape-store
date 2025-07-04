import { PreorderProduct } from '@/action/product-action';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateIndo, formatRupiah } from '@/lib/my-utils';
import { cn } from '@/lib/utils';
import { Droplets, Eye, Printer } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { twMerge } from 'tailwind-merge';

export function PreOrderDialog({ orderData }: { orderData: PreorderProduct }) {
    const [ open, setOpen ] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const reactToPrintFn = useReactToPrint({ contentRef })
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3"/>
                </Button>
            </DialogTrigger>

            <DialogContent
                className="min-w-4xl h-[80vh] flex flex-col"
            >
                <DialogHeader>
                    <DialogTitle>Pre-Order Invoice</DialogTitle>
                </DialogHeader>

                {/* Scrollable content area */ }
                <div ref={ contentRef } className="overflow-y-auto flex-1 pr-2">
                    <PreOrderInvoice orderData={ orderData }/>
                </div>
                <DialogFooter>

                    {/*<DialogClose asChild>*/ }
                    <Button
                        onClick={ () => {
                            reactToPrintFn()
                            setOpen(false)
                        } }>
                            <Printer/> Print
                        </Button>
                    {/*</DialogClose>*/ }
                    <DialogClose asChild>
                        <Button variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function PreOrderInvoice({ orderData }: { orderData: PreorderProduct }) {

    const product = orderData.product
    const calculateTotal = () => {
        return orderData.quantity * orderData.product.price;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'verified':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className={ cn(
            "max-w-4xl mx-auto  shadow-lg bg-white",
            "dark:bg-neutral-900",
            "print:bg-white print:shadow-none print:p-2 print:border-none"
        ) }>
            {/* Header */ }
            <CardHeader>
                <div className={ cn("flex justify-between items-start", "print:flex-row") }>
                    <div>
                        <CardTitle
                            className={ cn("text-3xl font-bold text-gray-800", "dark:text-white", "print:text-black") }>
                            PRE-ORDER INVOICE
                        </CardTitle>
                        <CardDescription
                            className={ cn("text-lg text-gray-600", "dark:text-gray-300", "print:text-black") }>
                            Order #{ orderData.id }
                        </CardDescription>
                        <Badge variant={ 'secondary' }>
                            { orderData.status.toUpperCase() }
                        </Badge>

                    </div>

                    <div className="text-right">
                        <div className={ cn("text-2xl font-bold text-purple-600 mb-2", "print:text-black") }>Vape
                            Store
                        </div>
                        <div className={ cn("text-gray-600 text-sm", "dark:text-gray-300", "print:text-black") }>
                            <p>123 Business Street</p>
                            <p>Yogyakarta, Indonesia</p>
                            <p>Phone: +62 XXX XXXX XXXX</p>
                            <p>Email: info@vapestore.com</p>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <Separator/>

            <CardContent className='space-y-5'>
                {/* Customer Info & Order Info */ }
                <div className={ cn("grid grid-cols-2 gap-8", "print:grid-cols-2") }>
                    <div>
                        <h3 className={ cn("text-lg font-semibold text-gray-800 mb-3",
                            "dark:text-white",
                            "print:text-black") }>
                            Customer Information:
                        </h3>
                        <div className={ cn("bg-gray-50 p-4 rounded-lg", "dark:bg-gray-800") }>
                            <p className={ cn("font-medium text-lg", "text-gray-800", "dark:text-white") }>
                                { orderData.customer.name }
                            </p>
                            <p className={ cn("text-gray-600", "dark:text-gray-300") }>Customer
                                ID: { orderData.customer.id }</p>
                            { orderData.customer.age > 0 && (
                                <p className={ cn("text-gray-600", "dark:text-gray-300") }>Age: { orderData.customer.age }</p>
                            ) }
                            <p className={ cn("text-gray-600", "dark:text-gray-300") }>
                                Total Purchases: { formatRupiah(orderData.customer.totalPurchase) }
                            </p>
                            <p className={ cn("text-gray-600", "dark:text-gray-300") }>
                                Last Purchase: { formatDateIndo(orderData.customer.lastPurchase) }
                            </p>
                            <div className="mt-2">
                                <span className={ cn(
                                    "px-2 py-1 rounded-full text-xs font-medium",
                                    getStatusColor(orderData.customer.status)
                                ) }>
                                    { orderData.customer.status.toUpperCase() }
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className={ cn("text-lg font-semibold text-gray-800 mb-3", "dark:text-white", "print:text-black") }>
                            Order Details:
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className={ cn("text-gray-600", "dark:text-gray-300") }>Order Date:</span>
                                <span className="font-medium">{ formatDateIndo(orderData.createdAt) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={ cn("text-gray-600", "dark:text-gray-300") }>Estimated Delivery:</span>
                                <span
                                    className="font-medium underline">{ formatDateIndo(orderData.estimatedDate) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={ cn("text-gray-600", "dark:text-gray-300") }>Product ID:</span>
                                <span className="font-medium">{ orderData.productId }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={ cn("text-gray-600", "dark:text-gray-300") }>Available Stock:</span>
                                <span className="font-medium underline">{ orderData.product.stock } units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info */ }
                <div className="">
                    <h3 className={ cn("text-lg font-semibold text-gray-800 mb-4", "dark:text-white", "print:text-black") }>
                        Product Information:
                    </h3>
                    {/* <InvoicePreorder1 orderData={orderData} /> */ }
                    <InvoicePreorderTable orderData={ orderData }/>
                </div>


                {/* Summary */ }
                <div className="flex justify-end ">
                    <Card className='border-none bg-gray-800 print:bg-gray-50 print:shadow-none'>
                        <CardHeader>
                            <CardTitle> Order Summary </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-3 text-sm font-medium  ">

                                <div className="flex justify-between">
                                    <strong>Product:</strong>
                                    <span>{ orderData.product.name }</span>
                                </div>
                                <div className="flex justify-between">
                                    <strong>Unit Price:</strong>
                                    <span>{ formatRupiah(orderData.product.price) }</span>
                                </div>
                                <div className="flex justify-between">
                                    <strong className="">Quantity:</strong>
                                    <span>{ orderData.quantity } units</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong className="">Subtotal:</strong>
                                    <span>{ formatRupiah(calculateTotal()) }</span>
                                </div>
                                <div className="flex justify-between ">
                                    <strong className="">Tax (0%):</strong>
                                    <span>{ formatRupiah(0) }</span>
                                </div>
                            </div>

                            <Separator className='my-3'/>
                            <div className={ "flex justify-between text-xl font-bold" }>
                                <span>Total Amount : </span>
                                <span className='underline'>{ formatRupiah(calculateTotal()) }</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notice */ }
                <div
                    className={ cn("border-l-4 p-4 mb-8 print:hidden", "bg-yellow-50 border-yellow-400", "dark:bg-yellow-900 dark:border-yellow-600") }>
                    <h4 className={ cn("text-sm font-medium", "text-yellow-800", "dark:text-yellow-200") }>
                        Pre-Order Notice
                    </h4>
                    <div className={ cn("mt-2 text-sm space-y-1", "text-yellow-700", "dark:text-yellow-300") }>
                        <p>• This is a pre-order confirmation. Your order will be processed and shipped by the estimated
                            delivery date.</p>
                        <p>• Payment is required to confirm your pre-order.</p>
                        <p>• You will receive a tracking number once your order ships.</p>
                        <p>• Estimated delivery date: <strong>{ formatDateIndo(orderData.estimatedDate) }</strong></p>
                    </div>
                </div>
            </CardContent>

            <Separator className='print:hidden'/>
            <CardFooter className=" print:hidden print:mt-8 print:pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className={ twMerge(
                            "font-semibold mb-2",
                            "text-gray-800",
                            "dark:text-gray-100",
                            "print:text-black"
                        ) }>
                            Payment Information:
                        </h4>
                        <p className={ twMerge("text-sm mb-1", "text-gray-600", "dark:text-gray-300", "print:text-black") }>
                            Please complete payment within 24 hours to confirm your pre-order.
                        </p>
                        <p className={ twMerge("text-sm mb-1", "text-gray-600", "dark:text-gray-300", "print:text-black") }>
                            Bank Transfer: Account XXX-XXXX-XXXX
                        </p>
                        <p className={ twMerge("text-sm", "text-gray-600", "dark:text-gray-300", "print:text-black") }>
                            E-Wallet: Available via app
                        </p>
                    </div>
                    <div>
                        <h4 className={ twMerge(
                            "font-semibold mb-2",
                            "text-gray-800",
                            "dark:text-gray-100",
                            "print:text-black"
                        ) }>
                            Contact Us:
                        </h4>
                        <p className={ twMerge("text-sm mb-1", "text-gray-600", "dark:text-gray-300", "print:text-black") }>
                            Questions about your pre-order? Contact us!
                        </p>
                        <p className={ twMerge("text-sm mb-1", "text-gray-600", "dark:text-gray-300", "print:text-black") }>
                            WhatsApp: +62 XXX XXXX XXXX
                        </p>
                        <p className={ twMerge("text-sm", "text-gray-600", "dark:text-gray-300", "print:text-black") }>
                            Email: support@vapestore.com
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6 pt-4 border-t border-gray-200 print:border-black">
                    <p className={ twMerge("text-xs", "text-gray-500", "dark:text-gray-300", "print:text-black") }>
                        This pre-order confirmation was generated on { formatDateIndo(orderData.createdAt) }
                    </p>
                </div>
            </CardFooter>

        </Card>
    );
}

export function InvoicePreorderTable({ orderData }: { orderData: PreorderProduct }) {
    const product = orderData.product
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Nicotine</TableHead>
                    <TableHead>Flavor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell>{ product.id }</TableCell>
                    <TableCell>
                        <img
                            src={ product.image }
                            alt={ product.name }
                            className="h-12 w-12 rounded-md object-cover ring-1 ring-gray-300"
                        />
                    </TableCell>
                    <TableCell className="font-semibold">{ product.name }</TableCell>
                    <TableCell>
                        <Badge variant="outline">{ product.category }</Badge>
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                        Rp { product.price.toLocaleString() }
                    </TableCell>
                    <TableCell>{ product.stock }</TableCell>
                    <TableCell>{ product.minStock }</TableCell>
                    <TableCell>
                        <Badge variant="secondary">{ product.nicotineLevel }</Badge>
                    </TableCell>
                    <TableCell>{ product.flavor }</TableCell>
                    <TableCell>
                        <Badge variant="default">{ product.type }</Badge>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">{ product.description }</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export function InvoicePreorder1({ orderData }: { orderData: PreorderProduct }) {
    const product = orderData.product
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
            <CardContent className="p-0">
                <div className="flex flex-row">
                    {/* Image Section */ }
                    <div className="relative flex-shrink-0">
                        <img
                            src={ product.image }
                            alt={ product.name }
                            className="size-44 object-cover rounded-lg"
                        />
                        <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="text-xs">
                                <Droplets className="w-3 h-3 mr-1"/>
                                { product.category }
                            </Badge>
                        </div>
                    </div>

                    {/* Content Section */ }
                    <div className="flex-1 p-4 flex flex-row justify-between items-center">
                        {/* Left Content */ }
                        <div className="flex-1">
                            <CardTitle> { product.name } </CardTitle>
                            <CardDescription> { product.description } </CardDescription>
                            <div className="flex flex-wrap text-sm text-muted-foreground">
                                <p><strong>Type:</strong> { product.type } </p>
                                <p><strong>Flavor:</strong> { product.flavor } </p>
                                <p><strong>Nicotine:</strong> { product.nicotineLevel } </p>
                            </div>
                        </div>

                        {/* Right Content */ }
                        <div className="flex flex-col items-end space-y-3 ml-4">
                            <h1 className="text-xl font-bold text-primary">
                                { formatRupiah(product.price) }
                            </h1>
                            <p>per unit</p>
                            <p className="text-lg font-semibold">Quantity: { orderData.quantity }</p>
                            {/* <Badge variant={'destructive'} className="text-xs">
                                            <SendToBackIcon className="w-3 h-3 mr-1" />
                                            {product.stock.toLocaleString()} stock
                                        </Badge>

                                        <Button size="sm" className="flex items-center space-x-2">
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Add to Cart</span>
                                        </Button> */ }
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

    )
}

export function invoicePreorder({ orderData }: { orderData: PreorderProduct }) {
    return (
        <div className={ cn("bg-white border-2 rounded-lg overflow-hidden", "dark:bg-gray-800 dark:border-gray-700") }>
            <div className="md:flex">
                <div className="  md:flex-shrink-0">
                    <img
                        src={ orderData.product.image }
                        alt={ orderData.product.name }
                        className="size-56  object-cover"
                    />
                </div>
                <div className="p-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className={ cn("text-xl font-bold mb-2", "text-gray-800", "dark:text-white") }>
                                { orderData.product.name }
                            </h4>
                            <p className={ cn("mb-2", "text-gray-600", "dark:text-gray-300") }>{ orderData.product.description }</p>
                            <div className={ cn("space-y-1 text-sm", "text-gray-600", "dark:text-gray-300") }>
                                <p><span className="font-medium">Category:</span> { orderData.product.category }</p>
                                <p><span className="font-medium">Type:</span> { orderData.product.type }</p>
                                <p><span className="font-medium">Flavor:</span> { orderData.product.flavor }</p>
                                <p><span
                                    className="font-medium">Nicotine Level:</span> { orderData.product.nicotineLevel }
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={ cn("text-2xl font-bold mb-2", "print:text-black") }>
                                { formatRupiah(orderData.product.price) }
                            </div>
                            <div className={ cn("text-sm", "text-gray-600", "dark:text-gray-300") }>per unit</div>
                            <div className="mt-4">
                                <div className="text-lg font-semibold">Quantity: { orderData.quantity }</div>
                                <div className={ cn("text-sm", "text-gray-600", "dark:text-gray-300") }>
                                    Min Stock: { orderData.product.minStock }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
