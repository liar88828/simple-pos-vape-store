import { ProductModelType } from "@/lib/schema";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Trash2 } from "lucide-react";
import React from "react";
import { toastResponse } from "@/lib/my-utils";
import { deleteProduct } from "@/action/product-action";
import { ModalProps } from "@/interface/actionType";
import { Product } from "@/lib/generated/zod_gen";

export function ProductDetailDialogOnly({ product, isOpen, setOpenAction, onAdd, isAdd = false, isDelete = false }: {
    product: Product | null,
    onAdd?: () => void,
    isAdd?: boolean,
    isDelete?: boolean,
} & ModalProps) {

    if (!product) {
        return
    }

    function DetailItem({ label, value }: { label: string; value: string | number }) {
        return (
            <div className="flex flex-col">
                <span className="text-muted-foreground">{ label }</span>
                <span className="font-medium">{ value }</span>
            </div>
        );
    }

    return (
        <Dialog
            open={ isOpen }
            onOpenChange={ setOpenAction }
        >
            <DialogContent className="max-w-2xl sm:rounded-2xl shadow-lg">
                <DialogTitle className="text-2xl font-semibold">{ product.name }</DialogTitle>
                <DialogDescription className="mb-4 text-sm text-muted-foreground">
                    Kategori: <span className="font-medium text-primary">{ product.category }</span>
                </DialogDescription>

                <div className="space-y-6">
                    <div className="">
                        <picture>
                            <img
                                src={ product.image }
                                alt={ product.name }
                                className="w-full h-80 object-contain rounded-xl border bg-white"
                            />
                        </picture>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <DetailItem label="Harga" value={ `Rp ${ product.price.toLocaleString() }` }/>
                        <DetailItem label="Stok" value={ product.stock }/>
                        <DetailItem label="Minimum Stok" value={ product.minStock }/>
                        <DetailItem label="Tipe Produk" value={ product.type }/>
                        { product.nicotineLevel && (
                            <DetailItem label="Level Nikotin" value={ product.nicotineLevel }/>
                        ) }
                        { product.flavor && (
                            <DetailItem label="Rasa" value={ product.flavor }/>
                        ) }
                    </div>

                    <div>
                        <h4 className="font-medium text-base mb-1">Deskripsi</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ product.description }</p>
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

export function ProductDetailDialog_({ product }: { product: ProductModelType }) {

    function DetailItem({ label, value }: { label: string; value: string | number }) {
        return (
            <div className="flex flex-col">
                <span className="text-muted-foreground">{ label }</span>
                <span className="font-medium">{ value }</span>
            </div>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl sm:rounded-2xl shadow-lg">
                <DialogTitle className="text-2xl font-semibold">{ product.name }</DialogTitle>
                <DialogDescription className="mb-4 text-sm text-muted-foreground">
                    Kategori: <span className="font-medium text-primary">{ product.category }</span>
                </DialogDescription>

                <div className="space-y-6">
                    <div className="">
                        <picture>
                            <img
                                src={ product.image }
                                alt={ product.name }
                                className="w-full h-80 object-contain rounded-xl border bg-white"
                            />
                        </picture>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <DetailItem label="Harga" value={ `Rp ${ product.price.toLocaleString() }` }/>
                        <DetailItem label="Stok" value={ product.stock }/>
                        <DetailItem label="Minimum Stok" value={ product.minStock }/>
                        <DetailItem label="Tipe Produk" value={ product.type }/>
                        { product.nicotineLevel && (
                            <DetailItem label="Level Nikotin" value={ product.nicotineLevel }/>
                        ) }
                        { product.flavor && (
                            <DetailItem label="Rasa" value={ product.flavor }/>
                        ) }
                    </div>

                    <div>
                        <h4 className="font-medium text-base mb-1">Deskripsi</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ product.description }</p>
                    </div>
                </div>
                <div className="flex items-end gap-2 justify-end">

                    <DialogClose asChild>
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