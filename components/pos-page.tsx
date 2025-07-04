"use client"

import { createCustomerNew } from "@/action/customer-action";
import { ProductPaging } from "@/action/product-action";
import { createTransaction } from "@/action/sale-action";
import { InputForm } from "@/components/form-hook";
import { ResponsiveModal } from "@/components/modal-components";
import { ProductDetailDialogOnly } from "@/components/product-detail-dialog-only";
import { BrandsProps, FilterSelect } from "@/components/products-page";
import { Badge } from "@/components/ui/badge";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart";
import { useDebounce, } from "@/hooks/use-debounce";
import {
    batterySizeOptions,
    categoryOption,
    coilSizeOption,
    cottonSizeOption,
    nicotineLevelsOptions,
    pageSizeOptions,
    resistanceSizeOption,
    stockStatusOptions,
    typeDeviceOption
} from "@/lib/constants";
import { Customer, Product } from "@/lib/generated/zod_gen";
import { chooseStatus, formatRupiah, getStatusVariant, newParam, toastResponse } from "@/lib/my-utils";
import { CustomerModelNew, CustomerModelType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ChevronLeft,
    ChevronRight,
    FilterIcon,
    MinusIcon,
    Plus,
    PlusIcon,
    Search,
    ShoppingCart,
    Trash2,
    XIcon
} from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form";

