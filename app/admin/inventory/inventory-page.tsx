"use client"

import { PreorderProduct, ProductPreorder } from "@/action/product-action";
import {
    createAddPreOrderProductAdmin,
    createPreOrderProductEmployeeAction,
    deletePreorderProduct,
    preOrderAction
} from "@/app/admin/inventory/inventory-action";
import { ProductsFilter } from "@/app/admin/products/products-page";
import { FilterInput } from "@/components/mini/filter-input";
import { InputDateForm, InputForm, InputNumForm, SelectForm } from "@/components/mini/form-hook";
import { ResponsiveModal, ResponsiveModalOnly } from "@/components/mini/modal-components";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDebounce, useDebounceLoad } from "@/hooks/use-debounce";
import { ModalProps } from "@/interface/actionType";
import { pageSizeOptions, statusPreordersOptions } from "@/lib/constants";
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import { newParam, toastResponse } from "@/lib/helper";
import { preOrderForm, PreOrderForm } from "@/lib/preorder-schema";
import { PreOrderOptionalDefaults, PreOrderOptionalDefaultsSchema, Product } from "@/lib/validation";
import { useProductFilter } from "@/store/use-product-filter";
import { useSettingStore } from "@/store/use-setting-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { STATUS_PREORDER } from "@prisma/client";
import {
    AlertTriangle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Edit2Icon,
    Eye,
    Plus,
    StickyNote,
    Trash
} from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export type InventoryPaging = {
    data: PreorderProduct[],
    total: number,
};

export function FilterInventory() {
    const router = useRouter()
    const {
        setPage,
        setItemsPerPage,
        itemsPerPage,
        isLowStock,
        page,
        setIsLowStock,
        isLowExpired,
        setIsLowExpired,
        isNameProduct,
        reset,
    } = useProductFilter()

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
            //@ts-expect-error
            router.push(newParam(filters));
            console.log('Filters applied:', filters);
        }
    }, [ productNameDebounce, router, itemsPerPage, page, isLowStock, isLowExpired ]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Filter
                    <ChevronDown className="-mr-1 ml-2 size-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuSeparator/>

                {/*-------*/ }

                {/*<DropdownMenuSeparator/>*/ }

                {/*    ------*/ }
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <StickyNote className="mr-2 size-4"/>
                        <span>Pagination</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>

                            <DropdownMenuRadioGroup
                                value={ String(itemsPerPage) }
                                onValueChange={ (value) => {
                                    setItemsPerPage(Number(value));
                                    setPage(0); // Reset ke halaman pertama
                                } }>

                                { pageSizeOptions
                                .map((item) => {
                                    return <DropdownMenuRadioItem
                                        key={ item }
                                        value={ String(item) }>{ item }</DropdownMenuRadioItem>
                                }) }
                            </DropdownMenuRadioGroup>

                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator/>
                {/*----------*/ }
                <DropdownMenuLabel inset>Pilih Stock</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={ isLowStock } onValueChange={ setIsLowStock }>
                    { [
                        { label: 'Stock Low', value: 'low' },
                        { label: 'Stock High', value: 'high' }
                    ].map((item) => {
                        return <DropdownMenuRadioItem key={ item.value }
                                                      value={ item.value }>{ item.label }</DropdownMenuRadioItem>
                    }) }
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator/>
                <DropdownMenuLabel inset>Pilih Expired</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={ isLowExpired } onValueChange={ setIsLowExpired }>
                    { [
                        { label: 'Expired Low', value: 'low' },
                        { label: 'Expired High', value: 'high' }
                    ].map((item) => {
                        return <DropdownMenuRadioItem key={ item.value }
                                                      value={ item.value }>{ item.label }</DropdownMenuRadioItem>
                    }) }
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator/>
                <DropdownMenuItem variant={ 'destructive' } onClick={ reset }>Reset to Default</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function InventoryFilter({ inventory }: { inventory: InventoryPaging }) {

    const router = useRouter()

    const {
        setPage,
        setIsNameProduct,
        itemsPerPage,
        isLowStock,
        isLowExpired,
        page,
        isNameProduct,
    } = useProductFilter()

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
            //@ts-expect-error
            router.push(newParam(filters));
            console.log('Filters applied:', filters);
        }
    }, [ productNameDebounce, router, itemsPerPage, page, isLowStock, isLowExpired ]);

    const totalPages = Math.ceil(inventory.total / itemsPerPage);

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

            </div>

            <div className="flex items-center   justify-between">
                <FilterInventory/>
                <section className="flex items-center gap-2 sm:gap-4 ">
                    <Button
                        variant="outline"
                        onClick={ () => setPage((prev) => Math.max(0, prev - 1)) }
                        disabled={ page === 0 }
                    >
                        <ChevronLeft/>
                    </Button>


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
                </section>
            </div>

        </div>
    );
}

