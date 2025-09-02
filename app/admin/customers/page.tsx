import { getAllCustomerRelational } from "@/app/admin/customers/customers-action";
import { CustomersPage } from "@/app/admin/customers/customers-page"
import { logger } from "@/lib/logger";

export default async function Customers() {
    const data = await getAllCustomerRelational()
    // const bronze = data.filter(item => item.totalPurchase < 1_000_000);
    // const silver = data.filter(item => item.totalPurchase >= 1_000_000 && item.totalPurchase <= 5_000_000);
    // const gold = data.filter(item => item.totalPurchase > 5_000_000);
    // const total = data.length;
    //
    logger.info("page : Customers");
    return <CustomersPage customers={ data }
        // members={ exampleMemberTierData }
    />
}