export function POSPage(
    { products, customers, brands }:
    { customers: Customer[], products: ProductPaging, brands: BrandsProps }) {
    const router = useRouter();
    const [ selectedCustomer, setSelectedCustomer ] = useState<Customer | null>(null)
    const [ loading, setLoading ] = useState(false)
    const [ openDetail, setOpenDetail ] = useState(false);

    const [ searchCustomer, setSearchCustomer ] = useState("")
    const [ searchProduct, setSearchProduct ] = useState("")

    const [ productCategory, setProductCategory ] = useState("-")
    const [ productNicotine, setProductNicotine ] = useState("-")
    const [ productTypeDevice, setProductTypeDevice ] = useState("-")

    const [ productResistant, setProductResistant ] = useState("-");
    const [ productCoil, setProductCoil ] = useState("-");
    const [ productCotton, setProductCotton ] = useState("-");
    const [ productBattery, setProductBattery ] = useState("-");
    const [ stockFilter, setStockFilter ] = useState("-");
    const [ productBrand, setProductBrand ] = useState('-');
    
    const [ isProduct, setIsProduct ] = useState<Product | null>(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const searchNameDebounce = useDebounce(searchProduct)
    const searchCustomerDebounce = useDebounce(searchCustomer)

    const { setCartItems, removeFromCart, incrementItem, decrementItem, cartItems, addToCart } = useCart([])

    // Pagination
    const [ itemsPerPage, setItemsPerPage ] = useState(10);
    const [ page, setPage ] = useState(0);



    useEffect(() => {
        // Convert "-" to undefined so the backend can ignore these filters
        const filters = {
            productName: searchNameDebounce.trim() || undefined,
            customerName: searchCustomerDebounce.trim() || undefined,
            productBrand,
            productCotton,
            productBattery,
            productCategory,
            productTypeDevice,
            productNicotine,
            productResistant,
            productCoil,
            productLimit: String(itemsPerPage),
            productPage: String(page),
        };
        // Only push if at least one filter has value
        const hasAnyFilter = Object.values(filters).some(Boolean);

        if (hasAnyFilter) {
            router.push(newParam(filters));
            console.log('Filters applied:', filters);
        }
    }, [ router, productBrand, productCategory, productTypeDevice, productNicotine, itemsPerPage, page, productResistant, productCoil, productBattery, productCotton, searchNameDebounce, searchCustomerDebounce ]);

    const totalPages = Math.ceil(products.total / itemsPerPage);

    const onReset = () => {
        setSearchCustomer("-")
        setSearchProduct("-")
        setProductNicotine("-")
        setProductCategory("-")
        setProductTypeDevice("-")
        setStockFilter("-")
        setProductBrand("-")
        setProductResistant("-")
        setProductBattery("-")
        setProductCoil("-")
        setProductCotton("-")

    }
    const getTotalCart = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    async function onTransaction() {
        setLoading(true)
        toastResponse({
            response: await createTransaction(cartItems, selectedCustomer),
            onSuccess: () => {
                setSelectedCustomer(null)
                setCartItems([])
            }
        })
        setLoading(false)

    }

    const getProductStock = (id: number) => {
        return products.data.find(product => product.id === id)?.stock || 0;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <ProductDetailDialogOnly
                product={ isProduct } isOpen={ isOpen } isAdd={ true }
                setOpenAction={ setIsOpen }
                onAdd={ () => {
                    if (isProduct) {
                        // incrementItem(isProduct.id)
                        addToCart(isProduct)
                    }
                } }
            />


            <h1 className="text-3xl font-bold mb-6">POS Kasir</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Product Selection */ }
                <div className="lg:col-span-2 ">
                    <Card>
                        {/* Filters */ }
                        <CardHeader className={ 'space-y-2' }>
                            <CardTitle>Pilih Produk</CardTitle>

                            <Input
                                placeholder="Cari produk..."
                                value={ searchProduct }
                                type={ 'search' }
                                onChange={ (e) => setSearchProduct(e.target.value) }
                            />

                            <div className="flex gap-4 flex-col sm:flex-row ">
                                {/*Filter */ }
                                <div className="">
                                    <ResponsiveModal
                                        title="Filter Produk"
                                        description="Filter produk sesuai yang kamu inginkan"
                                        trigger={ <Button variant="outline"><FilterIcon
                                            className="w-4 h-4"/>Filter</Button> }
                                        footer={ <Button onClick={ onReset } type="button"
                                                         variant="destructive"> Reset
                                            <XIcon className="w-4 h-4"/>
                                        </Button> }
                                    >
                                        <div className="grid grid-cols-3 gap-3 ">
                                            <FilterSelect
                                                label="Kategori"
                                                value={ productCategory }
                                                onChangeAction={ setProductCategory }
                                                placeholder="Semua kategori"
                                                options={ categoryOption }
                                            />
                                            <FilterSelect
                                                label="Resistensi"
                                                value={ productResistant }
                                                onChangeAction={ setProductResistant }
                                                placeholder="Semua Resistensi"
                                                options={ resistanceSizeOption }
                                            />
                                            <FilterSelect
                                                label="Coil"
                                                value={ productCoil }
                                                onChangeAction={ setProductCoil }
                                                placeholder="Semua Coil"
                                                options={ coilSizeOption }
                                            />
                                            <FilterSelect
                                                label="Cotton"
                                                value={ productCotton }
                                                onChangeAction={ setProductCotton }
                                                placeholder="Semua Cotton"
                                                options={ cottonSizeOption }
                                            />
                                            <FilterSelect
                                                label="Battery"
                                                value={ productBattery }
                                                onChangeAction={ setProductBattery }
                                                placeholder="Semua Battery"
                                                options={ batterySizeOptions }
                                            />
                                            <FilterSelect
                                                label="Merk"
                                                value={ productBrand }
                                                onChangeAction={ setProductBrand }
                                                placeholder="Semua Merk"
                                                options={ brands.map(item => ({
                                                    label: item.brand ?? "-",
                                                    value: item.brand ?? "-"
                                                })) }
                                            />
                                            <FilterSelect
                                                label="Nikotin"
                                                labelClassName="text-nowrap"
                                                value={ productNicotine }
                                                onChangeAction={ setProductNicotine }
                                                placeholder="Semua level"
                                                options={ nicotineLevelsOptions }
                                            />
                                            <FilterSelect
                                                label="Device"
                                                value={ productTypeDevice }
                                                onChangeAction={ setProductTypeDevice }
                                                placeholder="Semua tipe"
                                                options={ typeDeviceOption }
                                            />
                                            <FilterSelect
                                                label="Stok"
                                                value={ stockFilter }
                                                onChangeAction={ setStockFilter }
                                                placeholder="Semua status"
                                                options={ stockStatusOptions }
                                            />

                                            {/*<div>*/ }
                                            {/*    <Label>Reset</Label>*/ }
                                            {/*    <Button onClick={ onReset } type="button" variant="destructive">*/ }
                                            {/*        <XIcon className="w-4 h-4"/>*/ }
                                            {/*    </Button>*/ }
                                            {/*</div>*/ }

                                        </div>
                                    </ResponsiveModal>
                                        </div>

                                {/*Paging*/ }
                                <div className="flex items-center gap-4">
                                    <Select
                                        value={ String(itemsPerPage) }
                                        onValueChange={ (value) => {
                                            setItemsPerPage(Number(value));
                                            setPage(0); // Reset ke halaman pertama
                                        } }>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tampil"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            { pageSizeOptions.map((value) => (
                                                <SelectItem key={ value } value={ value.toString() }>
                                                    { value }
                                                </SelectItem>
                                            )) }
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        onClick={ () => setPage((prev) => Math.max(0, prev - 1)) }
                                        disabled={ page === 0 }
                                    >
                                        <ChevronLeft/>
                                    </Button>

                                    {/*just for text*/ }
                                    <Button variant="outline" disabled={ true }>
                                        { page + 1 } / { totalPages }
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={ () => setPage((prev) => prev + 1) }
                                        disabled={ page + 1 >= totalPages }
                                    >
                                        <ChevronRight/>

                                    </Button>
                                </div>
                            </div>

                        </CardHeader>


                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                { products.data.map((product) => {
                                    const cartItem = cartItems.find(item => item.id === product.id);
                                    const remainingStock = cartItem ? product.stock - cartItem.quantity : product.stock;

                                    return (
                                        <Card key={ product.id }
                                              className="cursor-pointer hover:shadow-md transition-shadow p-0 gap-0">
                                            <picture>

                                                <img
                                                    onClick={ () => {
                                                        setIsOpen(prev => {
                                                            return !prev
                                                        })
                                                        setIsProduct(product)
                                                    } }
                                                    src={ product.image }
                                                    alt={ product.name }
                                                    className="w-full h-40 object-contain rounded bg-white "
                                                />
                                            </picture>
                                            <CardContent className="p-4 md:p-6">
                                                <h3 className="font-medium text-sm mb-1">{ product.name }</h3>
                                                <p className="text-xs text-muted-foreground mb-2">{ product.category }</p>
                                                <div className="flex justify-between items-center">
                                                        <span
                                                            className="font-bold text-sm">{ formatRupiah(product.price) }</span>
                                                    <Button size="sm"
                                                            onClick={ () => addToCart(product) }
                                                            disabled={ remainingStock <= 0 }

                                                    >
                                                        <Plus className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Stok: { remainingStock }</p>
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
                                { cartItems.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">Keranjang kosong</p>
                                ) : (
                                    <>
                                        { cartItems.map((product) => {

                                            return (
                                                <div key={ product.id }
                                                     className="flex justify-between items-center py-2 border-b">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{ product.name }</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            { product.quantity } x { formatRupiah(product.price) }
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center space-x-2">

                                                        {/* Total price */ }
                                                        <span
                                                            className="font-medium text-sm">{ formatRupiah(product.price * product.quantity) }</span>


                                                        {/* Counter */ }
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <Button
                                                                size={ 'sm' }
                                                                onClick={ () => decrementItem(product.id) }
                                                                disabled={ product.quantity <= 1 }
                                                            >
                                                                <MinusIcon/>
                                                            </Button>
                                                            <Button
                                                                size={ 'sm' }
                                                                variant={ 'ghost' }>{ product.quantity }</Button>
                                                            <Button
                                                                size={ 'sm' }
                                                                onClick={ () => incrementItem(product.id) }
                                                                // disabled={ product.quantity >= getProductStock(product.id) }
                                                                disabled={product.quantity >= getProductStock(product.id)} // ✅ perbaikan di sini
                                                            >
                                                                <PlusIcon/>
                                                            </Button>

                                                            {/* Delete button */ }
                                                            <Button size="sm" variant="outline"
                                                                    onClick={ () => removeFromCart(product.id) }>
                                                                <Trash2 className="h-3 w-3"/>
                                                            </Button>
                                                        </div>


                                                    </div>
                                                </div>
                                            )
                                        }) }

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
                                                            Usia: { selectedCustomer.age } • Total
                                                            Belanja : <Badge
                                                            variant={ getStatusVariant(selectedCustomer.status) }>
                                                            { chooseStatus(selectedCustomer.status) }</Badge>
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
                                                    // ageValid={ ageValid }
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
                                    </>
                                ) }
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
                                                    Status:{ " " }
                                                    <Badge variant={ getStatusVariant(customer.status) }>
                                                        { chooseStatus(customer.status) }
                                                    </Badge>
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