// History Preorder
export function ProductPreorderHistory({ preorders }: { preorders: InventoryPaging }) {
    const [ isPending, startTransition ] = useTransition()
    const [ isPreorder, setIsPreorder ] = useState<PreorderProduct | null>(null)
    const [ isModalPreorder, setIsModalPreorder ] = useState(false)
    const handlerDelete = async (item: PreorderProduct) => {
        startTransition(async () => {
            if (confirm(`Apakah Anda Yakin Untuk Hapus Data ini ${ item.Product.name } ?`)) {
                toastResponse({ response: await deletePreorderProduct(item.id) })
            }
        })

    }

    const handlerEdit = (item: PreorderProduct) => {
        setIsPreorder(item)
        setIsModalPreorder(true)
    }

    return (
        <Card className="mb-6">
            {/* Ubah */ }
            { isPreorder && isModalPreorder &&
					<ReorderModal preorderProduct={ isPreorder }
								  isOpen={ isModalPreorder }
								  setOpenAction={ setIsModalPreorder }/> }
            <CardHeader>
                <CardTitle className="flex items-center">Produk Preorder History</CardTitle>
                <InventoryFilter inventory={ preorders }/>
                {/*<FilterInventory inventory={ preorders }/>*/ }
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
                                        <picture className={ 'w-10' }>
                                            <img
                                                src={ item.Product.image || "/placeholder.svg" }
                                                alt={ item.Product.name }
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                        </picture>
                                        <div className="flex flex-col">
                                            <span className="font-bold truncate w-40">{ item.Product.name }</span>
                                            <div className="flex gap-2">
                                                    <span
                                                        className="font-light">Normal: { formatRupiah(item.priceOriginal) }</span>
                                                {/*-*/ }
                                                {/*<span*/ }
                                                {/*    className="font-light">Sell: { formatRupiah(item.Product.price) }</span>*/ }
                                                {/*=*/ }
                                                {/*<span*/ }
                                                {/*    className="font-light">Profit: { formatRupiah(item.priceSell - item.priceNormal) }</span>*/ }
                                            </div>

                                            {/*<span className="font-light">*/ }
                                            {/*Total Stock: { item.Product.stock }*/ }
                                            {/*<Badge variant={ 'default' }>Order : { item.quantity }</Badge>*/ }
                                            {/*        </span>*/ }
                                        </div>
                                    </div>
                                </TableCell>

                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        <Badge variant={ 'default' }>{ item.status } : { item.quantity }</Badge>
                                    </div>
                                </TableCell>
                                <TableCell>{ formatDateIndo(item?.expired) }</TableCell>
                                {/*<TableCell>{ product.minStock - product.stock + 10 }</TableCell>*/ }
                                <TableCell>


                                    <div className="space-x-2">
                                        <ActionDropdown
                                            idDisabled={ isPending }
                                            onEditAction={ () => handlerEdit(item) }
                                            onDeleteAction={ () => handlerDelete(item) }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

    );
}

// Expired Alert
export function ProductExpired({ expiredProduct }: { expiredProduct: PreorderProduct[] }) {
    const [ isModalExpired, setIsModalExpired ] = useState(false)
    const [ isPreorderExpired, setIsPreorderExpired ] = useState<PreorderProduct | null>(null)
    return (
        <Card className="mb-6">
            { isPreorderExpired && isModalExpired &&
					<ReorderModal preorderProduct={ isPreorderExpired }
								  isOpen={ isModalExpired }
								  setOpenAction={ setIsModalExpired }/> }
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
                                                src={ item.Product.image || "/placeholder.svg" }
                                                alt={ item.Product.name }
                                                className="w-8 h-8 rounded object-cover"
                                            />
                                        </picture>
                                        <span className="font-medium">{ item.Product.name }</span>
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
    );
}

