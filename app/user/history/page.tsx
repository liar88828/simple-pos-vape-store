
import { getSessionUser } from '@/action/auth-action';
import { HistoriesPage } from '@/components/histories-page';
import { ContextPage, SaleCustomers } from '@/interface/actionType';
import { prisma } from '@/lib/prisma';
import React from 'react';

export default async function Page(context: ContextPage) {
    const session = await getSessionUser()
    // const customers = await prisma.customer.findMany({ where: { name: session?.name } })
    console.log('session is :' + session)

    const histories: SaleCustomers[] = await prisma.sale.findMany({
        orderBy: { date: "desc" },
        where: {
            customer: {
                name: session?.name
            }
        },
        include: {
            customer: true,
            SaleItems: {
                include: {
                    product: true
                }
            },

        }
    })

    return (
        <HistoriesPage histories={histories} />
    );
}



