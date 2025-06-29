import React from 'react';
import SettingPage from "@/app/setting/setting-page";
import { getSettingInventory, getSettingPayment, getSettingShipping, getStoreLoader } from "@/action/setting-action";

async function Page() {
    return (<SettingPage store={ await getStoreLoader() }
                         payment={ await getSettingPayment() }
                         inventory={ await getSettingInventory() }
                         shipping={ await getSettingShipping() }
    />);
}

export default Page;