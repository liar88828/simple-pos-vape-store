"use client"

import { ProductPaging, upsertProduct } from "@/action/product-action";
import { InputDateForm, InputForm, InputNumForm, SelectForm, TextareaForm } from "@/components/form-hook";
import { ResponsiveModal } from "@/components/modal-components";
import { ProductDetailDialogOnly } from "@/components/product-detail-dialog-only";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useDebounce, } from "@/hooks/use-debounce";
import { ModalProps } from "@/interface/actionType";
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
import { Product, ProductOptionalDefaults, ProductOptionalDefaultsSchema } from "@/lib/generated/zod_gen";
import {
    formatRupiah,
    getBadgeVariant,
    getStockLabel,
    getValueLabel,
    newParam,
    toastResponse,
    truncateText
} from "@/lib/my-utils";
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Eye, FilterIcon, Pencil, Plus, XIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

interface FilterSelectProps {
    label: string;
    value: string;
    onChangeAction: (val: string) => void;
    placeholder: string;
    options: {
        label: string;
        value: string;
    }[];
    labelClassName?: string;
}

export function FilterSelect(
    {
        label,
        value,
        onChangeAction,
        placeholder,
        options,
        labelClassName
    }: FilterSelectProps) {
    return (
        <div>
            <Label className={ labelClassName }>{ label }</Label>
            <Select value={ value } onValueChange={ onChangeAction }>
                <SelectTrigger className="w-[6rem]">
                    <SelectValue placeholder={ placeholder }/>
                </SelectTrigger>
                <SelectContent>
                    { options.map((item) => (
                        <SelectItem key={ item.value } value={ item.value }>
                            { item.label }
                        </SelectItem>
                    )) }
                </SelectContent>
            </Select>
        </div>
    );
}

export type BrandsProps = { brand: string | null }[];

