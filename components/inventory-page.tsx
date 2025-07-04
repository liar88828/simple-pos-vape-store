"use client"

import { preOrderProduct } from "@/action/inventory-action";
import { ProductPaging } from "@/action/product-action";
import { InputDateForm, InputForm, SelectForm } from "@/components/form-hook";
import { ResponsiveModalOnly } from "@/components/modal-components";
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
import { formatRupiah, newParam, toastResponse } from "@/lib/my-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Plus, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form";

export function InventoryPage({ products, lowStockProducts, }: {
    products: ProductPaging,
    lowStockProducts: Product[]
}) {
    const [ isProduct, setIsProduct ] = useState<Product | null>(null)
    const [ isModal, setIsModal ] = useState(false)


    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/*<ShowModal>*/ }
            <ReorderStockModal product={ isProduct } isOpen={ isModal } setOpenAction={ setIsModal }/>

            {/*</ShowModal>*/ }
            <div className="flex justify-between items-center mb-6 ">
                <div className="">
                    <h1 className="text-3xl font-bold">Manajemen Inventori</h1>
                </div>
                <div className="flex gap-2 flex-col sm:flex-row">
                    <StockModal products={ products.data }/>
                </div>
            </div>


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
                                                setIsProduct(product)
                                                setIsModal(true)
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


        </div>
    )
}

function ReorderStockModal(
    { product, setOpenAction, isOpen }
    : { product: Product | null } & ModalProps) {

    // const [ productToAddStock, setProductToAddStock ] = useState<Product | null>(null)
    const [ loading, setLoading ] = useState(false)

    const methods = useForm<PreOrderOptionalDefaults>({
            resolver: zodResolver(PreOrderOptionalDefaultsSchema),
            defaultValues: {
                status: '-',
                estimatedDate: new Date(),
                productId: 1,
                quantity: 0,

            } satisfies PreOrderOptionalDefaults
        }
    );

    if (!product) {
        return;
    }

    const onSubmit = methods.handleSubmit(async (data) => {

        setLoading(true)
        // if (productToAddStock) {
        setOpenAction(false)
        // setProductToAddStock(null)
        toastResponse({ response: await preOrderProduct(product, data) })
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
export default function StockModal({ products }: { products: Product[] }) {
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ stockAmount, setStockAmount ] = useState("")
    const [ nameProduct, setNameProduct ] = useState<string>('')
    const [ productData, setProductData ] = useState<Product | null>(null)

    const handleSubmit = () => {
        const product = products.find((p) => p.id === Number(nameProduct))
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
                    <div className="flex w-full  items-center gap-2">
                        <Input type="search" placeholder="Cari Produk..."
                               value={ nameProduct }
                               onChange={ e => setNameProduct(e.target.value) }/>
                        <Button variant="outline">
                            <SearchIcon/>
                        </Button>
                    </div>

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
                    <Card className="flex items-center gap-4 p-4 flex-row border-green-800 border-2"

                    >
                        <img
                            src={ productData.image }
                            alt={ productData.name }
                            className="size-10  rounded-md object-cover"
                        />

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
                                : products.length === 0
                                    ? <Card className="flex items-center gap-4 p-4">Product Is Not Found</Card>
                                    : products
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
                                    ))

                        }


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
