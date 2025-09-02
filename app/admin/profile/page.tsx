import { getDataCustomer } from "@/app/admin/profile/profile-action";
import { DataNotFound } from "@/components/mini/empty-data";
import UserProfilePage from "@/app/admin/profile/user-profile-page";
import { logger } from "@/lib/logger";
import React from 'react';

async function Page() {
    const customerData = await getDataCustomer(1)
    logger.info("page : profile");

    if (!customerData) {
        logger.error("page error: profile");
        return <DataNotFound message={ 'Data is Empty' }/>
    }

    return <UserProfilePage customer={ customerData }/>
}

export default Page;