export function ReorderModal({ preorderProduct, setOpenAction, isOpen }: {
    preorderProduct: PreorderProduct
} & ModalProps) {
    const [ isPending, startTransition ] = useTransition()
    const { isLoading, markets, getMarkets } = useSettingStore()

    useEffect(() => {
        getMarkets().then()
    }, [ getMarkets ]);

    const methods = useForm<PreOrderOptionalDefaults>({
        resolver: zodResolver(PreOrderOptionalDefaultsSchema),
            defaultValues: {
                market_name: preorderProduct.market_name,
                marketId_sellIn: preorderProduct.marketId_sellIn,
                userId: '',
                id: preorderProduct.id,
                productId: preorderProduct.productId,
                quantity: preorderProduct.quantity,
                status: preorderProduct.status,
                priceOriginal: preorderProduct.priceOriginal,
                estimatedDate: new Date(preorderProduct?.estimatedDate ?? new Date()),
                expired: new Date(preorderProduct?.expired ?? new Date()),
            } satisfies PreOrderOptionalDefaults
        }
    );

    const onSubmit = methods.handleSubmit(async (data) => {
        startTransition(async () => {
            toastResponse({
                response: await preOrderAction(data, preorderProduct, markets.find(i => i.id === data.marketId_sellIn)!),
                onSuccess: () => setOpenAction(false)
            })
        })
    })

    console.log(methods.formState.errors)

    return (<>
            <ResponsiveModalOnly title={ 'Ubah Preorder inventory' }
                             isOpen={ isOpen } setOpenAction={ setOpenAction }
                                 footer={ <Button onClick={ onSubmit }
                                                  disabled={ isPending || isLoading }>Ubah</Button> }
        >
            <FormProvider { ...methods }>
                <form onSubmit={ onSubmit } className={ 'space-y-4' }>
                    <div className="grid grid-cols-2 gap-4">
                        <InputForm name="quantity" title="Jumlah Tambahan" placeholder="0" type="number"
                                   description={ `Stock Sekarang: ${ preorderProduct.Product.stock }` }
                        />
                        <SelectForm
                            name="status"
                            label="Status"
                            placeholder="Pilih status"
                            options={ statusPreordersOptions }
                        />
                        <InputNumForm name={ 'priceOriginal' } title={ 'Harga Normal' }
                                      description={ 'Harga asli bukan harga jual' }
                        />
                        {/*<InputNumForm name={ 'priceSell' } title={ 'Harga Jual' }/>*/ }
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


                        <SelectForm
                            name="marketId_sellIn"
                            label="Shop"
                            placeholder="Select a shop"
                            options={ markets.map((s) => ({
                                label: s.name,
                                value: s.id,
                            })) }
                        />

                    </div>
                </form>
            </FormProvider>
        </ResponsiveModalOnly>
        </>


    );
}

// Tambah Stok
export function ReorderStockModal({ isStock, }: { isStock: Product }) {
    const [ isModalStock, setIsModalStock ] = useState(false)
    const [ isPending, startTransition ] = useTransition()

    const methods = useForm<PreOrderOptionalDefaults>({
        resolver: zodResolver(PreOrderOptionalDefaultsSchema),
            defaultValues: {
                market_name: '',
                marketId_sellIn: "",
                userId: '',
                status: STATUS_PREORDER.Pending,
                productId: isStock.id,
                priceOriginal: isStock.price,
                quantity: 0,
                estimatedDate: new Date(),
                expired: new Date(),
            } satisfies PreOrderOptionalDefaults
        }
    );

    const onSubmit = methods.handleSubmit(async (data) => {
        startTransition(async () => {
            console.log('execute : Tambah Stok')
            toastResponse({
                response: await createPreOrderProductEmployeeAction(data),
                onFinish: () => setIsModalStock(false),
            })
        })
    })

    return (<>
            <Button size="sm" onClick={ () => setIsModalStock(true) }>Reorder</Button>
            <ResponsiveModalOnly title={ 'Tambah Stok' }
                                 isOpen={ isModalStock } setOpenAction={ setIsModalStock }
                                 footer={ <Button onClick={ onSubmit } disabled={ isPending }>Simpan</Button> }
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
                            <InputNumForm name={ 'priceNormal' } title={ 'Harga Normal' }/>
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
        </>

    );
}

