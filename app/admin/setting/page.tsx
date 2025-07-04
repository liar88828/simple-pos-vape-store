import { getSettingInventory, getSettingPayment, getSettingShipping, getStoreLoader } from "@/action/setting-action";
import SettingPage from "@/app/admin/setting/setting-page";
import React from 'react';

async function Page() {
    return (<SettingPage store={ await getStoreLoader() }
                         payment={ await getSettingPayment() }
                         inventory={ await getSettingInventory() }
                         shipping={ await getSettingShipping() }
    />);
}

export default Page;