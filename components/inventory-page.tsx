"use client"

import { preOrderProduct } from "@/action/inventory-action";
import { PreorderProduct, ProductPaging } from "@/action/product-action";
import { InputDateForm, InputForm, InputNumForm, SelectForm } from "@/components/form-hook";
import { ResponsiveModal, ResponsiveModalOnly } from "@/components/modal-components";
import { ProductsFilter } from "@/components/products-page";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDebounceLoad } from "@/hooks/use-debounce";
import { ModalProps } from "@/interface/actionType";
import { PreOrderOptionalDefaults, PreOrderOptionalDefaultsSchema, Product } from "@/lib/generated/zod_gen";
import { formatDateIndo, formatRupiah, newParam, toastResponse } from "@/lib/my-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Plus } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form";

export function InventoryPage({ products, lowStockProducts, expiredProduct, preorders }: {
    products: ProductPaging,
    lowStockProducts: Product[],
    expiredProduct: PreorderProduct[],
    preorders: PreorderProduct[]
}) {
    const [ isModalStock, setIsModalStock ] = useState(false)
    const [ isModalPreorder, setIsModalPreorder ] = useState(false)
    const [ isModalExpired, setIsModalExpired ] = useState(false)
    const [ isStock, setIsStock ] = useState<Product | null>(null)
    const [ isPreorder, setIsPreorder ] = useState<PreorderProduct | null>(null)
    const [ isExpired, setIsExpired ] = useState<PreorderProduct | null>(null)

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-3xl font-bold">Manajemen Inventori</h1>
                <AddStockModal products={ products }/>
                { isStock &&
						<ReorderStockModal product={ isStock } isOpen={ isModalStock }
										   setOpenAction={ setIsModalStock }/> }
            </div>

            {/* History Preorder */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        Produk Preorder History
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Expired</TableHead>
                                {/*<TableHead>Perlu Reorder</TableHead>*/ }
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { preorders.map((item) => (
                                <TableRow key={ item.id }>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <picture>
                                                <img
                                                    src={ item.product.image || "/placeholder.svg" }
                                                    alt={ item.product.name }
                                                    className="w-8 h-8 rounded object-cover"
                                                />
                                            </picture>
                                            <div className="flex flex-col">
                                                <span
                                                    className="font-bold w-auto text-wrap">{ item.product.name }</span>
                                                <span
                                                    className="font-light">Normal : { formatRupiah(item.product.price) }</span>
                                                <span
                                                    className="font-light">Sell : { formatRupiah(item.priceSell) }</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={ item.product.minStock >= item.product.stock
                                                ? 'destructive'
                                                : "default" }>
                                            { item.product.stock }
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{ formatDateIndo(item?.expired) }</TableCell>
                                    {/*<TableCell>{ product.minStock - product.stock + 10 }</TableCell>*/ }
                                    <TableCell>
                                        <div className="space-x-2">
                                            <Button size="sm"
                                                    onClick={ () => {
                                                        setIsPreorder(item)
                                                        setIsModalPreorder(true)
                                                    } }
                                            >Ubah</Button>

                                            <Button size="sm" variant={ 'destructive' }
                                                    onClick={ () => {
                                                        if (confirm(`Apakah Anda Yakin Untuk Hapus Data ini ${ item.product.name } ?`)) {
                                                            console.log('delete')
                                                        }
                                                    } }
                                            >Hapus</Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>


            {/* Low Stock Alert */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
                        Produk Stok Rendah : { lowStockProducts.length } Produk
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Stok Saat Ini</TableHead>
                                <TableHead>Minimum Stok</TableHead>
                                <TableHead>Perlu Reorder</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { lowStockProducts.map((product) => (
                                <TableRow key={ product.id }>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <picture>
                                                <img
                                                    src={ product.image || "/placeholder.svg" }
                                                    alt={ product.name }
                                                    className="w-8 h-8 rounded object-cover"
                                                />
                                            </picture>
                                            <span className="font-medium">{ product.name }</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="destructive">{ product.stock }</Badge></TableCell>
                                    <TableCell>{ product.minStock }</TableCell>
                                    <TableCell>{ product.minStock - product.stock + 10 }</TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            onClick={ () => {
                                                setIsStock(product)
                                                setIsModalStock(true)
                                            } }
                                        >
                                            Reorder
                                        </Button>

                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>


            {/* Expired Alert */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
                        Produk Expired : { expiredProduct.length } Produk
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Stok Saat Ini</TableHead>
                                <TableHead>Expired</TableHead>
                                {/*<TableHead>Perlu Reorder</TableHead>*/ }
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { expiredProduct.map((item) => (
                                <TableRow key={ item.id }>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <picture>
                                                <img
                                                    src={ item.product.image || "/placeholder.svg" }
                                                    alt={ item.product.name }
                                                    className="w-8 h-8 rounded object-cover"
                                                />
                                            </picture>
                                            <span className="font-medium">{ item.product.name }</span>
                                        </div>
                                    </TableCell>
                                    <TableCell><Badge variant="destructive">{ item.product.stock }</Badge></TableCell>
                                    <TableCell>{ formatDateIndo(item.expired ?? new Date()) }</TableCell>
                                    {/*<TableCell>{ product.minStock - product.stock + 10 }</TableCell>*/ }
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            onClick={ () => {
                                                setIsExpired(item)
                                                setIsModalExpired(true)
                                            } }
                                        >
                                            Sistem Dev
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

export function ReorderStockModal(
    { product, setOpenAction, isOpen }
    : { product: Product } & ModalProps) {

    // const [ productToAddStock, setProductToAddStock ] = useState<Product | null>(null)
    const [ loading, setLoading ] = useState(false)

    const methods = useForm<PreOrderOptionalDefaults>({
            resolver: zodResolver(PreOrderOptionalDefaultsSchema),
            defaultValues: {
                status: '-',
                estimatedDate: new Date(),
                productId: product.id,
                quantity: 0,
                priceNormal: 0,
                priceSell: 0,
            } satisfies PreOrderOptionalDefaults
        }
    );

    const onSubmit = methods.handleSubmit(async (data) => {

        setLoading(true)
        // if (productToAddStock) {
        setOpenAction(false)
        // setProductToAddStock(null)
        toastResponse({ response: await preOrderProduct(data) })
        setLoading(false)
        // }
        setLoading(false)

    })

    return (
        <ResponsiveModalOnly title={ 'Tambah Stok' }
                             isOpen={ isOpen } setOpenAction={ setOpenAction }
                             footer={ <Button onClick={ onSubmit } disabled={ loading }>Simpan</Button> }
        >
            <FormProvider { ...methods }>
                <form onSubmit={ onSubmit } className={ 'space-y-4' }>
                    <div className="grid grid-cols-2 gap-4">
                        <InputForm name="quantity" title="Jumlah Tambahan" placeholder="0" type="number"/>
                        <SelectForm
                            name="status"
                            label="Status"
                            placeholder="Pilih status"
                            options={ [
                                { label: "Pilih", value: "-" },
                                { label: "Pending", value: "pending" },
                                { label: "Success", value: "success" },
                            ] }
                        />
                        <InputNumForm name={ 'priceNormal' } title={ 'Harga Beli' }/>
                        <InputNumForm name={ 'priceSell' } title={ 'Harga Jual' }/>
                        <InputDateForm name={ 'estimatedDate' }
                                       title={ "Tanggal" }
                                       description={ 'Tambahkan Tanggal' }
                                       minDate={ false }
                        />
                    </div>
                </form>
            </FormProvider>
        </ResponsiveModalOnly>

    );
}

// atas
export function AddStockModal_Old({ products }: { products: ProductPaging, }) {
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ stockAmount, setStockAmount ] = useState("")
    const [ nameProduct, setNameProduct ] = useState<string>('')
    const [ productData, setProductData ] = useState<Product | null>(null)

    const handleSubmit = () => {
        const product = products.data.find((p) => p.id === Number(nameProduct))
        const amount = parseInt(stockAmount)

        if (product && !isNaN(amount)) {
            product.stock += amount
            alert(`Stok ${ product.name } ditambah ${ amount }`)
            setIsModalOpen(false)
            setStockAmount("")
            setNameProduct('')
        }
    }
    const handleAddStock = (product: Product | null) => {
        setProductData(product)
    }
    const router = useRouter()

    const { value, isLoading } = useDebounceLoad(nameProduct, 1000);

    useEffect(() => {
        if (value.trim()) {
            router.push(newParam({ name: value }));
        }
    }, [ value, router ]);

    return (
        <Dialog open={ isModalOpen } onOpenChange={ setIsModalOpen }>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Stok
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Stok Produk</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <ProductsFilter products={ products }/>

                    <div>
                        <Label htmlFor="stock">Tambah Stok</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={ stockAmount }
                            onChange={ (e) => setStockAmount(e.target.value) }
                        />
                    </div>
                </div>

                { productData ?
                    <Card className="flex items-center gap-4 p-4 flex-row border-green-800 border-2">
                        <picture>
                            <img
                                src={ productData.image }
                                alt={ productData.name }
                                className="size-10  rounded-md object-cover"
                            />
                        </picture>

                        <div className="flex-1">
                            <p className="text-sm font-semibold">{ productData.name }</p>
                            <p className="text-xs text-muted-foreground">
                                Stok: { productData.stock } | { formatRupiah(productData.price) }
                            </p>
                        </div>

                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={ () => handleAddStock(null) }
                        >
                            Hapus
                        </Button>
                    </Card>
                    :
                    <div className="space-y-3 overflow-y-auto h-96">
                        {
                            isLoading
                                ? <Card className="flex items-center gap-4 p-4 ">Loading...</Card>
                                : products.data.length === 0
                                    ? <Card className="flex items-center gap-4 p-4">Product Is Not Found</Card>
                                    : products.data
                                    .filter((p) => p.name.toLowerCase().includes(nameProduct.toLowerCase()))
                                    .map((product) => (
                                        <Card key={ product.id }
                                              className="flex items-center gap-4 p-4 flex-row hover:border-primary">
                                            <picture>
                                                <img
                                                    src={ product.image }
                                                    alt={ product.name }
                                                    className="size-10  rounded-md object-cover"
                                                />
                                            </picture>

                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{ product.name }</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Stok: { product.stock } | { formatRupiah(product.price) }
                                                </p>
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={ () => handleAddStock(product) }
                                            >
                                                Tambah
                                            </Button>
                                        </Card>
                                    )) }
                    </div>
                }

                <DialogFooter className="pt-4">
                    <Button
                        onClick={ handleSubmit }
                        disabled={ !nameProduct || !stockAmount }
                    >
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// atas
export function AddStockModal({ products }: { products: ProductPaging, }) {
    const [ stockAmount, setStockAmount ] = useState("")
    const [ nameProduct, setNameProduct ] = useState<string>('')
    const [ productData, setProductData ] = useState<Product | null>(null)

    const handleSubmit = () => {
        const product = products.data.find((p) => p.id === Number(nameProduct))
        const amount = parseInt(stockAmount)

        if (product && !isNaN(amount)) {
            product.stock += amount
            alert(`Stok ${ product.name } ditambah ${ amount }`)
            setStockAmount("")
            setNameProduct('')
        }
    }
    const handleAddStock = (product: Product | null) => {
        setProductData(product)
    }
    const router = useRouter()

    const { value, isLoading } = useDebounceLoad(nameProduct, 1000);

    useEffect(() => {
        if (value.trim()) {
            router.push(newParam({ name: value }));
        }
    }, [ value, router ]);

    return (
        <ResponsiveModal
            title={ 'Tambah Stok Produk' }
            trigger={ <Button>
                <Plus className="h-4 w-4 mr-2"/>
                Tambah Stok
            </Button>
            }
            footer={ <Button
                onClick={ handleSubmit }
                disabled={ !nameProduct || !stockAmount }
            >
                Simpan
            </Button> }
        >
            <div className="space-y-4">
                <ProductsFilter products={ products }/>

                <div>
                    <Label htmlFor="stock">Tambah Stok</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={ stockAmount }
                        onChange={ (e) => setStockAmount(e.target.value) }
                    />
                </div>
                { productData ?
                    <Card className="flex items-center gap-4 p-4 flex-row border-green-800 border-2">
                        <picture>
                            <img
                                src={ productData.image }
                                alt={ productData.name }
                                className="size-10  rounded-md object-cover"
                            />
                        </picture>

                        <div className="flex-1">
                            <p className="text-sm font-semibold">{ productData.name }</p>
                            <p className="text-xs text-muted-foreground">
                                Stok: { productData.stock } | { formatRupiah(productData.price) }
                            </p>
                        </div>

                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={ () => handleAddStock(null) }
                        >
                            Hapus
                        </Button>
                    </Card>
                    :
                    <div className="space-y-3 overflow-y-auto h-96">
                        {
                            isLoading
                                ? <Card className="flex items-center gap-4 p-4 ">Loading...</Card>
                                : products.data.length === 0
                                    ? <Card className="flex items-center gap-4 p-4">Product Is Not Found</Card>
                                    : products.data
                                    .filter((p) => p.name.toLowerCase().includes(nameProduct.toLowerCase()))
                                    .map((product) => (
                                        <Card key={ product.id }
                                              className="flex items-center gap-4 p-4 flex-row hover:border-primary">
                                            <picture>
                                                <img
                                                    src={ product.image }
                                                    alt={ product.name }
                                                    className="size-10  rounded-md object-cover"
                                                />
                                            </picture>

                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{ product.name }</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Stok: { product.stock } | { formatRupiah(product.price) }
                                                </p>
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={ () => handleAddStock(product) }
                                            >
                                                <Plus/>
                                                <span className={ 'hidden sm:block' }>

                                                Tambah
                                                </span>
                                            </Button>
                                        </Card>
                                    )) }
                    </div>
                }
            </div>
        </ResponsiveModal>
    )
}
