"use client"

import { getBrands, ProductPaging, ProductPreorder } from "@/action/product-action";
import { upsertProductAction } from "@/app/admin/products/product-action";
import { FilterSelect } from "@/components/mini/filter-input";
import { InputDateForm, InputForm, InputNumForm, SelectForm, TextareaForm } from "@/components/mini/form-hook";
import { ResponsiveModal, ResponsiveModalOnly } from "@/components/mini/modal-components";
import { ProductDetailDialogOnly } from "@/components/page/product-detail-dialog-only";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDebounce, } from "@/hooks/use-debounce";
import { ModalProps } from "@/interface/actionType";
import {
    batterySizeOptions,
    categoryOption,
    coilSizeOption,
    cottonSizeOption,
    fluidLevelsOptions,
    nicotineLevelsOptions,
    pageSizeOptions,
    resistanceSizeOption,
    stockStatusOptions,
    typeDeviceOption
} from "@/lib/constants";
import { formatRupiah, getNumberSmall, truncateText } from "@/lib/formatter";
import { getBadgeVariant, getStockLabel, newParam, toastResponse } from "@/lib/helper";
import { ProductOptionalDefaultsSchema } from "@/lib/validation";
import { useSettingStore } from "@/store/use-setting-store";
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Eye, FilterIcon, Pencil, Plus, XIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react"
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export const productDataSchema = ProductOptionalDefaultsSchema.merge(z.object({
    priceOriginal: z.number().min(1).nullish(),
    priceSell: z.number().min(1).nullish(),
    expired: z.date().nullish(),
    sellIn_marketId: z.string(),
}))

export type ProductData = z.infer<typeof productDataSchema>

