
import { getSessionUser } from '@/action/auth-action';
import { getProduct } from '@/action/product-action';
import { getContextPage } from '@/components/context-action';
import { ProductUserPage } from '@/components/product-user-page';
import { CartItem, ContextPage, SaleCustomers } from '@/interface/actionType';
import { prisma } from '@/lib/prisma';
import React from 'react';
import { STATUS_TRANSACTION } from '@/lib/constants';
import { redirect } from 'next/navigation';

export type ProductPending = {
    current: CartItem[];
    data?: SaleCustomers;
    isPending: boolean;
};
export default async function Page(context: ContextPage) {
    const session = await getSessionUser()
    if (!session) {
        redirect('/login')
    }
    const nameProduct = await getContextPage(context, 'productName')


    // const session = await getSessionUser()
    // const customers = await prisma.customer.findFirst({ where: { name: session?.name } })

    const currentProductUser = await prisma.sale.findFirst({
        orderBy: { date: "desc" },
        where: {
            statusTransaction: STATUS_TRANSACTION.PENDING,
            customer: { name: session?.name, },
        },
        include: {
            customer: true,
            SaleItems: {
                include: {
                    product: true
                }
            },

        }
    }).then((item): ProductPending => {
        console.log('currentProduct ' + item)
        if (item) {
            return {
                current: item.SaleItems.map(i => ({ ...i.product, quantity: i.quantity })),
                data: item,
                isPending: true
            }
        }
        return {
            current: [],
            isPending: false
        }
    })



    return (

        <ProductUserPage
            session={session}
            products={await getProduct(nameProduct)}
            productPending={currentProductUser}
        />
    );
}



