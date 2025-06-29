import { CustomersPage } from "@/components/customers-page"
import { MemberTier } from "@/lib/data";
import { getAllCustomerRelational } from "@/action/customer-action";

export default async function Customers() {
    const data = await getAllCustomerRelational()
    const bronze = data.filter(item => item.totalPurchase < 1_000_000);
    const silver = data.filter(item => item.totalPurchase >= 1_000_000 && item.totalPurchase <= 5_000_000);
    const gold = data.filter(item => item.totalPurchase > 5_000_000);
    const total = data.length;
    const exampleMemberTierData: MemberTier[] = [
        {
            name: "Member Bronze",
            range: "Pembelian < Rp 1.000.000",
            count: bronze.length,
            // progress: Math.round((bronze.length / total) * 100),
            progress: bronze.length / total,
        },
        {
            name: "Member Silver",
            range: "Pembelian Rp 1.000.000 - 5.000.000",
            count: silver.length,
            progress: silver.length / total,
        },
        {
            name: "Member Gold",
            range: "Pembelian > Rp 5.000.000",
            count: gold.length,
            progress: gold.length / total,
        },
    ];

    return <CustomersPage customers={ data }
                          members={ exampleMemberTierData }
    />
}
