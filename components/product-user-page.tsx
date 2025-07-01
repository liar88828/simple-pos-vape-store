"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, MinusIcon, Plus, PlusIcon, Search, ShoppingCart, Trash2, XIcon } from "lucide-react"
import { Customer, Product } from "@prisma/client";
import { chooseStatus, formatRupiah, getStatusVariant, newParam, toastResponse } from "@/lib/my-utils";
import { CartItem, SaleCustomers, SESSION } from "@/interface/actionType";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { createTransactionUser, createTransactionUserPending } from "@/action/sale-action";
import { Badge } from "@/components/ui/badge";
import { FormProvider, useForm } from "react-hook-form";
import { InputForm } from "@/components/form-hook";
import { CustomerModelNew, CustomerModelType, ProductModelType } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerNew } from "@/action/customer-action";
import { useRouter } from "next/navigation";
import { useDebounce, } from "@/hooks/use-debounce";
import { ProductPending } from "@/app/user/home/page"
import { ProductDetailDialogOnly } from "./products-page"

export function ProductUserPage(
    {
        productPending,
        session,
        products,

    }: {
        productPending: ProductPending
        session: SESSION
        products: Product[],

    }) {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<CartItem[]>(productPending?.current)
    const [loading, setLoading] = useState(false)
    // const [ ageValid, setAgeValid ] = useState(false)

    const [searchProduct, setSearchProduct] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [nicotineFilter, setNicotineFilter] = useState("all")
    const [deviceTypeFilter, setDeviceTypeFilter] = useState("all")

    const [isProduct, setIsProduct] = useState<ProductModelType | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const searchNameDebounce = useDebounce(searchProduct)


    useEffect(() => {
        console.log(`POS QUERY : ${searchNameDebounce.trim()}`)
        router.push(newParam({
            productName: searchNameDebounce,
        }));
        console.log('push')
    }, [searchNameDebounce, router]);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    const filteredProducts = useMemo(() => {
        const searchLower = searchProduct.toLowerCase();
        const categoryLower = categoryFilter.toLowerCase();

        return products.filter(product => {
            const nameMatches = product.name.toLowerCase().includes(searchLower);
            const categoryMatches = categoryFilter === "all" || product.category.toLowerCase() === categoryLower;
            return nameMatches && categoryMatches;
        });
    }, [products, searchProduct, categoryFilter]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredProducts.length / itemsPerPage);
    }, [filteredProducts.length, itemsPerPage]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage])

    const addToCart = (product: Product) => {
        const existingItem = cartItems.find((item) => item.id === product.id)
        if (existingItem) {

            setCartItems(cartItems.map((item) => (item.id === product.id ? {
                ...item,
                quantity: item.quantity + 1
            } : item)))

        } else {
            setCartItems([...cartItems, { ...product, quantity: 1 }])
        }
    }

    const removeFromCart = (productId: number) => {
        setCartItems(cartItems.filter((item) => item.id !== productId))
    }

    const getTotalCart = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }
    const onReset = () => {
        setSearchProduct("")
        setNicotineFilter("all")
        setCategoryFilter("all")
        setDeviceTypeFilter("all")
    }

    async function onTransaction() {
        setLoading(true)
        if (productPending.isPending) {
            if (productPending.data) {
                toastResponse({ response: await createTransactionUserPending(cartItems, productPending.data), })
            }
        } else {
            toastResponse({ response: await createTransactionUser(cartItems), })

        }


        setLoading(false)

    }

    const incrementItem = (id: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decrementItem = (id: number) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };


    const getProductStock = (id: number) => {
        return products.find(product => product.id === id)?.stock || 0;
    };
    return (
        <div className="p-6 max-w-7xl mx-auto">

            <ProductDetailDialogOnly product={isProduct} isOpen={isOpen}
                setOpen={setIsOpen}
                onAdd={() => { if (isProduct) { incrementItem(isProduct.id) } }}
            />
            <h1 className="text-3xl font-bold mb-6">User Home {session.name}</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 space-y-6  xl:space-y-0 xl:space-x-6  ">

                {/* Product Selection */}
                <div className="lg:col-span-2 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Produk</CardTitle>

                            <div className="flex  gap-4 sm:gap-6 justify-between flex-col sm:flex-row">
                                <div className="grid grid-cols-1 gap-4 w-full  ">
                                    <div className="w-full md:max-w-xl ">
                                        <Input
                                            placeholder="Cari produk..."
                                            className="flex-1"
                                            type={'search'}
                                            value={searchProduct}
                                            onChange={(e) => setSearchProduct(e.target.value)}
                                        />
                                    </div>
                                    {/*sm:justify-between*/}
                                    <div className=" flex  gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">
                                        <div>
                                            <Label>Kategori</Label>
                                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua</SelectItem>
                                                    <SelectItem value="device">Device</SelectItem>
                                                    <SelectItem value="liquid">Liquid</SelectItem>
                                                    <SelectItem value="coil">Coil</SelectItem>
                                                    <SelectItem value="aksesoris">Aksesoris</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Level Nikotin</Label>
                                            <Select value={nicotineFilter} onValueChange={setNicotineFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Semua level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua</SelectItem>
                                                    <SelectItem value="0mg">0mg</SelectItem>
                                                    <SelectItem value="3mg">3mg</SelectItem>
                                                    <SelectItem value="6mg">6mg</SelectItem>
                                                    <SelectItem value="12mg">12mg</SelectItem>
                                                    <SelectItem value="25mg">25mg+</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Tipe Device</Label>
                                            <Select value={deviceTypeFilter}
                                                onValueChange={setDeviceTypeFilter}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Semua tipe" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua</SelectItem>
                                                    <SelectItem value="Pod System">Pod System</SelectItem>
                                                    <SelectItem value="Mod">Mod</SelectItem>
                                                    <SelectItem value="Disposable">Disposable</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>Reset</Label>
                                            <Button onClick={onReset}> <XIcon /> </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 sm:gap-4 ">
                                    <Select value={String(itemsPerPage)} onValueChange={(value) => {
                                        setItemsPerPage(Number(value));
                                        setCurrentPage(1); // Reset ke halaman pertama
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tampil" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="15">15</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage((prev) => prev - 1)}
                                    >
                                        <ChevronLeft />
                                    </Button>

                                    {/*just for text*/}
                                    <Button variant="outline" disabled={true}>
                                        {currentPage} / {totalPages}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage((prev) => prev + 1)}
                                    >
                                        <ChevronRight />

                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                {paginatedProducts.map((product) => {
                                    const cartItem = cartItems.find(item => item.id === product.id);
                                    const remainingStock = cartItem ? product.stock - cartItem.quantity : product.stock;

                                    return (
                                        <Card key={product.id}
                                            className="cursor-pointer hover:shadow-md transition-shadow p-0 gap-0">
                                            <picture>
                                                <img
                                                    onClick={() => {
                                                        setIsOpen(prev => { return !prev })
                                                        setIsProduct(product)
                                                    }}
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-40 object-contain rounded  bg-white"
                                                />
                                            </picture>
                                            <CardContent className="p-4 md:p-6">
                                                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                                                <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                                                <div className="flex justify-between items-center">
                                                    <span
                                                        className="font-bold text-sm">{formatRupiah(product.price)}</span>
                                                    <Button size="sm"
                                                        onClick={() => addToCart(product)}
                                                        disabled={remainingStock <= 0}

                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Stok: {remainingStock}</p>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart & Checkout */}
                <div >
                    <Card >
                        <CardHeader  >
                            <CardTitle>Keranjang Belanja</CardTitle>
                        </CardHeader>
                        <CardContent  >
                            <div className="space-y-4 ">
                                {cartItems.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-4">Keranjang kosong</p>
                                ) : (
                                    <>
                                        {cartItems.map((product) => {


                                            return (
                                                <div key={product.id}
                                                    className="flex justify-between items-center py-2 border-b">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.quantity} x {formatRupiah(product.price)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center space-x-2">

                                                        {/* Total price */}
                                                        <span
                                                            className="font-medium text-sm">{formatRupiah(product.price * product.quantity)}</span>


                                                        {/* Counter */}
                                                        <div className="grid grid-cols-4 gap-2">
                                                            <Button
                                                                size={'sm'}
                                                                onClick={() => decrementItem(product.id)}
                                                                disabled={product.quantity <= 1}
                                                            >
                                                                <MinusIcon />
                                                            </Button>
                                                            <Button
                                                                size={'sm'}
                                                                variant={'ghost'}>{product.quantity}</Button>
                                                            <Button
                                                                size={'sm'}
                                                                onClick={() => incrementItem(product.id)}
                                                                disabled={product.quantity >= getProductStock(product.id)}
                                                            >
                                                                <PlusIcon />
                                                            </Button>

                                                            {/* Delete button */}
                                                            <Button size="sm" variant="outline"
                                                                onClick={() => removeFromCart(product.id)}>
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        </div>


                                                    </div>
                                                </div>
                                            )
                                        })}

                                        <div className="border-t pt-4">
                                            <div className="flex justify-between items-center font-bold">
                                                <span>Total:</span>
                                                <span>{formatRupiah(getTotalCart())}</span>
                                            </div>
                                        </div>



                                        <Button className="w-full" size="lg"
                                            disabled={loading}
                                            onClick={onTransaction}
                                        >
                                            <ShoppingCart
                                                className="h-4 w-4 mr-2" />
                                            {loading ? "Loading ...." : 'Checkout'}
                                        </Button>
                                    </>
                                )}
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
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState(customerName);
    const [loading, setLoading] = useState(false)
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
        [customers, search, ageValid]
    );

    const methods = useForm<CustomerModelType>({
        resolver: zodResolver(CustomerModelNew),
        defaultValues: {
            name: "",
        },
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Pilih Pelanggan
                    <Plus className="h-3 w-3 ml-2" />
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
                                name={'customerName'}
                                placeholder="Cari nama pelanggan..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setCustomerNameAction(e.target.value)
                                }}
                            />
                            <Button
                                onClick={() => router.push(newParam({ name: search }))}
                                type="button">
                                <Search />
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {filteredCustomers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Tidak ada pelanggan ditemukan.</p>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <DialogClose asChild key={customer.id}>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left h-14"
                                            onClick={() => {
                                                onSelectAction?.(customer);
                                            }}
                                        >
                                            <div>
                                                <h1 className="font-medium">{customer.name}</h1>
                                                <p className="text-sm text-muted-foreground">
                                                    Usia: {customer.age} • Total: {customer.totalPurchase} •
                                                    Status:{" "}
                                                    <Badge variant={getStatusVariant(customer.status)}>
                                                        {chooseStatus(customer.status)}
                                                    </Badge>
                                                </p>
                                            </div>
                                        </Button>
                                    </DialogClose>
                                ))
                            )}
                        </div>
                    </div>


                    <div className="">


                        <FormProvider {...methods}>
                            <form onSubmit={onSubmit} className="grid gap-4">
                                <InputForm name="name" title="Tambah Pelangan Baru" placeholder="Nama pelanggan" />
                                <DialogFooter>
                                    <Button type="submit"
                                        disabled={loading}
                                    >{loading ? 'Loading...' : "Simpan"}
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
