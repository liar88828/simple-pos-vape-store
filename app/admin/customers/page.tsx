import { getAllCustomerRelational } from "@/action/customer-action";
import { CustomersPage } from "@/components/page/customers-page"
import { logger } from "@/lib/logger";

export default async function Customers() {
    logger.info("page : Customers");
    const data = await getAllCustomerRelational()
    // const bronze = data.filter(item => item.totalPurchase < 1_000_000);
    // const silver = data.filter(item => item.totalPurchase >= 1_000_000 && item.totalPurchase <= 5_000_000);
    // const gold = data.filter(item => item.totalPurchase > 5_000_000);
    // const total = data.length;
    //
    return <CustomersPage customers={ data }
        // members={ exampleMemberTierData }
    />
}
