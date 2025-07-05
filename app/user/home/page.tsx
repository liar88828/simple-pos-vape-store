import { getSessionUser } from '@/action/auth-action';
import { getProduct } from '@/action/product-action';
import { getContextPage } from '@/components/context-action';
import { ProductUserPage } from '@/components/product-user-page';
import { CartItem, ContextPage, SaleCustomers } from '@/interface/actionType';
import { STATUS_TRANSACTION } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import React from 'react';

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

    const currentProductUser = async () => await prisma.sale.findFirst({
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
            products={
                await getProduct({
                    productName: await getContextPage(context, 'productName'),
                    productBrand: await getContextPage(context, 'productBrand'),
                    productCategory: await getContextPage(context, 'productCategory'),
                    productTypeDevice: await getContextPage(context, 'productTypeDevice'),
                    productNicotine: await getContextPage(context, 'productNicotine'),
                    productResistant: await getContextPage(context, 'productResistant'),
                    productCoil: await getContextPage(context, 'productCoil'),
                    productBattery: await getContextPage(context, 'productBattery'),
                    productCotton: await getContextPage(context, 'productCotton'),
                    productLimit: await getContextPage(context, 'productLimit'),
                    productPage: await getContextPage(context, 'productPage')
                }) }
            productPending={ await currentProductUser() }
        />
    );
}



