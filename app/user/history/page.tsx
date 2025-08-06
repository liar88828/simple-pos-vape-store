import { getSessionUserPage } from '@/action/auth-action';
import { getHistories } from "@/action/sale-action";
import { HistoriesPage } from '@/components/page/histories-page';
import { ContextPage } from '@/interface/actionType';
import React from 'react';

export default async function Page(context: ContextPage) {
    const session = await getSessionUserPage()
    // const customers = await prisma.customer.findMany({ where: { name: session?.name } })

    // console.log('session is :' + session)
    // if (!session) {
    //     redirect('/login')
    // }

    return (
        <HistoriesPage histories={ await getHistories(session) }/>
    );
}



