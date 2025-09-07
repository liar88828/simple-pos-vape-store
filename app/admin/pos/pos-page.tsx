"use client"

import { createCustomerNew } from "@/action/customer-action";
import { type  ProductPaging, type ProductPreorder } from "@/action/product-action";
import { ProductsFilter } from "@/app/admin/products/products-page";
import { ProductCart } from "@/app/user/home/product-user-page";
import { InputForm } from "@/components/mini/form-hook";
import { ProductDetailDialogOnly } from "@/components/page/product-detail-dialog-only";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatRupiah } from "@/lib/formatter";
import { toastResponse } from "@/lib/helper";
import { CustomerModelNew, CustomerModelType } from "@/lib/schema";
import { Customer, } from "@/lib/validation";
import { useCartStore } from "@/store/use-cart-store";
import { useSaleStore } from "@/store/use-sale-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, Plus, Search, ShoppingCart } from "lucide-react"
import Link from "next/link";
import React, { useEffect, useMemo, useState, useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form";

type POSPageProps = {
    customers: Customer[], products: ProductPaging,
};

export default function POSPage({ products, customers }: POSPageProps) {
    const [ searchCustomer, setSearchCustomer ] = useState("")
    const [ isProduct, setIsProduct ] = useState<ProductPreorder | null>(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const { cartItems, addToCart } = useCartStore()

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            { isProduct &&
					<ProductDetailDialogOnly
							product={ isProduct } isOpen={ isOpen } isAdd={ true }
							setOpenAction={ setIsOpen }
							onAdd={ () => addToCart(isProduct) }/>
            }

            {/*hidden sm:block*/ }
            <h1 className="text-lg sm:text-3xl font-bold mb-4">POS Kasir</h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Product Selection */ }
                <div className="lg:col-span-2 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Produk</CardTitle>
                            <ProductsFilter products={ products.data } customerName={ searchCustomer }/>
                        </CardHeader>


                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 sm:gap-4 gap-2">
                                { products.data.map((product) => {
                                    const cartItem = cartItems.find(item => item.id === product.id);
                                    const remainingStock = cartItem ? product.stock - cartItem.quantity : product.stock;

                                    return (
                                        <Card key={ product.id }
                                              className="cursor-pointer hover:shadow-md transition-shadow p-0 gap-0">
                                            <picture>

                                                <img
                                                    onClick={ () => {
                                                        setIsOpen(prev => !prev)
                                                        setIsProduct(product)
                                                    } }
                                                    src={ product.image }
                                                    alt={ product.name }
                                                    className="w-full h-40 object-contain rounded bg-white "
                                                />
                                            </picture>
                                            <CardContent className="p-2 md:p-6">
                                                <h3 className="font-medium text-xs sm:text-sm mb-1">{ product.name }</h3>
                                                <p className="text-xs sm:text-xs text-muted-foreground mb-2">{ product.category }</p>
                                                <span
                                                    className="font-bold text-sm">{ formatRupiah(product.price) }</span>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-muted-foreground mt-1">Stok: { remainingStock }</p>
                                                    <Button size="sm"
                                                            onClick={ () => addToCart(product) }
                                                            disabled={ remainingStock <= 0 }
                                                    >
                                                        <Plus className=" size-3"/>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                }) }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart & Checkout Keranjang Belanja */ }
                <PosPageCheckOut products={ products }
                                 customers={ customers }
                                 searchCustomer={ searchCustomer }
                                 setSearchCustomer={ setSearchCustomer }
                />
            </div>
        </div>
    )
}

