import { getDataCustomer } from "@/action/customer-action";
import { DataNotFound } from "@/components/empty-data";
import UserProfilePage from "@/components/user-profile-page";
import React from 'react';

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