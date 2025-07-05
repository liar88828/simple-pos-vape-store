'use client'
import { deleteProduct, getProductById } from "@/action/product-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ModalProps } from "@/interface/actionType";
import { Product } from "@/lib/generated/zod_gen";
import { toastResponse } from "@/lib/my-utils";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import React from "react";

function DetailItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="flex flex-col">
            <span className="text-xs sm:text-base text-muted-foreground">{ label }</span>
            <span className="text-xs sm:text-base font-medium">{ value }</span>
        </div>
    );
}

export function ProductDetailDialogOnly({ product, isOpen, setOpenAction, onAdd, isAdd = false, isDelete = false }: {
    product: Product | null,
    onAdd?: () => void,
    isAdd?: boolean,
    isDelete?: boolean,
} & ModalProps) {

    if (!product) {
        console.log('Product not found');
        // setOpenAction(false);
        return
    }

    return (
        <Dialog
            open={ isOpen }
            onOpenChange={ setOpenAction }
        >
            <DialogContent className="sm:max-w-2xl sm:rounded-2xl shadow-lg p-4 sm:p-6 ">
                <DialogTitle className="text-sm sm:text-2xl font-semibold">{ product.name }</DialogTitle>
                {/*<DialogDescription className="mb-4 text-sm text-muted-foreground">*/ }
                {/*    Kategori: <span className="font-medium text-primary">{ product.category } </span>*/ }
                {/*</DialogDescription>*/ }

                <div className="space-y-6 overflow-y-scroll h-[60vh]">
                    <div className="">
                        <picture>
                            <img
                                src={ product.image }
                                alt={ product.name }
                                className="w-full h-56 sm:h-80 object-contain rounded-xl border bg-white"
                            />
                        </picture>
                    </div>

                    <div className="grid grid-cols-2 sm:gap-4 gap-2">

                        <DetailItem label="Harga" value={ `Rp ${ product.price.toLocaleString() }` }/>
                        <DetailItem label="Stok" value={ product.stock }/>
                        <DetailItem label="Minimum Stok" value={ product.minStock }/>
                        <DetailItem label="Tipe Produk" value={ product.type }/>

                        { product.brand && (
                            <DetailItem label="Merek" value={ product.brand }/>
                        ) }

                        { product.nicotineLevel && (
                            <DetailItem label="Level Nikotin" value={ product.nicotineLevel }/>
                        ) }
                        { product.flavor && (
                            <DetailItem label="Rasa" value={ product.flavor }/>
                        ) }
                        { product.cottonSize && (
                            <DetailItem label="Ukuran Cotton" value={ product.cottonSize }/>
                        ) }
                        { product.batterySize && (
                            <DetailItem label="Ukuran Baterai" value={ product.batterySize }/>
                        ) }
                        { product.resistanceSize && (
                            <DetailItem label="Ukuran Resistansi" value={ product.resistanceSize }/>
                        ) }
                        { product.coilSize && (
                            <DetailItem label="Ukuran Coil" value={ product.coilSize }/>
                        ) }
                        <DetailItem label="Kategori" value={ product.category }/>
                        {/*<DetailItem label="Deskripsi" value={ product.description }/>*/ }
                        <DetailItem label="Total Terjual" value={ product.sold }/>
                        { product.expired && (
                            <DetailItem
                                label="Kadaluarsa"
                                value={ new Date(product.expired).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }) }
                            />
                        ) }
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs sm:text-base text-muted-foreground"> Deskripsi </span>
                        <span className="text-xs sm:text-base font-medium">{ product.description }</span>
                    </div>

                </div>
                <div className="flex items-end gap-2 justify-end">

                    { isAdd && <DialogClose asChild>
						<Button variant="outline"
								className="min-w-24"
								onClick={ onAdd }
						>
							Add <Plus className="size-4"/>
						</Button>
					</DialogClose>
                    }

                    { isDelete && <DialogClose asChild>
						<Button variant="outline"
								className="min-w-24"
								onClick={ async () => {
                                    if (confirm('Are you Sure to Delete ?')) {
                                        toastResponse({ response: await deleteProduct(product.id) })
                                    }
                                } }
						>
							Hapus <Trash2 className="h-3 w-3"/>
						</Button>
					</DialogClose>
                    }
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

