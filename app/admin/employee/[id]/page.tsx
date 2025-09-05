import { getEmployee } from "@/app/admin/employee/employee-action";
import EmployeeDetail from "@/app/admin/employee/employee-detail";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EmployeePage(context: PageProps<'/admin/employee/[id]'>) {
    const employee = await getEmployee((await context.params).id)
    console.log("employee", employee)
    if (!employee || !employee.workIn_shopId) {
        redirect('/admin/employee')
    }

    const products = await prisma.product.findMany({
        take: 100,
        where: { PreOrders: { every: { sellIn_shopId: employee.workIn_shopId } } }
    })

    return (
        <EmployeeDetail employee={ employee } products={ products }/>
    );
}