export function ProductsPage({ products }: { products: ProductPaging }) {
    const [ openCreate, setOpenCreate ] = useState(false);
    const [ openUpdate, setOpenUpdate ] = useState(false);
    const [ openDetail, setOpenDetail ] = useState(false);
    const [ isProduct, setIsProduct ] = useState<ProductPreorder | null>(null);
    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-3xl font-bold">Katalog Produk</h1>
                <Button onClick={ () => setOpenCreate(prevState => !prevState) }>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Produk
                </Button>

                { openCreate &&
						<ModalProductForm setOpenAction={ setOpenCreate } isOpen={ openCreate } product={ null }/>
                }

                { isProduct &&
						<ModalProductForm setOpenAction={ setOpenUpdate } isOpen={ openUpdate } product={ {
                            ...isProduct,
                            sellIn_marketId: '',


                        } }/>
                }
                { isProduct &&
						<ProductDetailDialogOnly isDelete={ true }
												 product={ isProduct }
												 isOpen={ openDetail }
												 setOpenAction={ setOpenDetail }/>
                }
            </div>


            <Card>
                {/* Filters */ }
                <CardHeader>
                    <CardTitle>Filter Produk</CardTitle>
                    <ProductsFilter products={ products.data }/>
                </CardHeader>

                {/* Products Table */ }
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produk</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead>Harga</TableHead>
                                <TableHead>Stok</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { products.data.map((product) => (
                                <TableRow
                                    key={ product.id }
                                    // className={twMerge(
                                    //     clsx(
                                    //         product.stock === 0 && "bg-red-50",
                                    //         product.stock > 0 && product.stock <= product.minStock && "bg-yellow-100/20",
                                    //         product.stock > product.minStock && "bg-green-50"
                                    //     )
                                    // )}
                                >
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <picture>
                                                <img
                                                    src={ product.image }
                                                    alt={ product.name }
                                                    className="min-w-10 h-10 rounded object-cover"
                                                />
                                            </picture>
                                            <div>
                                                <p className="font-medium">{ product.name }</p>
                                                <p className="text-sm text-muted-foreground">{ truncateText(product.description, 10) }</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ product.category }</TableCell>
                                    <TableCell>
                                        { formatRupiah(product.price) }
                                    </TableCell>
                                    <TableCell>
                                        { getNumberSmall(product.stock) }
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={ getBadgeVariant(product.stock, product.minStock) }>
                                            { getStockLabel(product.stock, product.minStock) }
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" onClick={ () => {
                                                setOpenDetail(true)
                                                setIsProduct(product)
                                            } }>
                                                <Eye className="h-3 w-3"/>
                                            </Button>
                                            {/*<ModalProductUpdate product={product} />*/ }
                                            <Button size="sm" variant="outline" onClick={ () => {
                                                setOpenUpdate(true)
                                                setIsProduct(product)
                                                // console.log(product)
                                            } }>
                                                <Pencil className="h-3 w-3"/>
                                            </Button>

                                        </div>
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

export function ProductsFilter({ products, customerName }: { customerName?: string, products: ProductPreorder[], }) {

    const router = useRouter()

    const [ brands, setBrands ] = useState<string[]>([]);

    // Pagination
    const [ itemsPerPage, setItemsPerPage ] = useState(10);
    const [ page, setPage ] = useState(0);

    // Filters
    const [ productName, setProductName ] = useState("");
    const [ productCategory, setProductCategory ] = useState("-");
    const [ productTypeDevice, setProductTypeDevice ] = useState("-");
    const [ productNicotine, setProductNicotine ] = useState("-");
    const [ productFluid, setProductFluid ] = useState("-");
    const [ productResistant, setProductResistant ] = useState("-");
    const [ productCoil, setProductCoil ] = useState("-");
    const [ productCotton, setProductCotton ] = useState("-");
    const [ productBattery, setProductBattery ] = useState("-");
    const [ stockFilter, setStockFilter ] = useState("-");
    const [ productBrand, setProductBrand ] = useState('-');
    const productNameDebounce = useDebounce(productName, 1000);
    const customerNameDebounce = useDebounce(customerName)

    useEffect(() => {
        // Convert "-" to undefined so the backend can ignore these filters
        const filters = {
            productName: productNameDebounce.trim() || undefined,
            customerName: customerNameDebounce?.trim() || undefined,
            productBrand,
            productCotton,
            productBattery,
            productCategory,
            productTypeDevice,
            productNicotine,
            productResistant,
            productCoil,
            productFluid,
            productLimit: String(itemsPerPage),
            productPage: String(page),
        };

        // Only push if at least one filter has value
        const hasAnyFilter = Object.values(filters).some(Boolean);

        if (hasAnyFilter) {
            // @ts-expect-error
            router.push(newParam(filters));
            console.log('Filters applied:', filters);
        }
    }, [ productNameDebounce, router, productBrand, productCategory, productTypeDevice, productNicotine, itemsPerPage, page, productResistant, productCoil, productBattery, productCotton, customerNameDebounce, productFluid ]);

    useEffect(() => {
        getBrands().then(setBrands)
    }, []);

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const onReset = () => {
        // console.log('will execute start')
        setProductName("")
        setProductNicotine("-")
        setProductCategory("-")
        setProductTypeDevice("-")
        setStockFilter("-")
        setProductBrand("-")
        setProductResistant("-")
        setProductBattery("-")
        setProductCoil("-")
        setProductCotton("-")
        setProductFluid("-")
        // console.log('will execute end')

    }

    return (<div className={ 'space-y-2 sm:space-y-4' }>
            <Input
                placeholder="Cari produk..."
                value={ productName }
                type={ 'search' }
                onChange={ (e) => setProductName(e.target.value) }
            />
            <div className="flex sm:gap-4 gap-2 flex-col sm:flex-row ">
                {/*Filter */ }
                <div className="">
                    <ResponsiveModal
                        title="Filter Produk"
                        description="Filter produk sesuai yang kamu inginkan"
                        trigger={ <Button variant="outline"><FilterIcon className="size-4"/>Filter</Button> }
                        footer={ <Button onClick={ onReset } variant="destructive"> Reset <XIcon
                            className="size-4"/>
                        </Button> }>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2 ">
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
                                options={ brands.map(item => ({ label: item, value: item })) }
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

                            <FilterSelect
                                label="Nikotin (liquid)"
                                labelClassName="text-nowrap"
                                value={ productNicotine }
                                onChangeAction={ setProductNicotine }
                                placeholder="Semua level"
                                options={ nicotineLevelsOptions }
                            />

                            <FilterSelect
                                label="Jumlah ml (liquid)"
                                labelClassName="text-nowrap"
                                value={ productFluid }
                                onChangeAction={ setProductFluid }
                                placeholder="Semua level"
                                options={ fluidLevelsOptions }
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

export function ModalProductForm({ isOpen, setOpenAction, product }: ModalProps & { product: ProductData | null }) {
    const [ isPending, startTransition ] = useTransition()
    const [ _selectCategory, setSelectCategory ] = useState<string | null>(null);
    // console.log(product)

    const { isLoading, markets, getMarkets } = useSettingStore()
    useEffect(() => {
        getMarkets().then()
    }, [ getMarkets ]);

    const methods = useForm<ProductData>({
        resolver: zodResolver(productDataSchema),
            defaultValues: product ?? {
                name: "",
                category: "device",
                price: 0,
                priceOriginal: 0,
                stock: 0,
                brand: '-',
                minStock: 5,
                image: "https://picsum.photos/200/300",
                description: "-",
                nicotineLevel: '-',
                flavor: '-',
                type: "-",
                sold: 0,
                coilSize: '-',
                cottonSize: '-',
                resistanceSize: '-',
                batterySize: '-',
                fluidLevel: '-',
                expired: null,
                sellIn_marketId: '',
            } satisfies ProductData
        }
    );
    // console.log(methods.formState.errors)

    useEffect(() => {
        if (product) {
            methods.reset(product);
        }
        console.log('is render');
    }, [ product, methods ]);

    const onSubmit = methods.handleSubmit(async (data) => {
        startTransition(async () => {

            toastResponse({
                response: await upsertProductAction(data, markets.find(m => m.id === data.sellIn_marketId)!),
                onSuccess: () => {
                    setOpenAction(false);
                    methods.reset()
                },

            })
        })
    });

    console.log(methods.formState.errors)
    return (
        <ResponsiveModalOnly isOpen={ isOpen }
                             setOpenAction={ setOpenAction }
                             title={ product ? 'Update Produk' : 'Tambah Produk Baru' }
                             footer={
                                 <DialogFooter>
                                     <Button
                                         disabled={ isPending }
                                         onClick={ onSubmit }>{ product ? 'Update Produk' : 'Simpan Produk' }</Button>
                                 </DialogFooter>
                             }

        >
            <div className="h-[60vh] overflow-y-scroll">
                <FormProvider { ...methods }>
                    <form
                        // onSubmit={ onSubmit }
                        className={ 'space-y-4' }>
                        <div className="grid grid-cols-1 gap-4">
                            <InputForm title="Nama Produk" name="name" placeholder="Nama produk"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm title='Merk' name="brand" placeholder="Nama Merk"/>

                            <SelectForm name="category"
                                onChangeAction={ setSelectCategory }
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={ categoryOption }
                            />


                            { product ? null :
                                <InputNumForm name="priceOriginal" title="Harga Normal" placeholder="0" type="number"/>
                            }
                            <InputNumForm name="price" title="Harga Jual" placeholder="0" type="number"/>
                            { product ? null :
                                <InputForm name="stock" title="Stok Awal" placeholder="0" type="number"/>
                            }
                            <InputForm name="minStock" title="Minimum Stok" placeholder="0" type="number"/>


                            <SelectForm name="type"
                                label="Tipe Device"
                                placeholder="Tipe Device"
                                options={ typeDeviceOption }
                            />


                            <SelectForm name="resistanceSize"
                                label="Resistansi (ohm)"
                                placeholder="Ukuran Resistensi"
                                options={ resistanceSizeOption }
                            />

                            <SelectForm name="coilSize"
                                label="Coil"
                                placeholder="Ukuran Coil"
                                options={ coilSizeOption }
                            />

                            <SelectForm name="cottonSize"
                                label="Cotton"
                                placeholder="Ukuran Cotton"
                                options={ cottonSizeOption }
                            />

                            <SelectForm name="batterySize"
                                label="Arus & Kapasitas (mAh)"
                                placeholder="Ukuran Kapasitas"
                                options={ batterySizeOptions }
                            />


                        </div>
                        <Separator/>

                        <h1 className={ 'font-bold ' }>Liquid</h1>
                        <div className="grid grid-cols-2 gap-4">
                            {/*add separation*/ }
                            <InputForm name="flavor"
                                       title="Rasa (untuk liquid)"
                                       placeholder="Rasa liquid"/>

                            <SelectForm name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={ nicotineLevelsOptions }
                            />

                            <SelectForm name="fluidLevel"
                                label="Volume ml (untuk liquid)"
                                placeholder="Pilih level"
                                options={ fluidLevelsOptions }
                            />
                            {/*add separation*/ }

                            <InputDateForm name={ 'expired' }
                                           title={ "Expired" }
                                           description={ 'Tambahkan Kadaluarsa' }
                                           minDate={ false }
                            />
                        </div>

                        <InputForm name="image" title="URL Gambar" placeholder="Link gambar produk" type="url"/>
                        <TextareaForm name="description" title="Deskripsi" placeholder="Deskripsi produk"/>
                        {/*<DialogFooter className="pt-4">*/ }
                        {/*    <Button type="submit">Simpan Produk</Button>*/ }
                        {/*</DialogFooter>*/ }

                        { isLoading && markets.length === 0 ? null :
                            <SelectForm name="sellIn_marketId"
                                        label="Market"
                                        placeholder="Select a market"
                                        options={ markets.map((s) => ({
                                            label: s.name,
                                            value: s.id,
                                        })) }
                            />
                        }
                    </form>
                </FormProvider>
            </div>
        </ResponsiveModalOnly>
    );
}

