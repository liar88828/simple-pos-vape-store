import { getDataCustomer } from "@/action/customer-action";
import { DataNotFound } from "@/components/empty-data";
import UserProfilePage from "@/components/user-profile-page";
import { logger } from "@/lib/logger";
import React from 'react';

async function Page() {
    logger.info("page : profile");
    const customerData = await getDataCustomer(1)

    if (!customerData) {
        logger.error("page error: profile");
        return <DataNotFound message={ 'Data is Empty' }/>
    }

    return <UserProfilePage customer={ customerData }/>
}

export default Page;