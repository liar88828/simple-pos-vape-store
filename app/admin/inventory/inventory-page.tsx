"use client"

import { PreorderProduct, ProductPaging } from "@/action/product-action";
import { deletePreorderProduct, preOrderAction, preOrderProductAction } from "@/app/admin/inventory/inventory-action";
import { ProductsFilter } from "@/app/admin/products/products-page";
import { FilterInput, FilterSelect } from "@/components/mini/filter-input";
import { InputDateForm, InputForm, InputNumForm, SelectForm } from "@/components/mini/form-hook";
import { ResponsiveModal, ResponsiveModalOnly } from "@/components/mini/modal-components";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDebounce, useDebounceLoad } from "@/hooks/use-debounce";
import { ModalProps } from "@/interface/actionType";
import { pageSizeOptions, statusPreordersOptions } from "@/lib/constants";
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import { newParam, toastResponse } from "@/lib/helper";
import { PreOrderOptionalDefaults, PreOrderOptionalDefaultsSchema, Product } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ChevronLeft, ChevronRight, Plus, XIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export type InventoryPaging = {
    data: PreorderProduct[],
    total: number,
};

export function InventoryFilter({ inventory }: { inventory: InventoryPaging, }) {

    const router = useRouter()

    // Pagination
    const [ itemsPerPage, setItemsPerPage ] = useState(10);
    const [ page, setPage ] = useState(0);

    // Filters
    const [ isLowStock, setIsLowStock ] = useState('-')
    const [ isLowExpired, setIsLowExpired ] = useState('-')
    const [ isNameProduct, setIsNameProduct ] = useState('')
    const productNameDebounce = useDebounce(isNameProduct);

    useEffect(() => {
        // Convert "-" to undefined so the backend can ignore these filters
        const filters = {
            inventoryName: productNameDebounce.trim() || undefined,
            inventoryStock: isLowStock,
            inventoryExpired: isLowExpired,
            inventoryLimit: String(itemsPerPage),
            inventoryPage: String(page),
        };
        // Only push if at least one filter has value
        const hasAnyFilter = Object.values(filters).some(Boolean);

        if (hasAnyFilter) {
            router.push(newParam(filters));
            console.log('Filters applied:', filters);
        }
    }, [ productNameDebounce, router, itemsPerPage, page, isLowStock, isLowExpired ]);

    const totalPages = Math.ceil(inventory.total / itemsPerPage);

    const onReset = () => {
        // console.log('will execute start')
        setIsNameProduct("")
        setIsLowStock("-")
        setIsLowExpired("-")

    }

    return (
        <div className={ 'space-y-2 sm:space-y-4' }>
            <div className="flex gap-2 flex-col">
                <FilterInput
                    type={ 'search' }
                    value={ isNameProduct }
                    onChangeAction={ setIsNameProduct }
                    label={ "" }
                    placeholder={ 'Cari Name Produk' }
                />
                <div className="flex gap-2">

                    <FilterSelect
                        label=""
                        value={ isLowStock }
                        onChangeAction={ setIsLowStock }
                        placeholder="Pilih Stock"
                        options={ [
                            { label: 'Pilih Stock', value: '-' },
                            { label: 'Stock Low', value: 'low' },
                            { label: 'Stock High', value: 'high' }
                        ] }
                    />

                    <FilterSelect
                        label=""
                        value={ isLowExpired }
                        onChangeAction={ setIsLowExpired }
                        placeholder="Pilih Expired"
                        options={ [
                            { label: 'Pilih Expired', value: '-' },
                            { label: 'Expired Low', value: 'low' },
                            { label: 'Expired High', value: 'high' }
                        ] }
                    />
                    <Button onClick={ onReset } variant="destructive"> Reset <XIcon
                        className="size-4"/>
                    </Button>
                </div>
            </div>

            <div className="flex sm:gap-4 gap-2 flex-col sm:flex-row ">
                {/*Paging*/ }
                <div className="flex items-center gap-2 sm:gap-4 ">
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
        </div>
    );
}

type InventoryPageProps = {
    products: ProductPaging,
    preorders: InventoryPaging
    lowStockProducts: Product[],
    expiredProduct: PreorderProduct[],
};

