import { getSessionUserPage } from '@/action/auth-action';
import { getProduct } from '@/action/product-action';
import { ProductUserPage } from '@/app/user/home/product-user-page';
import { currentProductUser } from "@/app/user/user-action";
import { CartItem, ContextPage, SaleCustomers } from '@/interface/actionType';
import { getContextPage } from "@/lib/context-action";
import { prisma } from "@/lib/prisma";
import React from 'react';

export type ProductPending = {
    current: CartItem[];
    data?: SaleCustomers;
    isPending: boolean;
};
export default async function Page(context: ContextPage) {
    let shopId = await getContextPage(context, 'shopId')
    const session = await getSessionUserPage()
    const shop = await prisma.market.findFirst({ where: { id: shopId }, select: { id: true } });
    shopId = shop?.id
    return (
        <ProductUserPage
            marketIdProps={ shopId }
            markets={ await prisma.market.findMany() }
            session={session}
            products={ await getProduct(context, shopId) }
            productPending={ await currentProductUser(session) }
        />
    );
}