export function ProductsPage({ products }: { products: ProductPaging }) {
    const [ openCreate, setOpenCreate ] = useState(false);
    const [ openUpdate, setOpenUpdate ] = useState(false);
    const [ openDetail, setOpenDetail ] = useState(false);
    const [ isProduct, setIsProduct ] = useState<Product | null>(null);
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Katalog Produk</h1>
                <Button onClick={ () => setOpenCreate(prevState => !prevState) }>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Produk
                </Button>

                <ModalProductForm setOpenAction={ setOpenCreate } isOpen={ openCreate } product={ null }/>
                <ModalProductForm setOpenAction={ setOpenUpdate } isOpen={ openUpdate } product={ isProduct }/>
                <ProductDetailDialogOnly isDelete={ true } product={ isProduct } isOpen={ openDetail }
                                         setOpenAction={ setOpenDetail }/>
            </div>


            {/* Products Header */ }
            <Card>
                {/* Filters */ }
                <CardHeader className={ 'space-y-2' }>
                    <CardTitle>Filter Produk</CardTitle>
                    <ProductsFilter products={ products }/>
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
                                    <TableCell>{ formatRupiah(product.price) }</TableCell>
                                    <TableCell>{ getValueLabel(product.stock) }</TableCell>
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

export function ProductsFilter({ products, customerName }: { customerName?: string, products: ProductPaging, }) {

    const router = useRouter()

    // Pagination
    const [ itemsPerPage, setItemsPerPage ] = useState(10);
    const [ page, setPage ] = useState(0);

    // Filters
    const [ productName, setProductName ] = useState("");
    const [ productCategory, setProductCategory ] = useState("-");
    const [ productTypeDevice, setProductTypeDevice ] = useState("-");
    const [ productNicotine, setProductNicotine ] = useState("-");
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
            productLimit: String(itemsPerPage),
            productPage: String(page),
        };
        // Only push if at least one filter has value
        const hasAnyFilter = Object.values(filters).some(Boolean);

        if (hasAnyFilter) {
            router.push(newParam(filters));
            console.log('Filters applied:', filters);
        }
    }, [ productNameDebounce, router, productBrand, productCategory, productTypeDevice, productNicotine, itemsPerPage, page, productResistant, productCoil, productBattery, productCotton, customerNameDebounce ]);

    const totalPages = Math.ceil(products.total / itemsPerPage);

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
        // console.log('will execute end')

    }

    return (<>
            <Input
                placeholder="Cari produk..."
                value={ productName }
                type={ 'search' }
                onChange={ (e) => setProductName(e.target.value) }
            />
            <div className="flex gap-4 flex-col sm:flex-row ">
                {/*Filter */ }
                <div className="">
                    <ResponsiveModal
                        title="Filter Produk"
                        description="Filter produk sesuai yang kamu inginkan"
                        trigger={ <Button variant="outline"><FilterIcon className="size-4"/>Filter</Button> }
                        footer={ <Button onClick={ onReset } variant="destructive"> Reset <XIcon
                            className="size-4"/></Button> }>
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
                                options={ products.brands.map(item => ({
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
        </>
    );
}

export function ModalProductForm({ isOpen, setOpenAction, product }: ModalProps & {
    product: ProductOptionalDefaults | null
}) {
    const [ _selectCategory, setSelectCategory ] = useState<string | null>(null);
    // console.log(product)

    const methods = useForm<ProductOptionalDefaults>({
            resolver: zodResolver(ProductOptionalDefaultsSchema),
            defaultValues: product ?? {
                expired: null,
                id: 0,
                name: "",
                category: "device",
                price: 0,
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
            } satisfies ProductOptionalDefaults
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
        toastResponse({
                response: await upsertProduct(data),
                onSuccess: () => {
                    setOpenAction(false); // ✅ Close the dialog
                    methods.reset()
                }, onFailure: () => {
                    toast("You submitted the following values", {
                        description: (
                            <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                                    <code className="text-white">{ JSON.stringify(data, null, 2) }</code>
                                    <code
                                        className="text-white">{ JSON.stringify(methods.formState.errors, null, 2) }</code>
                                </pre>
                        )
                    })
                }
            }
        )

    });

    return (
        <Dialog open={ isOpen } onOpenChange={ setOpenAction }>

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                </DialogHeader>

                <FormProvider { ...methods }>
                    <form onSubmit={ onSubmit } className={ 'space-y-4' }>
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm title="Nama Produk" name="name" placeholder="Nama produk"/>
                            <InputForm title='Merk' name="brand" placeholder="Nama Merk"/>

                            <SelectForm
                                onChangeAction={ setSelectCategory }
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={ categoryOption }
                            />


                            <InputNumForm name="price" title="Harga" placeholder="0" type="number"/>
                            <InputForm name="stock" title="Stok Awal" placeholder="0" type="number"/>
                            <InputForm name="minStock" title="Minimum Stok" placeholder="0" type="number"/>


                            <SelectForm
                                name="type"
                                label="Tipe Device"
                                placeholder="Tipe Device"
                                options={ typeDeviceOption }
                            />
                            <InputForm name="flavor" title="Rasa (untuk liquid)" placeholder="Rasa liquid"/>


                            {/*{ selectCategory }*/ }
                            <SelectForm
                                name="resistanceSize"
                                label="Resistansi (ohm)"
                                placeholder="Ukuran Resistensi"
                                options={ resistanceSizeOption }
                            />

                            <SelectForm
                                name="coilSize"
                                label="Coil"
                                placeholder="Ukuran Coil"
                                options={ coilSizeOption }
                            />

                            <SelectForm
                                name="cottonSize"
                                label="Cotton"
                                placeholder="Ukuran Cotton"
                                options={ cottonSizeOption }
                            />

                            <SelectForm
                                name="batterySize"
                                label="Arus & Kapasitas (mAh)"
                                placeholder="Ukuran Kapasitas"
                                options={ batterySizeOptions }
                            />

                            <SelectForm
                                name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={ nicotineLevelsOptions }
                            />

                            <InputDateForm name={ 'expired' }
                                           title={ "Expired" }
                                           description={ 'Tambahkan Kadaluarsa' }
                                           minDate={ false }
                            />
                        </div>
                        <InputForm name="image" title="URL Gambar" placeholder="Link gambar produk" type="url"/>
                        <TextareaForm name="description" title="Deskripsi" placeholder="Deskripsi produk"/>
                        <DialogFooter className="pt-4">
                            <Button type="submit">Simpan Produk</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