export function ProductDetailDialogOnlyFetch(
    {
        productId,
        isOpen,
        setOpenAction,
        onAdd,
        isAdd = false,
        isDelete = false
    }: {
        productId?: number | null,
        onAdd?: () => void,
        isAdd?: boolean,
        isDelete?: boolean,
    } & ModalProps) {

    const { data: productResponse, isLoading, isError } = useQuery({
        queryKey: [ 'product', productId ],
        gcTime: 30 * 60 * 24,
        queryFn: () => getProductById(productId as number),
        enabled: !!productId, // only fetch if idProduct is truthy
    });

    if (!productResponse?.success || !productResponse.data || isLoading) {
        return <Dialog
            open={ isOpen }
            onOpenChange={ setOpenAction }
        >
            <DialogContent className="max-w-2xl sm:rounded-2xl shadow-lg">
                <DialogTitle>Produk dengan ID { productId }</DialogTitle>

                <h1 className="text-xl ">Produk tidak ditemukan.</h1>

            </DialogContent>
        </Dialog>

    }

    const product = productResponse.data

    return (
        <Dialog
            open={ isOpen }
            onOpenChange={ setOpenAction }
        >
            <DialogContent className="sm:max-w-2xl sm:rounded-2xl shadow-lg p-4 sm:p-6 ">
                <DialogTitle className="text-sm sm:text-2xl font-semibold w-64 sm:w-auto">{ product.name }</DialogTitle>
                {/*<DialogDescription className="mb-4 text-sm text-muted-foreground">*/ }
                {/*    Kategori: <span className="font-medium text-primary">{ product.category } </span>*/ }
                {/*</DialogDescription>*/ }

                <div className="space-y-6 overflow-y-scroll h-[60vh]">
                    <div className="">
                        <picture>
                            <img
                                src={ product.image }
                                alt={ product.name }
                                className="w-full h-56 sm:h-80 object-contain rounded-xl border bg-white"
                            />
                        </picture>
                    </div>

                    <div className="grid grid-cols-2 sm:gap-4 gap-2">

                        <DetailItem label="Harga" value={ `Rp ${ product.price.toLocaleString() }` }/>
                        <DetailItem label="Stok" value={ product.stock }/>
                        <DetailItem label="Minimum Stok" value={ product.minStock }/>
                        <DetailItem label="Tipe Produk" value={ product.type }/>

                        { product.brand && (
                            <DetailItem label="Merek" value={ product.brand }/>
                        ) }

                        { product.nicotineLevel && (
                            <DetailItem label="Level Nikotin" value={ product.nicotineLevel }/>
                        ) }
                        { product.flavor && (
                            <DetailItem label="Rasa" value={ product.flavor }/>
                        ) }
                        { product.cottonSize && (
                            <DetailItem label="Ukuran Cotton" value={ product.cottonSize }/>
                        ) }
                        { product.batterySize && (
                            <DetailItem label="Ukuran Baterai" value={ product.batterySize }/>
                        ) }
                        { product.resistanceSize && (
                            <DetailItem label="Ukuran Resistansi" value={ product.resistanceSize }/>
                        ) }
                        { product.coilSize && (
                            <DetailItem label="Ukuran Coil" value={ product.coilSize }/>
                        ) }
                        <DetailItem label="Kategori" value={ product.category }/>
                        {/*<DetailItem label="Deskripsi" value={ product.description }/>*/ }
                        <DetailItem label="Total Terjual" value={ product.sold }/>
                        { product.expired && (
                            <DetailItem
                                label="Kadaluarsa"
                                value={ new Date(product.expired).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }) }
                            />
                        ) }
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs sm:text-base text-muted-foreground"> Deskripsi </span>
                        <span className="text-xs sm:text-base font-medium">{ product.description }</span>
                    </div>

                </div>
                <div className="flex items-end gap-2 justify-end">

                    { isAdd && <DialogClose asChild>
						<Button variant="outline"
								className="min-w-24"
								onClick={ onAdd }
						>
							Add <Plus className="size-4"/>
						</Button>
					</DialogClose>
                    }

                    { isDelete && <DialogClose asChild>
						<Button variant="outline"
								className="min-w-24"
								onClick={ async () => {
                                    if (confirm('Are you Sure to Delete ?')) {
                                        toastResponse({ response: await deleteProduct(product.id) })
                                    }
                                } }
						>
							Hapus <Trash2 className="h-3 w-3"/>
						</Button>
					</DialogClose>
                    }
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