// Cart & Checkout Keranjang Belanja
export function PosPageCheckOut({ customers, products, searchCustomer, setSearchCustomer, }: POSPageProps & {
    searchCustomer: string,
    setSearchCustomer: (v: string) => void,
}) {

    const [ isPending, startTransition ] = useTransition()
    const [ selectedCustomer, setSelectedCustomer ] = useState<Customer | null>(null)
    const [ paymentMethod, setPaymentMethod ] = useState("cod")
    const {
        clientMoney,
        setCartItems,
        removeFromCart,
        incrementItem,
        decrementItem,
        cartItems,
        calculateCart,
        getPayment,
        payment,
        setField,
        total, tax, grandTotal
    } = useCartStore()
    const { createSaleAdmin } = useSaleStore()

    useEffect(() => {
        getPayment().then()
    }, [ getPayment ])

    useEffect(() => {
        calculateCart()
    }, [calculateCart]);

    const getProductStock = (id: string) => {
        return products.data.find(product => product.id === id)?.stock || 0;
    };

    async function onTransaction() {
        startTransition(async () => {
            toastResponse({
                response: await createSaleAdmin(cartItems, selectedCustomer, ''),
                onSuccess: () => {
                    setSearchCustomer('')
                    setPaymentMethod('')
                    setField("clientMoney", 0)
                    setSelectedCustomer(null)
                    setCartItems([])
                }
            })
        })
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Keranjang Belanja</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-4">
                        <ProductCart cartItems={ cartItems }
                                     decrementItemAction={ decrementItem }
                                     incrementItemAction={ incrementItem }
                                     getProductStockAction={ getProductStock }
                                     removeFromCartAction={ removeFromCart }
                        />


                        {/* Age Verification */ }
                        {/*<div className="border-t pt-4">*/ }
                        {/*    <Label className="text-sm font-medium">Verifikasi Umur</Label>*/ }
                        {/*    <div className="flex items-center space-x-2 mt-2">*/ }
                        {/*        <Checkbox id="age-verify" onClick={ () => setAgeValid(!ageValid) }/>*/ }
                        {/*        <Label htmlFor="age-verify" className="text-sm">*/ }
                        {/*            Pembeli berusia 18+ tahun*/ }
                        {/*        </Label>*/ }
                        {/*    </div>*/ }
                        {/*</div>*/ }

                        {/*Select Customer*/ }
                        <div className="">
                            { selectedCustomer ? <div
                                    className={ 'border rounded-xl p-2 flex  items-center justify-between' }>
                                    <h1 className="font-medium">{ selectedCustomer.name }</h1>
                                    {/*<p className="text-sm text-muted-foreground">*/ }
                                    {/*    Usia: { selectedCustomer.age } • Total*/ }
                                    {/*    Belanja : <Badge*/ }
                                    {/*    variant={ getStatusVariant(selectedCustomer.status) }>*/ }
                                    {/*    { chooseStatus(selectedCustomer.status) }</Badge>*/ }

                                    {/*</p>*/ }
                                    <Button
                                        size="sm"
                                        onClick={ () => setSelectedCustomer(null) }>
                                        <MinusIcon/>
                                    </Button>
                                </div>
                                : <SelectCustomerDialogButton
                                    setCustomerNameAction={ setSearchCustomer }
                                    customerName={ searchCustomer }
                                    customers={ customers }
                                    onSelectAction={ (customer) => setSelectedCustomer(customer) }
                                /> }
                        </div>

                        {/* Payment Method */ }
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Payment Method
                            </label>
                            <Select onValueChange={ setPaymentMethod } defaultValue="cod">
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select payment method"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                                    <SelectItem value="atm">ATM Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Extra input if COD */ }
                        { paymentMethod === "cod" && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Client Money
                                </label>
                                <Input
                                    type="text" // use text so the dots show properly
                                    placeholder="Enter client money"
                                    value={ clientMoney !== null ? clientMoney.toLocaleString("id-ID") : "" }
                                    onChange={ (e) => {
                                        // remove non-digits
                                        const raw = e.target.value.replace(/\D/g, "")
                                        setField('clientMoney', raw ? Number(raw) : 0)
                                    } }
                                />
                                { clientMoney > 0 && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Change:{ " " }
                                        <span className="font-semibold">
                                                            { formatRupiah(clientMoney - total) }</span>
                                    </p>
                                ) }
                            </div>
                        ) }

                        <>
                            <div className="border-t pt-4 space-y-2">
                                { clientMoney > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span>Subtotal:</span>
                                        <span>{ formatRupiah(total) }</span>
                                    </div>
                                ) }

                                { (payment && payment.isTax) && (
                                    <div className="flex justify-between items-center">
                                        <span>Tax:</span>
                                        <span>{ payment.valueTax }% - { formatRupiah(tax) }</span>
                                    </div>
                                ) }

                                <div className="flex justify-between items-center font-bold">
                                    <span>Total:</span>
                                    <span>{ formatRupiah(grandTotal) }</span>
                                </div>

                                { clientMoney > 0 && (
                                    <div
                                        className={ `flex justify-between items-center ${
                                            clientMoney - grandTotal < 0 ? "text-red-600" : "text-green-600"
                                        }` }
                                    >
                                        <span>Change:</span>
                                        <span>{ formatRupiah(clientMoney - grandTotal) }</span>
                                    </div>
                                ) }

                            </div>
                        </>

                        <Button
                            className="w-full"
                            size="lg"
                            disabled={
                                isPending ||
                                !selectedCustomer ||
                                clientMoney < grandTotal
                            }
                            onClick={ onTransaction }
                        >
                            <ShoppingCart className="h-4 w-4 mr-2"/>
                            { isPending ? "Loading ...." : "Checkout" }
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Pilih Pelanggan
export function SelectCustomerDialogButton(
    {
        customers,
        onSelectAction,
        ageValid,
        customerName,
        setCustomerNameAction
    }: {
        customers: Customer[],
        onSelectAction: (customer: Customer) => void,
        ageValid?: boolean,
        customerName: string,
        setCustomerNameAction: (value: string) => void,

    }) {
    const [ open, setOpen ] = useState(false);
    const [ search, setSearch ] = useState(customerName);
    const [ isPending, startTransition ] = useTransition()

    // const { value, isLoading } = useDebounceLoad(search, 1000);
    // usePushQueryObject({ customerName: value })
    // // useEffect(() => {
    // //     if (value.trim()) {
    // //         router.push(newParam({ customerName: value }));
    // //     }
    // // }, [ value, router ]);

    const filteredCustomers = useMemo(() =>
            customers.filter(({ name, status }) =>
                name.toLowerCase().includes(search.toLowerCase()) &&
                (ageValid ? status !== 'rejected' :
                        // status === 'verified'
                        true
                )),
        [ customers, search, ageValid ]
    );

    const methods = useForm<CustomerModelType>({
        resolver: zodResolver(CustomerModelNew),
        defaultValues: {
            name: "",
        } satisfies  CustomerModelType,
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        startTransition(async () => {
            const response = await createCustomerNew(data)
            toastResponse({
                    response,
                    onSuccess: () => {
                        if (response.success && response.data) {
                            onSelectAction(response.data);
                            setOpen(false)
                        }
                    }
                }
            )
        })
    });

    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button>
                    Pilih Pelanggan
                    <Plus className="h-3 w-3 ml-2"/>
                </Button>
            </DialogTrigger>

            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Pilih Pelanggan</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-10">

                    <div className="space-y-4">
                        <div className="flex gap-2 ">
                            <Input
                                name={ 'customerName' }
                                placeholder="Cari nama pelanggan..."
                                value={ search }
                                onChange={ (e) => {
                                    setSearch(e.target.value)
                                    setCustomerNameAction(e.target.value)
                                } }
                            />


                            {/*<Button*/ }
                            {/*    onClick={ () => {*/ }
                            {/*        // router.push<Object>(newParam({ name: search }))*/ }
                            {/*        router.push<Object>({})*/ }
                            {/*    } }*/ }
                            {/*    type="button">*/ }
                            {/*    <Search/>*/ }
                            {/*</Button>*/ }

                            <Link href={ {
                                pathname: '/admin/pos',
                                query: { name: search }
                            } }>
                                <Search/>
                            </Link>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            { filteredCustomers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada pelanggan ditemukan.</p>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <DialogClose asChild key={ customer.id }>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left h-14"
                                            onClick={ () => {
                                                onSelectAction?.(customer);
                                            } }
                                        >
                                            <div>
                                                <h1 className="font-medium">{ customer.name }</h1>
                                                {/*<p className="text-sm text-muted-foreground">*/ }
                                                {/*    Usia: { customer.age } • Total Buy: { formatRupiah(customer.totalPurchase) }*/ }
                                                {/*    • Status:{ " " }<Badge variant={ getStatusVariant(customer.status) }>{ chooseStatus(customer.status) }</Badge>*/ }
                                                {/*</p>*/ }
                                            </div>
                                        </Button>
                                    </DialogClose>
                                ))
                            ) }
                        </div>
                    </div>


                    <div className="">
                        <FormProvider { ...methods }>
                            <form onSubmit={ onSubmit } className="grid gap-4">
                                <InputForm name="name" title="Tambah Pelangan Baru" placeholder="Nama pelanggan"/>
                                <DialogFooter>
                                    <Button type="submit"
                                            disabled={ isPending }
                                    >{ isPending ? 'Loading...' : "Simpan" }
                                    </Button>
                                </DialogFooter>
                            </form>
                        </FormProvider>
                    </div>

                </div>

            </DialogContent>
        </Dialog>
    );
}