export function InventoryPage({ products, lowStockProducts, expiredProduct, preorders }: InventoryPageProps) {
    const [ isLoadingHistoryPreorder, setIsLoadingHistoryPreorder ] = useState(false)
    // console.log(products)
    const [ isModalStock, setIsModalStock ] = useState(false)
    const [ isStock, setIsStock ] = useState<Product | null>(null)

    const [ isModalPreorder, setIsModalPreorder ] = useState(false)
    const [ isPreorder, setIsPreorder ] = useState<PreorderProduct | null>(null)

    const [ isModalExpired, setIsModalExpired ] = useState(false)
    const [ isPreorderExpired, setIsPreorderExpired ] = useState<PreorderProduct | null>(null)

    // const [ isLowStock, setIsLowStock ] = useState('-')
    // const [ isLowExpired, setIsLowExpired ] = useState('-')
    // const [ isNameProduct, setIsNameProduct ] = useState('')

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-3xl font-bold">Manajemen Inventori</h1>

                <AddStockModal products={ products }/>

                { isPreorder && isModalPreorder &&
						<ReorderModal preorderProduct={ isPreorder }
									  isOpen={ isModalPreorder }
									  setOpenAction={ setIsModalPreorder }/> }
                {/*Tambah Stok*/ }
                { isStock && isModalStock &&
						<ReorderStockModal isStock={ isStock }
										   isOpen={ isModalStock }
										   setOpenAction={ setIsModalStock }/> }


                { isPreorderExpired && isModalExpired &&
						<ReorderModal preorderProduct={ isPreorderExpired }
									  isOpen={ isModalExpired }
									  setOpenAction={ setIsModalExpired }/> }

            </div>

            {/* History Preorder */ }
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center">Produk Preorder History</CardTitle>
                    <InventoryFilter inventory={ preorders }/>
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
                            { preorders.data.map((item) => (
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
                                                <div className="flex gap-2">
                                                    <span
                                                        className="font-light">Normal: { formatRupiah(item.priceNormal) }</span>
                                                    -
                                                    <span
                                                        className="font-light">Sell: { formatRupiah(item.product.price) }</span>
                                                    =
                                                    <span
                                                        className="font-light">Profit: { formatRupiah(item.priceSell - item.priceNormal) }</span>
                                                </div>

                                                <span className="font-light">Total Stock: { item.product.stock }</span>
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex flex-col gap-2">
                                            <Badge variant={ 'default' }>
                                                Order : { item.quantity }
                                            </Badge>


                                        </div>
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

                                            <Button
                                                disabled={ isLoadingHistoryPreorder }
                                                size="sm" variant={ 'destructive' }

                                                onClick={ async () => {
                                                        if (confirm(`Apakah Anda Yakin Untuk Hapus Data ini ${ item.product.name } ?`)) {
                                                            console.log('delete')
                                                            toastResponse({
                                                                onStart: () => setIsLoadingHistoryPreorder(true),
                                                                onFinish: () => setIsLoadingHistoryPreorder(false),
                                                                response: await deletePreorderProduct(item.id),
                                                            })
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
                    <CardTitle className="flex flex-col gap-2">
                        <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>Produk Expired
                            : { expiredProduct.length } Produk
                        </div>
                        <div className="">Tanggal Sekarang : { formatDateIndo(new Date()) }</div>
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
                                    <TableCell><Badge variant="destructive">{ item.quantity }</Badge></TableCell>
                                    <TableCell>{ formatDateIndo(item.expired ?? new Date()) }</TableCell>
                                    {/*<TableCell>{ product.minStock - product.stock + 10 }</TableCell>*/ }
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            onClick={ () => {
                                                setIsPreorderExpired(item)
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

export function ReorderModal({ preorderProduct, setOpenAction, isOpen }: {
    preorderProduct: PreorderProduct
} & ModalProps) {

    const [ loading, setLoading ] = useState(false)

    const methods = useForm<PreOrderOptionalDefaults>({
            resolver: zodResolver(PreOrderOptionalDefaultsSchema),
            defaultValues: {
                id: preorderProduct.id,
                productId: preorderProduct.productId,
                quantity: preorderProduct.quantity,
                status: preorderProduct.status,
                priceNormal: preorderProduct.priceNormal,
                priceSell: preorderProduct.priceSell,
                estimatedDate: new Date(preorderProduct?.estimatedDate ?? new Date()),
                expired: new Date(preorderProduct?.expired ?? new Date()),
            } satisfies PreOrderOptionalDefaults
        }
    );

    const onSubmit = methods.handleSubmit(async (data) => {
        toastResponse({
            onStart: () => {
                setLoading(true)
            },
            response: await preOrderAction(data, preorderProduct),
            onFinish: () => setLoading(false),
            onSuccess: () => {
                setOpenAction(false)
            }
        })
    })
    console.log(methods.formState.errors)
    return (
        <ResponsiveModalOnly title={ 'Ubah Preorder Produk' }
                             isOpen={ isOpen } setOpenAction={ setOpenAction }
                             footer={ <Button onClick={ onSubmit } disabled={ loading }>Ubah</Button> }
        >
            <FormProvider { ...methods }>
                <form onSubmit={ onSubmit } className={ 'space-y-4' }>
                    <div className="grid grid-cols-2 gap-4">
                        <InputForm name="quantity" title="Jumlah Tambahan" placeholder="0" type="number"/>
                        <SelectForm
                            name="status"
                            label="Status"
                            placeholder="Pilih status"
                            options={ statusPreordersOptions }
                        />
                        <InputNumForm name={ 'priceNormal' } title={ 'Harga Beli' }/>
                        <InputNumForm name={ 'priceSell' } title={ 'Harga Jual' }/>
                        <InputDateForm name={ 'estimatedDate' }
                                       title={ "Tanggal Beli" }
                                       description={ 'Kapan Tanggal beli' }
                                       minDate={ false }
                        />

                        <InputDateForm name={ 'expired' }
                                       title={ "Expired" }
                                       description={ 'Kapan Tanggal Kadaluarsa' }
                                       minDate={ false }
                        />
                    </div>
                </form>
            </FormProvider>
        </ResponsiveModalOnly>

    );
}

{/*Tambah Stok*/
}
export function ReorderStockModal({ isStock, setOpenAction, isOpen }: { isStock: Product } & ModalProps) {

    // const [ productToAddStock, setProductToAddStock ] = useState<Product | null>(null)
    const [ loading, setLoading ] = useState(false)

    const methods = useForm<PreOrderOptionalDefaults>({
        resolver: zodResolver(PreOrderOptionalDefaultsSchema
            // .extend({
            //     status: PreOrderOptionalDefaultsSchema.shape.status.refine(
            //         (val) => val !== "-",
            //         { message: "Status cannot be '-'" }
            //     )
            // })
        ),
            defaultValues: {
                status: '-',
                productId: isStock.id,
                priceSell: isStock.price,
                priceNormal: 0,
                quantity: 0,
                estimatedDate: new Date(),
                expired: new Date()
            } satisfies PreOrderOptionalDefaults
        }
    );

    const onSubmit = methods.handleSubmit(async (data) => {
        toastResponse({
            onStart: () => {
                setLoading(true)
                setOpenAction(false)
            },
            response: await preOrderProductAction(data),
            onFinish: () => setLoading(false)
        })
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
                            options={ statusPreordersOptions }
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


export function AddStockModal({ products }: { products: ProductPaging, }) {
    const router = useRouter()
    const [ nameProduct, setNameProduct ] = useState<string>('')
    const [ productData, setProductData ] = useState<Product | null>(null)
    const { value, isLoading } = useDebounceLoad(nameProduct, 1000);

    useEffect(() => {
        if (value.trim()) {
            router.push(newParam({ name: value }));
        }
    }, [ value, router ]);

    const methods = useForm<PreOrderOptionalDefaults>({
            resolver: zodResolver(PreOrderOptionalDefaultsSchema),
            defaultValues: {
                status: '-',
                estimatedDate: new Date(),
                productId: productData?.id ?? 0,
                priceSell: productData?.price ?? 0,
                quantity: 0,
                priceNormal: 0,
                expired: new Date()

            } satisfies PreOrderOptionalDefaults
        }
    );

    useEffect(() => {
        if (productData) {
            methods.reset({
                ...methods.getValues(),
                productId: productData.id,
                priceSell: productData.price,
            });
        }
    }, [ methods, productData ]);

    const onSubmit = methods.handleSubmit(async (data) => {
            if (productData) {
                const product = products.data.find((p) => p.id === productData.id)
                // && alert(`Stok ${ product.name } ditambah ${ data.quantity }`)
                if (product) {
                    toastResponse({
                        response: await preOrderProductAction(data)
                    })
                    setNameProduct('')
                }
            } else {
                toast.error('Please add product')
            }
        }
    )

    return (
        <ResponsiveModal
            title={ 'Tambah Stok Produk' }
            trigger={ <Button><Plus className="h-4 w-4 mr-2"/>Tambah Stok</Button> }
            footer={ <Button onClick={ onSubmit } disabled={ !productData }>Simpan</Button> }>

            <div className="space-y-4">
                <ProductsFilter products={ products }/>

                <FormProvider { ...methods }>
                    <form
                        // onSubmit={ onSubmit }
                        className={ 'space-y-4' }>
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm name="quantity" title="Jumlah Tambahan" placeholder="0" type="number"/>
                            <SelectForm
                                name="status"
                                label="Status"
                                placeholder="Pilih status"
                                options={ statusPreordersOptions }
                            />
                            <InputNumForm name={ 'priceNormal' } title={ 'Harga Beli' }/>
                            <InputNumForm name={ 'priceSell' } title={ 'Harga Jual' }/>
                            <InputDateForm name={ 'estimatedDate' }
                                           title={ "Tanggal Beli" }
                                           description={ 'Kapan Tanggal beli' }
                                           minDate={ false }
                            />

                            <InputDateForm name={ 'expired' }
                                           title={ "Expired" }
                                           description={ 'Kapan Tanggal Kadaluarsa' }
                                           minDate={ false }
                            />
                        </div>
                    </form>
                </FormProvider>

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
                            onClick={ () => setProductData(null) }
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
                                                onClick={ () => setProductData(product) }
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
