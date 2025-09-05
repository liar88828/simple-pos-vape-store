import { getSessionEmployeePage } from "@/action/auth-action";
import { HistoriesPage } from "@/app/user/history/histories-page";
import { getHistoriesEmployee } from "@/app/user/user-action";
import React from 'react';

export default async function Page() {
    const session = await getSessionEmployeePage()

    return (
        <HistoriesPage
            title={ 'Inbox Product' }
            histories={ await getHistoriesEmployee(session) }/>
    );
}

