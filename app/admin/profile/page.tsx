import { getDataCustomer } from "@/app/admin/profile/profile-action";
import UserProfilePage from "@/app/admin/profile/user-profile-page";
import { DataNotFound } from "@/components/mini/empty-data";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import React from 'react';

async function Page() {
    const exampleFirst = await prisma.customer.findFirst()
    if (!exampleFirst) {
        return <div>
            Customer Not found....
        </div>
    }
    const customerData = await getDataCustomer(exampleFirst.id)
    logger.info("page : profile");

    if (!customerData) {
        logger.error("page error: profile");
        return <DataNotFound message={ 'Data is Empty' }/>
    }

    return <UserProfilePage customer={ customerData }/>
}

export default Page;