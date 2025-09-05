import { getSessionUserPage } from '@/action/auth-action';
import { getProductPage } from '@/action/product-action';
import { ProductUserPage } from '@/app/user/home/product-user-page';
import { CartItem, ContextPage, SaleCustomers } from '@/interface/actionType';
import { STATUS_PREORDER } from '@/lib/constants';
import { getContextPage } from "@/lib/context-action";
import { prisma } from '@/lib/prisma';
import React from 'react';

export type ProductPending = {
    current: CartItem[];
    data?: SaleCustomers;
    isPending: boolean;
};
export default async function Page(context: ContextPage) {
    const shopId = await getContextPage(context, 'shopId')
    const session = await getSessionUserPage()
    // if (!session) {
    //     redirect('/login')
    // }

    const currentProductUser = async () => await prisma.sale.findFirst({
        orderBy: { date: "desc" },
        where: {
            statusTransaction: STATUS_PREORDER.PENDING,
            Customer: { name: session?.name, },
        },
        include: {
            Customer: true,
            SaleItems: {
                include: {
                    product: true
                }
            },

        }
    }).then((item): ProductPending => {
        // console.log('currentProduct ' + item)
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
            products={ await getProductPage(context, shopId ?? null) }
            productPending={ await currentProductUser() }
        />
    );
}



