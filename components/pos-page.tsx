"use client"

import { createCustomerNew } from "@/action/customer-action";
import { type  ProductPaging, type ProductPreorder } from "@/action/product-action";
import { createTransactionAction } from "@/action/sale-action";
import { InputForm } from "@/components/form-hook";
import { ProductDetailDialogOnly } from "@/components/product-detail-dialog-only";
import { ProductCart } from "@/components/product-user-page";
import { ProductsFilter } from "@/components/products-page";
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
import { useCart } from "@/hooks/use-cart";
import { formatRupiah } from "@/lib/formatter";
import { newParam, toastResponse } from "@/lib/helper";
import { CustomerModelNew, CustomerModelType } from "@/lib/schema";
import { Customer } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, Plus, Search, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form";

export function POSPage(
    { products, customers }:
    { customers: Customer[], products: ProductPaging }) {
    const [ selectedCustomer, setSelectedCustomer ] = useState<Customer | null>(null)
    const [ loading, setLoading ] = useState(false)
    const [ searchCustomer, setSearchCustomer ] = useState("")
    const [ isProduct, setIsProduct ] = useState<ProductPreorder | null>(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const { setCartItems, removeFromCart, incrementItem, decrementItem, cartItems, addToCart } = useCart([])

    async function onTransaction() {
        setLoading(true)
        toastResponse({
            response: await createTransactionAction(cartItems, selectedCustomer),
            onSuccess: () => {
                setSelectedCustomer(null)
                setCartItems([])
            }
        })
        setLoading(false)

    }

    const getTotalCart = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getProductStock = (id: number) => {
        return products.data.find(product => product.id === id)?.stock || 0;
    };

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
                            <ProductsFilter products={ products } customerName={ searchCustomer }/>
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

                {/* Cart & Checkout */ }
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

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total:</span>
                                        <span>{ formatRupiah(getTotalCart()) }</span>
                                    </div>
                                </div>

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

                                <div className="">
                                    { selectedCustomer ? <div
                                            className={ 'border rounded-xl p-2 flex  items-end justify-between' }>
                                            <div className="">
                                                <h1 className="font-medium">{ selectedCustomer.name }</h1>
                                                <p className="text-sm text-muted-foreground">
                                                    {/*Usia: { selectedCustomer.age } • Total*/ }
                                                    {/*Belanja : <Badge*/ }
                                                    {/*variant={ getStatusVariant(selectedCustomer.status) }>*/ }
                                                    {/*{ chooseStatus(selectedCustomer.status) }</Badge>*/ }

                                                </p>
                                            </div>

                                            <Button
                                                size="sm"
                                                onClick={ () => setSelectedCustomer(null) }>
                                                <MinusIcon/>
                                            </Button>
                                        </div>
                                        : <SelectCustomer
                                            setCustomerNameAction={ setSearchCustomer }
                                            customerName={ searchCustomer }
                                            customers={ customers }
                                            onSelectAction={ (customer) => setSelectedCustomer(customer) }
                                        /> }

                                </div>
                                <Button className="w-full" size="lg"
                                        disabled={ loading || !selectedCustomer }
                                        onClick={ onTransaction }
                                >
                                    <ShoppingCart
                                        className="h-4 w-4 mr-2"/>
                                    { loading ? "Loading ...." : 'Checkout' }
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export function SelectCustomer(
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
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

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
                )
            ),
        [ customers, search, ageValid ]
    );

    const methods = useForm<CustomerModelType>({
        resolver: zodResolver(CustomerModelNew),
        defaultValues: {
            name: "",
        } satisfies  CustomerModelType,
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        setLoading(true)
        const response = await createCustomerNew(data)
        toastResponse({
                response,
                onSuccess: () => {
                    if (response.success && response.data) {
                        onSelectAction(response.data);
                        setOpen(false)
                        setLoading(false)
                    }
                }
            }
        )
        setLoading(false)
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
                            <Button
                                onClick={ () => router.push(newParam({ name: search })) }
                                type="button">
                                <Search/>
                            </Button>
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
                                                <p className="text-sm text-muted-foreground">
                                                    Usia: { customer.age } • Total: { customer.totalPurchase } •
                                                    {/*Status:{ " " }*/ }
                                                    {/*<Badge variant={ getStatusVariant(customer.status) }>*/ }
                                                    {/*    { chooseStatus(customer.status) }*/ }
                                                    {/*</Badge>*/ }
                                                </p>
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
                                            disabled={ loading }
                                    >{ loading ? 'Loading...' : "Simpan" }
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
