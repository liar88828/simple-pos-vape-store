import { getSessionEmployeePage } from "@/action/auth-action";
import StockDialog from "@/app/employee/stock/stock-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/formatter";
import { prisma } from "@/lib/prisma";
import Form from "next/form";
import React from 'react';

export default async function Page({ searchParams }: PageProps<'/employee/stock'>) {
    const session = await getSessionEmployeePage();

    const { nameProduct = undefined } = await searchParams as { [key: string]: string | undefined }
    // console.log(nameProduct);

    const products = await prisma.product.findMany({
        where: {
            PreOrders: { some: { quantity: { not: 0 } } },
            name: { contains: nameProduct }
        },
        include: { PreOrders: { include: { Market: true } } }
    })

    // async function handlerOrderIn(form: FormData) {
    //     'use server'
    //     const session = await getSessionEmployeePage()
    //
    //     const { data, error } = z.object({
    //         quantity: z.string(),
    //         idProduct: z.string(),
    //         idPreorder: z.string(),
    //     })
    //     .transform(data => ({
    //         quantity: Number(data.quantity),
    //         idProduct: data.idProduct,
    //         idPreorder: data.idPreorder
    //     }))
    //     .safeParse({
    //         quantity: form.get('quantity'),
    //         idProduct: form.get('idProduct'),
    //         idPreorder: form.get('idPreorder')
    //     })
    //
    //     console.log(data, error);
    //
    //     if (error) {
    //         return
    //     }
    //
    //     await prisma.$transaction(async (tx) => {
    //         const { id, userId, quantity, sellIn_shopId, ...preOrderDB } = await tx.preOrder.update({
    //             where: { id: data.idPreorder },
    //             data: { quantity: { decrement: data.quantity } }
    //         })
    //
    //         const preOrderDB1 = await tx.preOrder.create({
    //             data: {
    //                 ...preOrderDB,
    //                 quantity: data.quantity,
    //                 userId: session.userId,
    //                 sellIn_shopId: session.shopId
    //             }
    //         })
    //         revalidatePath('/')
    //     })
    // }

    return (
        <div className="p-4 space-y-4">
            <Form action="/employee/stock" className={ 'flex items-center justify-center gap-4' }>
                <Input type="search" placeholder="Search..." name={ 'nameProduct' } defaultValue={ nameProduct ?? '' }/>
                <Button type={ 'submit' }>Search</Button>
            </Form>

            <div className="flex flex-col gap-4">
                { products.map((product, index) => (
                    <Card key={ product.id } className="p-4">
                        <div className="flex items-center gap-4">
                            {/* Product image */ }
                            <div className="w-24 h-24 rounded-md bg-gray-200 overflow-hidden flex-shrink-0">
                                <img
                                    src={ product.image ?? "/placeholder.svg" }
                                    alt={ product.name }
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <CardHeader className="flex-1 p-0">
                                <CardTitle>{ product.name }</CardTitle>
                                <CardDescription>{ product.description }</CardDescription>
                            </CardHeader>


                            {/* Product details */ }
                            <CardContent className="flex-1 p-0">
                                <p className="text-sm font-medium mt-1">Stock: { product.stock }</p>
                                <p className="text-sm font-bold text-primary mt-1">{ formatRupiah(product.price) }</p>
                                <div className="flex flex-wrap gap-1">
                                    { product.PreOrders.map(i => (
                                        <Badge key={ i.id }>{ i.Market.name }</Badge>)) }
                                </div>

                            </CardContent>
                            <CardFooter className="flex-1 p-0">
                                <StockDialog product={ product } session={ session }/>
                            </CardFooter>
                        </div>
                    </Card>
                )) }
            </div>

        </div>
    );
}

