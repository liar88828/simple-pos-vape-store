import React from 'react';
import UserProfilePage from "@/components/user-profile-page";
import { getDataCustomer } from "@/action/customer-action";
import { DataNotFound, EmptyDataPage } from "@/components/empty-data";

async function Page() {
    const customerData = await getDataCustomer(1)
    // console.log(customerData)
    if (!customerData) {
        return <DataNotFound message={ 'Data is Empty' }/>

    }
    return (
        <UserProfilePage customer={ customerData }/>
    );
}

export default Page;