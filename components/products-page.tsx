"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Trash2, XIcon } from "lucide-react"
import {
    choose,
    formatRupiah,
    getValueLabel,
    newParam,
    toastResponse,
    truncateText,
    variantStatus
} from "@/lib/my-utils";
import { InputForm, InputNumForm, SelectForm, TextareaForm } from "@/components/form-hook";
import { FormProvider, useForm } from "react-hook-form";
import { ProductModel, } from "@/lib/generated/zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { addProduct, deleteProduct, updateProduct } from "@/action/product-action";
import { toast } from "sonner";
import { ProductModelType } from "@/lib/schema";
import { useDebounceLoad, } from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";

interface ProductsPageProps {
    products: ProductModelType[]
}

export function ProductsPage({ products }: ProductsPageProps) {
    const router = useRouter()

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [nicotineFilter, setNicotineFilter] = useState("all");
    const [deviceTypeFilter, setDeviceTypeFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");

    const { value, isLoading } = useDebounceLoad(searchTerm, 1000);

    useEffect(() => {
        if (value.trim()) {
            router.push(newParam({ productName: value }));
            console.log('push')
        }
    }, [value, router]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);

    // Filtered Products
    const filteredProducts = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        const categoryLower = categoryFilter.toLowerCase();

        return products.filter(({ name, category, nicotineLevel, type, stock, minStock }) => {
            if (!name.toLowerCase().includes(searchLower)) return false;

            if (categoryFilter !== "all" && category.toLowerCase() !== categoryLower) return false;

            if (nicotineFilter !== "all" && nicotineLevel !== nicotineFilter) return false;

            if (deviceTypeFilter !== "all" && type !== deviceTypeFilter) return false;

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
        setNicotineFilter("all")
        setCategoryFilter("all")
        setDeviceTypeFilter("all")
        setStockFilter("all")
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Katalog Produk</h1>
                <ModalProductTambah />
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
                                <div>
                                    <Label>Kategori</Label>
                                    <Select
                                        value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua kategori" />
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
                                    <Label className={'text-nowrap'}>Level Nikotin</Label>
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
                                    <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
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
                                    <Label>Status Stok</Label>
                                    <Select value={stockFilter} onValueChange={setStockFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Semua status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua</SelectItem>
                                            <SelectItem value="available">Tersedia</SelectItem>
                                            <SelectItem value="low">Stok Rendah</SelectItem>
                                            <SelectItem value="out">Habis</SelectItem>
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
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
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
                                        <Badge
                                            variant={
                                                variantStatus({
                                                    destructive: product.stock === 0,
                                                    secondary: product.stock > 0 && product.stock <= product.minStock,
                                                    default: product.stock > product.minStock,
                                                })
                                            }
                                        >
                                            {choose(
                                                [product.stock === 0, "Habis"],
                                                [product.stock <= product.minStock, "Stok Rendah"],
                                                [true, "Tersedia"]
                                            )}

                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <ProductDetailDialog product={product} />
                                            <ModalProductUpdate product={product} />

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

export function ModalProductTambah() {
    const [open, setOpen] = useState(false);

    const methods = useForm<ProductModelType>({
        resolver: zodResolver(ProductModel),
        defaultValues: {
            id: 0,
            name: "",
            category: "device",
            price: 0,
            stock: 0,
            minStock: 5,
            image: "https://picsum.photos/200/300",
            description: "-",
            nicotineLevel: '0mg',
            flavor: '-',
            type: "Pod System",
            sold: 0
        } satisfies ProductModelType
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
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                        <code className="text-white">{JSON.stringify(methods.formState.errors, null, 2)}</code>
                    </pre>
                )
            })
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Produk
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambah Produk Baru</DialogTitle>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={onSubmit} className={'space-y-4'}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm title="Nama Produk" name="name" placeholder="Nama produk" />

                            <SelectForm
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={[
                                    { label: "Device", value: "device" },
                                    { label: "Liquid", value: "liquid" },
                                    { label: "Coil", value: "coil" },
                                    { label: "Aksesoris", value: "aksesoris" },
                                ]}
                            />

                            <InputNumForm name="price" title="Harga" placeholder="0" type="number" />
                            <InputForm name="stock" title="Stok Awal" placeholder="0" type="number" />
                            <InputForm name="minStock" title="Minimum Stok" placeholder="0" type="number" />

                            <SelectForm
                                name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={[
                                    { label: "0mg", value: "0mg" },
                                    { label: "3mg", value: "3mg" },
                                    { label: "6mg", value: "6mg" },
                                    { label: "12mg", value: "12mg" },
                                    { label: "25mg (Salt Nic)", value: "25mg" },
                                    { label: "50mg (Salt Nic)", value: "50mg" },
                                ]}
                            />

                            <InputForm name="flavor" title="Rasa (untuk liquid)" placeholder="Rasa liquid" />

                            <SelectForm
                                name="type"
                                label="Tipe Device"
                                placeholder="Tipe Device"
                                options={[
                                    { label: "Pod System", value: "Pod System" },
                                    { label: "Mod", value: "Mod" },
                                    { label: "Disposable", value: "Disposable" },
                                ]}
                            />
                            {/* <InputHook name="type" title="Tipe Produk" placeholder="Tipe produk" /> */}


                        </div>
                        <InputForm name="image" title="URL Gambar" placeholder="Link gambar produk" type="url" />
                        <TextareaForm name="description" title="Deskripsi" placeholder="Deskripsi produk" />
                        <DialogFooter className="pt-4">
                            <Button type="submit">Simpan Produk</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

export function ProductDetailDialog({ product }: { product: ProductModelType }) {

    function DetailItem({ label, value }: { label: string; value: string | number }) {
        return (
            <div className="flex flex-col">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
            </div>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl sm:rounded-2xl shadow-lg">
                <DialogTitle className="text-2xl font-semibold">{product.name}</DialogTitle>
                <DialogDescription className="mb-4 text-sm text-muted-foreground">
                    Kategori: <span className="font-medium text-primary">{product.category}</span>
                </DialogDescription>

                <div className="space-y-6">
                    <div className="">
                        <picture>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-80 object-contain rounded-xl border bg-white"
                            />
                        </picture>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <DetailItem label="Harga" value={`Rp ${product.price.toLocaleString()}`} />
                        <DetailItem label="Stok" value={product.stock} />
                        <DetailItem label="Minimum Stok" value={product.minStock} />
                        <DetailItem label="Tipe Produk" value={product.type} />
                        {product.nicotineLevel && (
                            <DetailItem label="Level Nikotin" value={product.nicotineLevel} />
                        )}
                        {product.flavor && (
                            <DetailItem label="Rasa" value={product.flavor} />
                        )}
                    </div>

                    <div>
                        <h4 className="font-medium text-base mb-1">Deskripsi</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                    </div>
                </div>
                <div className="flex items-end gap-2 justify-end">

                    <DialogClose asChild>
                        <Button variant="outline"
                            className="min-w-24"
                            onClick={async () => {
                                if (confirm('Are you Sure to Delete ?')) {
                                    toastResponse({ response: await deleteProduct(product.id) })
                                }
                            }}
                        >
                            Hapus <Trash2 className="h-3 w-3" />
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="default" className="min-w-24">
                            Tutup
                        </Button>
                    </DialogClose>
                </div>

            </DialogContent>
        </Dialog>
    );
}



export function ProductDetailDialogOnly({ product, isOpen, setOpen, onAdd }: {
    product: ProductModelType | null,
    setOpen: (value: boolean) => void,
    onAdd: () => void,
    isOpen: boolean

}) {

    if (!product) {
        return
    }

    function DetailItem({ label, value }: { label: string; value: string | number }) {
        return (
            <div className="flex flex-col">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
            </div>
        );
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setOpen}
        >
            <DialogContent className="max-w-2xl sm:rounded-2xl shadow-lg">
                <DialogTitle className="text-2xl font-semibold">{product.name}</DialogTitle>
                <DialogDescription className="mb-4 text-sm text-muted-foreground">
                    Kategori: <span className="font-medium text-primary">{product.category}</span>
                </DialogDescription>

                <div className="space-y-6">
                    <div className="">
                        <picture>
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-80 object-contain rounded-xl border bg-white"
                            />
                        </picture>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <DetailItem label="Harga" value={`Rp ${product.price.toLocaleString()}`} />
                        <DetailItem label="Stok" value={product.stock} />
                        <DetailItem label="Minimum Stok" value={product.minStock} />
                        <DetailItem label="Tipe Produk" value={product.type} />
                        {product.nicotineLevel && (
                            <DetailItem label="Level Nikotin" value={product.nicotineLevel} />
                        )}
                        {product.flavor && (
                            <DetailItem label="Rasa" value={product.flavor} />
                        )}
                    </div>

                    <div>
                        <h4 className="font-medium text-base mb-1">Deskripsi</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
                    </div>
                </div>
                <div className="flex items-end gap-2 justify-end">

                    <DialogClose asChild>
                        <Button variant="outline"
                            className="min-w-24"
                            onClick={onAdd}
                        >
                            Add <Plus className="size-4" />
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="default" className="min-w-24">
                            Tutup
                        </Button>
                    </DialogClose>
                </div>

            </DialogContent>
        </Dialog>
    );
}



export function ModalProductUpdate({ product }: { product: ProductModelType }) {
    const [open, setOpen] = useState(false);

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
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            });
        }
    });
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Pencil className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Perbarui Produk</DialogTitle>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputForm title="Nama Produk" name="name" placeholder="Nama produk" />

                            <SelectForm
                                name="category"
                                label="Kategori"
                                placeholder="Pilih kategori"
                                options={[
                                    { label: "Device", value: "device" },
                                    { label: "Liquid", value: "liquid" },
                                    { label: "Coil", value: "coil" },
                                    { label: "Aksesoris", value: "aksesoris" },
                                ]}
                            />

                            <InputNumForm name="price" title="Harga" placeholder="0" type="number" />
                            <InputForm name="stock" title="Stok Awal" placeholder="0" type="number" />
                            <InputForm name="minStock" title="Minimum Stok" placeholder="0" type="number" />

                            <SelectForm
                                name="nicotineLevel"
                                label="Level Nikotin (untuk liquid)"
                                placeholder="Pilih level"
                                options={[
                                    { label: "0mg", value: "0mg" },
                                    { label: "3mg", value: "3mg" },
                                    { label: "6mg", value: "6mg" },
                                    { label: "12mg", value: "12mg" },
                                    { label: "25mg (Salt Nic)", value: "25mg" },
                                    { label: "50mg (Salt Nic)", value: "50mg" },
                                ]}
                            />

                            <InputForm name="flavor" title="Rasa (untuk liquid)" placeholder="Rasa liquid" />
                            <InputForm name="type" title="Tipe Produk" placeholder="Tipe produk" />
                        </div>

                        <InputForm name="image" title="URL Gambar" placeholder="Link gambar produk" type="text" />
                        <TextareaForm name="description" title="Deskripsi" placeholder="Deskripsi produk" />

                        <DialogFooter className="pt-4">
                            <Button type="submit">Perbarui Produk</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}