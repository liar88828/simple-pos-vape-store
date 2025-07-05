import { getSessionUser } from '@/action/auth-action';
import { getHistories } from "@/action/sale-action";
import { HistoriesPage } from '@/components/histories-page';
import { ContextPage } from '@/interface/actionType';
import { redirect } from "next/navigation";
import React from 'react';

export default async function Page(context: ContextPage) {
    const session = await getSessionUser()
    // const customers = await prisma.customer.findMany({ where: { name: session?.name } })

    // console.log('session is :' + session)
    if (!session) {
        redirect('/login')
    }

    return (
        <HistoriesPage histories={ await getHistories(session) }/>
    );
}



