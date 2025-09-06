'use client'
import { ProductPreorderShop } from "@/action/product-action";
import { handlerOrderIn } from "@/app/employee/stock/stock-action";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionEmployeePayload } from "@/interface/actionType";
import Form from "next/form";
import React from 'react';
import { toast } from "sonner";

export default function StockDialog({ product, session }: {
    product: ProductPreorderShop,
    session: SessionEmployeePayload
}) {

    async function action(form: FormData) {
        toast.promise(
            async () => handlerOrderIn(form),
            {
                loading: 'Loading...',
                success: (data => data),
                error: (data => data.message),
            }
        );

    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Order In</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Order In</DialogTitle>
                    <DialogDescription>
                        Please fill in the details for the new order.
                    </DialogDescription>
                </DialogHeader>

                <Form action={ action } className={ 'space-y-4' }>
                    <input name="idProduct" type="hidden" value={ product.id }/>

                    <div className="grid gap-2">
                        <Label htmlFor="quantity" className="text-sm font-medium">
                            Quantity
                        </Label>
                        <Input name="quantity"
                               type="number" placeholder="Enter quantity..."/>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="idPreorder" className="text-sm font-medium">
                            Market
                        </Label>
                        <Select name="idPreorder">
                            <SelectTrigger id="idPreorder" className="w-full">
                                <SelectValue placeholder="Select Market"/>
                            </SelectTrigger>
                            <SelectContent>
                                { product.PreOrders.map((i) => {
                                    if (session.shopId === i.Shop.id) {
                                        return null
                                    }
                                    return (
                                        <SelectItem key={ i.id } value={ String(i.id) }>
                                            { i.Shop.name } : { i.quantity }
                                        </SelectItem>
                                    )
                                }) }
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" type={ 'button' }>Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Order In</Button>
                    </DialogFooter>
                </Form>

            </DialogContent>
        </Dialog>
    )
}

