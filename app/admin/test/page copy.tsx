'use client'
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function PreOrderInvoicexx() {

    const orderData = {
        id: 3,
        customerId: 10,
        productId: 4,
        quantity: 20,
        estimatedDate: "2025-06-03T12:00:59.927Z",
        createdAt: "2025-06-04T05:34:10.000Z",
        status: "Success",
        customer: {
            id: 10,
            name: "_admin",
            age: 0,
            totalPurchase: 500000,
            status: "verified",
            lastPurchase: "2025-06-03T11:36:44.673Z"
        },
        product: {
            id: 4,
            name: "apik update x",
            category: "liquid",
            price: 300000,
            stock: 4000,
            minStock: 10,
            image: "https://picsum.photos/200/300",
            description: "iki enak ",
            nicotineLevel: "12mg",
            flavor: "asdasd",
            type: "vanta"
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
            "max-w-4xl mx-auto p-8 shadow-lg bg-white",
            "dark:bg-neutral-900",
            "print:bg-white print:shadow-none print:p-0"
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

            <Separator className="print:hidden"/>

            <CardContent className='space-y-5'>
                {/* Customer Info & Order Info */ }
                <div className={ cn("grid grid-cols-2 gap-8", "print:grid-cols-2") }>
                    <div>
                        <h3 className={ cn("text-lg font-semibold text-gray-800 mb-3", "dark:text-white", "print:text-black") }>
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
                                Total Purchases: { formatCurrency(orderData.customer.totalPurchase) }
                            </p>
                            <p className={ cn("text-gray-600", "dark:text-gray-300") }>
                                Last Purchase: { formatDate(orderData.customer.lastPurchase) }
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
                                <span className="font-medium">{ formatDate(orderData.createdAt) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={ cn("text-gray-600", "dark:text-gray-300") }>Estimated Delivery:</span>
                                <span
                                    className="font-medium text-purple-600">{ formatDate(orderData.estimatedDate) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={ cn("text-gray-600", "dark:text-gray-300") }>Product ID:</span>
                                <span className="font-medium">{ orderData.productId }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className={ cn("text-gray-600", "dark:text-gray-300") }>Available Stock:</span>
                                <span className="font-medium text-green-600">{ orderData.product.stock } units</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Info */ }
                <div className="">
                    <h3 className={ cn("text-lg font-semibold text-gray-800 mb-4", "dark:text-white", "print:text-black") }>
                        Product Information:
                    </h3>
                    <div
                        className={ cn("bg-white border-2 rounded-lg overflow-hidden", "dark:bg-gray-800 dark:border-gray-700") }>
                        <div className="md:flex">
                            <div className="  md:flex-shrink-0">
                                <img
                                    src={ orderData.product.image }
                                    alt={ orderData.product.name }
                                    className="w-40 h-full  object-cover"
                                />
                            </div>
                            <div className="p-6 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className={ cn("text-xl font-bold mb-2", "text-gray-800", "dark:text-white") }>
                                            { orderData.product.name }
                                        </h4>
                                        <p className={ cn("mb-2", "text-gray-600", "dark:text-gray-300") }>{ orderData.product.description }</p>
                                        <div
                                            className={ cn("space-y-1 text-sm", "text-gray-600", "dark:text-gray-300") }>
                                            <p><span
                                                className="font-medium">Category:</span> { orderData.product.category }
                                            </p>
                                            <p><span className="font-medium">Type:</span> { orderData.product.type }</p>
                                            <p><span className="font-medium">Flavor:</span> { orderData.product.flavor }
                                            </p>
                                            <p><span
                                                className="font-medium">Nicotine Level:</span> { orderData.product.nicotineLevel }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={ cn("text-2xl font-bold mb-2", "text-purple-600", "print:text-black") }>
                                            { formatCurrency(orderData.product.price) }
                                        </div>
                                        <div className={ cn("text-sm", "text-gray-600", "dark:text-gray-300") }>per
                                            unit
                                        </div>
                                        <div className="mt-4">
                                            <div
                                                className="text-lg font-semibold">Quantity: { orderData.quantity }</div>
                                            <div className={ cn("text-sm", "text-gray-600", "dark:text-gray-300") }>
                                                Min Stock: { orderData.product.minStock }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary */ }
                <div className="flex justify-end ">
                    <Card>
                        <CardHeader>
                            <CardTitle> Order Summary </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm font-medium">
                            <div className="flex justify-between">
                                <span className="">Product:</span>
                                <span>{ orderData.product.name }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="">Unit Price:</span>
                                <span>{ formatCurrency(orderData.product.price) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="">Quantity:</span>
                                <span>{ orderData.quantity } units</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className="">Subtotal:</span>
                                <span>{ formatCurrency(calculateTotal()) }</span>
                            </div>
                            <div className="flex justify-between ">
                                <span className="">Tax (0%):</span>
                                <span>{ formatCurrency(0) }</span>
                            </div>
                            <Separator/>
                            <div className={ "flex justify-between text-xl font-bold" }>
                                <span>Total Amount:</span>
                                <span>{ formatCurrency(calculateTotal()) }</span>
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
                        <p>• Estimated delivery date: <strong>{ formatDate(orderData.estimatedDate) }</strong></p>
                    </div>
                </div>
            </CardContent>

            <Separator className="print:hidden"/>
            <CardFooter className="print:mt-8 print:pt-4">
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
                        This pre-order confirmation was generated on { formatDate(orderData.createdAt) }
                    </p>
                </div>
            </CardFooter>

        </Card>
    );
}

type variantComponent = "default" | "secondary" | "destructive" | "outline";

export function PreOrderInvoicex() {
    const orderData = {
        id: 3,
        customerId: 10,
        productId: 4,
        quantity: 20,
        estimatedDate: "2025-06-03T12:00:59.927Z",
        createdAt: "2025-06-04T05:34:10.000Z",
        status: "Success",
        customer: {
            id: 10,
            name: "_admin",
            age: 0,
            totalPurchase: 500000,
            status: "verified",
            lastPurchase: "2025-06-03T11:36:44.673Z"
        },
        product: {
            id: 4,
            name: "apik update x",
            category: "liquid",
            price: 300000,
            stock: 4000,
            minStock: 10,
            image: "https://picsum.photos/200/300",
            description: "iki enak ",
            nicotineLevel: "12mg",
            flavor: "asdasd",
            type: "vanta"
        }
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(amount);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    const getStatusVariant = (status: string): variantComponent => {
        switch (status.toLowerCase()) {
            case "success":
                return "secondary";
            case "pending":
                return "destructive";
            case "verified":
                return "default";
            default:
                return "default";
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">PRE-ORDER INVOICE</CardTitle>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">Order #{ orderData.id }</span>
                        <Badge variant={ getStatusVariant(orderData.status) }>
                            { orderData.status.toUpperCase() }
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Customer Information</h3>
                        <div className="space-y-1 text-sm">
                            <p className="font-medium text-base">{ orderData.customer.name }</p>
                            <p>ID: { orderData.customer.id }</p>
                            { orderData.customer.age > 0 && <p>Age: { orderData.customer.age }</p> }
                            <p>Total: { formatCurrency(orderData.customer.totalPurchase) }</p>
                            <p>Last: { formatDate(orderData.customer.lastPurchase) }</p>
                            <Badge variant={ getStatusVariant(orderData.customer.status) }>
                                { orderData.customer.status.toUpperCase() }
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Order Details</h3>
                        <div className="space-y-1 text-sm">
                            <p>Date: { formatDate(orderData.createdAt) }</p>
                            <p>Est. Delivery: { formatDate(orderData.estimatedDate) }</p>
                            <p>Product ID: { orderData.productId }</p>
                            <p>Stock: { orderData.product.stock } units</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <img
                        src={ orderData.product.image }
                        alt={ orderData.product.name }
                        className="w-32 h-32 rounded-md object-cover"
                    />
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg">{ orderData.product.name }</h4>
                        <p className="text-sm text-muted-foreground">{ orderData.product.description }</p>
                        <Separator className="my-2"/>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p>Category: { orderData.product.category }</p>
                            <p>Type: { orderData.product.type }</p>
                            <p>Flavor: { orderData.product.flavor }</p>
                            <p>Nicotine: { orderData.product.nicotineLevel }</p>
                            <p>Min Stock: { orderData.product.minStock }</p>
                            <p className="font-semibold">Price: { formatCurrency(orderData.product.price) }</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Product</span>
                        <span>{ orderData.product.name }</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Unit Price</span>
                        <span>{ formatCurrency(orderData.product.price) }</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Quantity</span>
                        <span>{ orderData.quantity } units</span>
                    </div>
                    <div className="flex justify-between font-medium">
                        <span>Subtotal</span>
                        <span>{ formatCurrency(orderData.quantity * orderData.product.price) }</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax (0%)</span>
                        <span>{ formatCurrency(0) }</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{ formatCurrency(orderData.quantity * orderData.product.price) }</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function PreOrderInvoice_x() {
    const orderData = {
        id: 3,
        customerId: 10,
        productId: 4,
        quantity: 20,
        estimatedDate: "2025-06-03T12:00:59.927Z",
        createdAt: "2025-06-04T05:34:10.000Z",
        status: "Success",
        customer: {
            id: 10,
            name: "_admin",
            age: 0,
            totalPurchase: 500000,
            status: "verified",
            lastPurchase: "2025-06-03T11:36:44.673Z"
        },
        product: {
            id: 4,
            name: "apik update x",
            category: "liquid",
            price: 300000,
            stock: 4000,
            minStock: 10,
            image: "https://picsum.photos/200/300",
            description: "iki enak ",
            nicotineLevel: "12mg",
            flavor: "asdasd",
            type: "vanta"
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
            {/* Header */ }
            <div className="border-b-2 border-gray-300 pb-6 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">PRE-ORDER INVOICE</h1>
                        <p className="text-lg text-gray-600">Order #{ orderData.id }</p>
                        <div className="mt-2">
                            <span
                                className={ `px-3 py-1 rounded-full text-sm font-medium ${ getStatusColor(orderData.status) }` }>
                                { orderData.status.toUpperCase() }
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 mb-2">Vape Store</div>
                        <div className="text-gray-600">
                            <p>123 Business Street</p>
                            <p>Yogyakarta, Indonesia</p>
                            <p>Phone: +62 XXX XXXX XXXX</p>
                            <p>Email: info@vapestore.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details */ }
            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800 text-lg">{ orderData.customer.name }</p>
                        <p className="text-gray-600">Customer ID: { orderData.customer.id }</p>
                        { orderData.customer.age > 0 && (
                            <p className="text-gray-600">Age: { orderData.customer.age }</p>
                        ) }
                        <p className="text-gray-600">Total
                            Purchases: { formatCurrency(orderData.customer.totalPurchase) }</p>
                        <p className="text-gray-600">Last Purchase: { formatDate(orderData.customer.lastPurchase) }</p>
                        <div className="mt-2">
                            <span
                                className={ `px-2 py-1 rounded-full text-xs font-medium ${ getStatusColor(orderData.customer.status) }` }>
                                { orderData.customer.status.toUpperCase() }
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details:</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-medium">{ formatDate(orderData.createdAt) }</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estimated Delivery:</span>
                            <span className="font-medium text-purple-600">{ formatDate(orderData.estimatedDate) }</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Product ID:</span>
                            <span className="font-medium">{ orderData.productId }</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Available Stock:</span>
                            <span className="font-medium text-green-600">{ orderData.product.stock } units</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details */ }
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Information:</h3>
                <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-48 md:flex-shrink-0">
                            <img
                                src={ orderData.product.image }
                                alt={ orderData.product.name }
                                className="w-full h-48 md:h-full object-cover"
                            />
                        </div>
                        <div className="p-6 flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">{ orderData.product.name }</h4>
                                    <p className="text-gray-600 mb-2">{ orderData.product.description }</p>
                                    <div className="space-y-1 text-sm">
                                        <p><span className="font-medium">Category:</span> { orderData.product.category }
                                        </p>
                                        <p><span className="font-medium">Type:</span> { orderData.product.type }</p>
                                        <p><span className="font-medium">Flavor:</span> { orderData.product.flavor }</p>
                                        <p><span
                                            className="font-medium">Nicotine Level:</span> { orderData.product.nicotineLevel }
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-purple-600 mb-2">
                                        { formatCurrency(orderData.product.price) }
                                    </div>
                                    <div className="text-gray-600 text-sm">per unit</div>
                                    <div className="mt-4">
                                        <div className="text-lg font-semibold">Quantity: { orderData.quantity }</div>
                                        <div className="text-sm text-gray-600">Min
                                            Stock: { orderData.product.minStock }</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Summary */ }
            <div className="flex justify-end mb-8">
                <div className="w-96">
                    <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">Product:</span>
                                <span>{ orderData.product.name }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Unit Price:</span>
                                <span>{ formatCurrency(orderData.product.price) }</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Quantity:</span>
                                <span>{ orderData.quantity } units</span>
                            </div>
                            <div className="flex justify-between text-lg">
                                <span className="font-medium">Subtotal:</span>
                                <span>{ formatCurrency(calculateTotal()) }</span>
                            </div>
                            <div className="flex justify-between text-lg">
                                <span className="font-medium">Tax (0%):</span>
                                <span>{ formatCurrency(0) }</span>
                            </div>
                            <hr className="border-purple-300"/>
                            <div className="flex justify-between text-xl font-bold text-purple-800">
                                <span>Total Amount:</span>
                                <span>{ formatCurrency(calculateTotal()) }</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Important Notice */ }
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                <div className="flex">
                    <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-800">Pre-Order Notice</h4>
                        <div className="mt-2 text-sm text-yellow-700">
                            <p>• This is a pre-order confirmation. Your order will be processed and shipped by the
                                estimated delivery date.</p>
                            <p>• Payment is required to confirm your pre-order.</p>
                            <p>• You will receive a tracking number once your order ships.</p>
                            <p>• Estimated delivery date: <strong>{ formatDate(orderData.estimatedDate) }</strong></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */ }
            <div className="border-t-2 border-gray-300 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Payment Information:</h4>
                        <p className="text-sm text-gray-600 mb-1">
                            Please complete payment within 24 hours to confirm your pre-order.
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            Bank Transfer: Account XXX-XXXX-XXXX
                        </p>
                        <p className="text-sm text-gray-600">
                            E-Wallet: Available via app
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Contact Us:</h4>
                        <p className="text-sm text-gray-600 mb-1">
                            Questions about your pre-order? Contact us!
                        </p>
                        <p className="text-sm text-gray-600 mb-1">
                            WhatsApp: +62 XXX XXXX XXXX
                        </p>
                        <p className="text-sm text-gray-600">
                            Email: support@vapestore.com
                        </p>
                    </div>
                </div>

                <div className="text-center mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        This pre-order confirmation was generated on { formatDate(orderData.createdAt) }
                    </p>
                </div>
            </div>
        </div>
    );
}