"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
// components/FilterSelect.tsx
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, XIcon } from "lucide-react"
import {
    formatRupiah,
    getBadgeVariant,
    getStockLabel,
    getValueLabel,
    newParam,
    toastResponse,
    truncateText
} from "@/lib/my-utils";
import { InputDateForm, InputForm, InputNumForm, SelectForm, TextareaForm } from "@/components/form-hook";
import { FormProvider, useForm } from "react-hook-form";
import { ProductModel, } from "@/lib/generated/zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { addProduct, updateProduct, upsertProduct } from "@/action/product-action";
import { toast } from "sonner";
import { ProductModelType } from "@/lib/schema";
import { useDebounceLoad, } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { Product, ProductOptionalDefaults, ProductOptionalDefaultsSchema } from "@/lib/generated/zod_gen";
import { ModalProps } from "@/interface/actionType";
import { ProductDetailDialogOnly } from "@/components/product-detail-dialog-only";
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

interface Option {
    label: string;
    value: string;
}

interface FilterSelectProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    options: Option[];
    labelClassName?: string;
}

export function FilterSelect(
    {
        label,
        value,
        onChange,
        placeholder,
        options,
        labelClassName
    }: FilterSelectProps) {
    return (
        <div>
            <Label className={ labelClassName }>{ label }</Label>
            <Select value={ value } onValueChange={ onChange }>
                <SelectTrigger>
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

export function ProductsPage({ products }: { products: Product[] }) {
    const router = useRouter()

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [ categoryFilter, setCategoryFilter ] = useState("-");
    const [ nicotineFilter, setNicotineFilter ] = useState("-");
    const [ deviceTypeFilter, setDeviceTypeFilter ] = useState("-");
    const [ stockFilter, setStockFilter ] = useState("-");
    const [ openCreate, setOpenCreate ] = useState(false);
    const [ openUpdate, setOpenUpdate ] = useState(false);
    const [ openDetail, setOpenDetail ] = useState(false);
    const [ isProduct, setIsProduct ] = useState<Product | null>(null);

    const { value, isLoading } = useDebounceLoad(searchTerm, 1000);

    useEffect(() => {
        if (value.trim()) {
            router.push(newParam({ productName: value }));
            console.log('push')
        }
    }, [value, router]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(10);

    // Filtered Products
    const filteredProducts = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        const categoryLower = categoryFilter.toLowerCase();

        return products.filter(({ name, category, nicotineLevel, type, stock, minStock }) => {
            if (!name.toLowerCase().includes(searchLower)) return false;

            if (categoryFilter !== "-" && category.toLowerCase() !== categoryLower) return false;

            if (nicotineFilter !== "-" && nicotineLevel !== nicotineFilter) return false;

            if (deviceTypeFilter !== "-" && type !== deviceTypeFilter) return false;

            switch (stockFilter) {
                case "available":
                    if (stock <= 0) return false;
                    break;
                case "low":
                    if (stock === 0 || stock > minStock) return false;
                    break;
                case "out":
                    if (stock !== 0) return false;
                    break;
            }

            return true;
        });
    }, [products, searchTerm, categoryFilter, nicotineFilter, deviceTypeFilter, stockFilter]);

    // Total Pages
    const totalPages = useMemo(() => {
        return Math.ceil(filteredProducts.length / itemsPerPage);
    }, [filteredProducts.length, itemsPerPage]);

    // Paginated Products
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);
    const onReset = () => {
        setSearchTerm("")
        setNicotineFilter("-")
        setCategoryFilter("-")
        setDeviceTypeFilter("-")
        setStockFilter("-")
    }

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


            {/* Products Table */}
            <Card>
                {/* Filters */}

                <CardHeader>
                    <CardTitle>Filter Produk</CardTitle>
                    <div className="flex gap-4 sm:gap-6 justify-between flex-col sm:flex-row ">
                        <div className="grid sm:grid-cols-1  gap-4 w-full ">
                            <div className="w-full md:max-w-xl">
                                <Input
                                    placeholder="Cari produk..."
                                    // className="max-w-sm"
                                    value={searchTerm}
                                    type={'search'}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {/*sm:justify-between*/}
                            <div className=" flex  gap-4 sm:gap-6 flex-wrap sm:flex-nowrap">

                                <FilterSelect
                                    label="Kategori"
                                    value={ categoryFilter }
                                    onChange={ setCategoryFilter }
                                    placeholder="Semua kategori"
                                    options={ categoryOption }
                                />

                                <FilterSelect
                                    label="Nikotin"
                                    labelClassName="text-nowrap"
                                    value={ nicotineFilter }
                                    onChange={ setNicotineFilter }
                                    placeholder="Semua level"
                                    options={ nicotineLevelsOptions }
                                />
                                <FilterSelect
                                    label="Device"
                                    value={ deviceTypeFilter }
                                    onChange={ setDeviceTypeFilter }
                                    placeholder="Semua tipe"
                                    options={ typeDeviceOption }
                                />

                                <FilterSelect
                                    label="Stok"
                                    value={ stockFilter }
                                    onChange={ setStockFilter }
                                    placeholder="Semua status"
                                    options={ stockStatusOptions }
                                />
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
                                    { pageSizeOptions.map((value) => (
                                        <SelectItem key={ value } value={ value.toString() }>
                                            { value }
                                        </SelectItem>
                                    )) }
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

                {/* Products Table */}
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
                            {paginatedProducts.map((product) => (
                                <TableRow
                                    key={product.id}
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
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="min-w-10 h-10 rounded object-cover"
                                                />
                                            </picture>
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">{truncateText(product.description, 10)}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{formatRupiah(product.price)}</TableCell>
                                    <TableCell>{getValueLabel(product.stock)}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export function ModalProductForm({ isOpen, setOpenAction, product }: ModalProps & {
    product: ProductOptionalDefaults | null
}) {
    const [ selectCategory, setSelectCategory ] = useState<string | null>(null);
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
            }
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
                                placeholder="Ukuran Kapas"
                                options={ cottonSizeOption }
                            />

                            <SelectForm
                                name="batterySize"
                                label="Arus & Kapasitas (mAh)"
                                placeholder="Ukuran Kapas"
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

export function ModalProductTambah() {
    const [ open, setOpen ] = useState(false);
    const [ selectCategory, setSelectCategory ] = useState<string | null>(null);

    const methods = useForm<ProductOptionalDefaults>({
        resolver: zodResolver(ProductOptionalDefaultsSchema),
        defaultValues: {
            expired: null,
            id: 0,
            name: "",
            category: "device",
            price: 0,
            stock: 0,
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
    });
    // console.log(methods.formState.errors)

    const onSubmit = methods.handleSubmit(async (data) => {
        // console.log(data)
        const response = await addProduct(data);
        if (response.success) {
            toast(response.message);
            setOpen(false); // ✅ Close the dialog
            methods.reset()
        } else {

            toast("You submitted the following values", {
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                        <code className="text-white">{ JSON.stringify(data, null, 2) }</code>
                        <code className="text-white">{ JSON.stringify(methods.formState.errors, null, 2) }</code>
                    </pre>
                )
            })
        }
    });

    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Produk
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                </DialogHeader>

                <FormProvider { ...methods }>
                    <form onSubmit={ onSubmit } className={ 'space-y-4' }>
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm title="Nama Produk" name="name" placeholder="Nama produk"/>

                            <SelectForm
                                onChangeAction={ setSelectCategory }
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={ [
                                    { label: "Aksesoris", value: "aksesoris" },
                                    { label: "Battery", value: "battery" },
                                    { label: "Atomizer", value: "atomizer" },
                                    { label: "Cartridge", value: "cartridge" },
                                    { label: "Tank", value: "tank" },
                                    { label: "Coil", value: "coil" },
                                    { label: "Cotton", value: "cotton" },
                                    { label: "Device", value: "device" },
                                    { label: "Drip Tip", value: "drip-tip" },
                                    { label: "Liquid", value: "liquid" },
                                ] }
                            />


                            <InputNumForm name="price" title="Harga" placeholder="0" type="number"/>
                            <InputForm name="stock" title="Stok Awal" placeholder="0" type="number"/>
                            <InputForm name="minStock" title="Minimum Stok" placeholder="0" type="number"/>


                            <SelectForm
                                name="type"
                                label="Tipe Device"
                                placeholder="Tipe Device"
                                options={ [
                                    { label: "Vape Pod", value: "Pod" },
                                    { label: "Vape Mod", value: "Mod" },
                                    { label: "Vape Disposable", value: "Disposable" },
                                    { label: "-", value: "-" },
                                ] }
                            />
                            <InputForm name="flavor" title="Rasa (untuk liquid)" placeholder="Rasa liquid"/>


                            {/*{ selectCategory }*/ }
                            <SelectForm
                                name="resistanceSize"
                                label="Resistansi (ohm)"
                                placeholder="Ukuran Resistensi"
                                options={ [
                                    { label: "0.15 Ohm low", value: "0.15_OHM_low" },
                                    { label: "0.2 Ohm low", value: "0.2_OHM_low" },
                                    { label: "0.3 Ohm low", value: "0.3_OHM_low" },

                                    { label: "0.8 Ohm med", value: "0.8_OHM_med" },
                                    { label: "1.2 Ohm med", value: "1.2_OHM_med" },

                                    { label: "2.0 Ohm hig", value: "2.0_OHM_hig" },
                                    { label: "2.5 Ohm hig", value: "2.5_OHM_hig" },

                                    { label: "0.6 Ohm cat", value: "0.6_OHM_cat" },
                                    { label: "0.8 Ohm cat", value: "0.8_OHM_cat" },
                                    { label: "-", value: '-' },
                                ] }
                            />

                            <SelectForm
                                name="coilSize"
                                label="Coil"
                                placeholder="Ukuran Coil"
                                options={ [
                                    { label: "24 AWG (0.51 mm)", value: "AWG_24_0.51" },
                                    { label: "26 AWG (0.40 mm)", value: "AWG_26_0.40" },
                                    { label: "28 AWG (0.32 mm)", value: "AWG_28_0.32" },
                                    { label: "30 AWG (0.25 mm)", value: "AWG_30_0.25" },
                                    { label: "-", value: '-' },
                                ] }
                            />

                            <SelectForm
                                name="cottonSize"
                                label="Cotton"
                                placeholder="Ukuran Kapas"
                                options={ [
                                    { label: "24 AWG (0.51 mm)", value: "AWG_24_0.51" },
                                    { label: "26 AWG (0.40 mm)", value: "AWG_26_0.40" },
                                    { label: "28 AWG (0.32 mm)", value: "AWG_28_0.32" },
                                    { label: "30 AWG (0.25 mm)", value: "AWG_30_0.25" },
                                    { label: "-", value: '-' },
                                ] }
                            />

                            <SelectForm
                                name="batterySize"
                                label="Arus & Kapasitas (mAh)"
                                placeholder="Ukuran Kapas"
                                options={ [
                                    { label: "20A - 3000mAh", value: "ARUS_20A_3000" },
                                    { label: "20A - 2000mAh", value: "ARUS_20A_2000" },
                                    { label: "30A - 2000mAh", value: "ARUS_30A_2000" },
                                    { label: "30A - 3000mAh", value: "ARUS_30A_3000" },
                                    { label: "40A - 2000mAh", value: "ARUS_40A_2000" },
                                    { label: "40A - 3000mAh", value: "ARUS_40A_3000" },
                                    { label: "-", value: '-' },
                                ] }
                            />

                            <SelectForm
                                name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={ [
                                    { label: "0mg", value: "0mg" },
                                    { label: "3mg", value: "3mg" },
                                    { label: "6mg", value: "6mg" },
                                    { label: "12mg", value: "12mg" },
                                    { label: "25mg (Salt Nic)", value: "25mg" },
                                    { label: "50mg (Salt Nic)", value: "50mg" },
                                    { label: '-', value: '-' },
                                ] }
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

export function ModalProductUpdate({ product }: { product: ProductModelType }) {
    const [ open, setOpen ] = useState(false);

    const methods = useForm<ProductModelType>({
        resolver: zodResolver(ProductModel),
        defaultValues: product,
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        const response = await updateProduct(data);
        if (response.success) {
            toast.success(response.message);
            setOpen(false); // ✅ Close the dialog
        } else {
            toast.error(response.message, {
                description: (
                    <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
                        <code className="text-white">{ JSON.stringify(data, null, 2) }</code>
                    </pre>
                ),
            });
        }
    });
    return (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Pencil className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Perbarui Produk</DialogTitle>
                </DialogHeader>

                <FormProvider { ...methods }>
                    <form onSubmit={ onSubmit } className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm title="Nama Produk" name="name" placeholder="Nama produk"/>

                            <SelectForm
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={ [
                                    { label: "Device", value: "device" },
                                    { label: "Liquid", value: "liquid" },
                                    { label: "Coil", value: "coil" },
                                    { label: "Aksesoris", value: "aksesoris" },
                                ] }
                            />

                            <InputNumForm name="price" title="Harga" placeholder="0" type="number"/>
                            <InputForm name="stock" title="Stok Awal" placeholder="0" type="number"/>
                            <InputForm name="minStock" title="Minimum Stok" placeholder="0" type="number"/>

                            <SelectForm
                                name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={ [
                                    { label: "0mg", value: "0mg" },
                                    { label: "3mg", value: "3mg" },
                                    { label: "6mg", value: "6mg" },
                                    { label: "12mg", value: "12mg" },
                                    { label: "25mg (Salt Nic)", value: "25mg" },
                                    { label: "50mg (Salt Nic)", value: "50mg" },
                                ] }
                            />

                            <InputForm name="flavor" title="Rasa (untuk liquid)" placeholder="Rasa liquid"/>
                            <InputForm name="type" title="Tipe Produk" placeholder="Tipe produk"/>
                        </div>

                        <InputForm name="image" title="URL Gambar" placeholder="Link gambar produk" type="text"/>
                        <TextareaForm name="description" title="Deskripsi" placeholder="Deskripsi produk"/>

                        <DialogFooter className="pt-4">
                            <Button type="submit">Perbarui Produk</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
