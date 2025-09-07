import { getSessionUserPage } from '@/action/auth-action';
import { HistoriesPage } from '@/app/user/history/histories-page';
import { getHistoriesUser } from "@/app/user/user-action";
import { ContextPage } from '@/interface/actionType';
import React from 'react';

export default async function Page(context: ContextPage) {
    const session = await getSessionUserPage()
    return (
        <HistoriesPage
            session={session}
            title={ 'History Pembelian' }
            histories={ await getHistoriesUser(session) }/>
    );
}