export function AddStockModal({ preorder, }: { preorder: ProductPreorder[] }) {
    const router = useRouter()
    const [ nameProduct, setNameProduct ] = useState<string>('')
    const [ productData, setProductData ] = useState<Product | null>(null)
    const { value, isLoading } = useDebounceLoad(nameProduct, 1000);
    const [ isPending, startTransition ] = useTransition()

    const { markets, getMarkets } = useSettingStore()

    useEffect(() => {
        getMarkets().then()
    }, [ getMarkets ]);

    useEffect(() => {
        if (value.trim()) {
            //@ts-expect-error
            router.push(newParam({ name: value }));
        }
    }, [ value, router ]);

    const methods = useForm<PreOrderForm>({
        resolver: zodResolver(preOrderForm),
            defaultValues: {
                status: STATUS_PREORDER.Pending,
                estimatedDate: new Date(),
                productId: productData?.id ?? '',
                priceOriginal: productData?.price ?? 0,
                quantity: 0,
                expired: new Date(),
                marketId_sellIn: ''
            } satisfies PreOrderForm
        }
    );

    useEffect(() => {
        if (productData) {
            methods.reset({
                ...methods.getValues(),
                productId: productData.id,
                priceOriginal: productData.price,
            });
        }
    }, [ methods, productData ]);

    const onSubmit = methods.handleSubmit(async (preorder) => {
        startTransition(async () => {
            // console.log('execute Tambah Stok Produk ')
            const market = markets.find(market => market.id === preorder.marketId_sellIn)
            if (productData && market) {
                toastResponse({
                    response: await createAddPreOrderProductAdmin(preorder, market),
                    onSuccess: () => setNameProduct('')
                })

            } else {
                toast.error('Please add product')
            }
        })
    })

    console.log(methods.formState.errors)

    return (
        <ResponsiveModal
            title={ 'Tambah Stok Inventory' }
            trigger={ <Button><Plus className="h-4 w-4 mr-2"/>Tambah Stok</Button> }
            footer={ <Button onClick={ onSubmit } disabled={ !productData || isPending }>Simpan</Button> }>

            <div className="space-y-4">
                <ProductsFilter products={ preorder }/>

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


                            <InputNumForm name={ 'priceOriginal' } title={ 'Harga Normal' }
                                          description={ 'Harga asli bukan harga jual' }
                            />
                            {/*<InputNumForm name={ 'priceSell' } title={ 'Harga Jual' }/>*/ }
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

                            <SelectForm
                                name="marketId_sellIn"
                                label="Shop"
                                placeholder="Select a shop"
                                options={ markets.map((s) => ({
                                    label: s.name,
                                    value: s.id,
                                })) }
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
                                : preorder.length === 0
                                    ? <Card className="flex items-center gap-4 p-4">Product Is Not Found</Card>
                                    : preorder
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
                                                <span className={ 'hidden sm:block' }>Tambah</span></Button>
                                        </Card>
                                    )) }
                    </div>
                }
            </div>
        </ResponsiveModal>
    )
}

export default function ActionDropdown(
    {
        idDisabled,
        onEditAction,
        onDetailAction,
        onDeleteAction
    }: {
        idDisabled?: boolean;
        onEditAction?: () => void,
        onDetailAction?: () => void,
        onDeleteAction?: () => void;
    }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-sm">
                    Actions
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                { onDetailAction ?
                    <DropdownMenuItem
                        disabled={ idDisabled }
                        onClick={ onDetailAction }>
                        <Eye className="stroke-2 size-4"/> Detail
                    </DropdownMenuItem>
                    : null }
                { onEditAction ?
                    <DropdownMenuItem
                        disabled={ idDisabled }
                        onClick={ onEditAction }>
                        <Edit2Icon className="stroke-2 size-4"/> Edit
                    </DropdownMenuItem>
                    : null }
                {/*<DropdownMenuItem>*/ }
                {/*    <Share className="stroke-2 size-4" /> Share*/ }
                {/*</DropdownMenuItem>*/ }
                { onDeleteAction ? <>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            disabled={ idDisabled }
                            onClick={ onDeleteAction }
                            variant={ "destructive" }
                        >
                            <Trash className="stroke-2 size-4"/> Delete
                        </DropdownMenuItem>
                    </>
                    : null }
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

