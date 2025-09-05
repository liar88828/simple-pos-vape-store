import { getSessionEmployeePage } from "@/action/auth-action";
import { getEmployee } from "@/app/admin/employee/employee-action";
import EmployeeDetail from "@/app/admin/employee/employee-detail";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from 'react';

export default async function Page() {
    const session = await getSessionEmployeePage()
    const employee = await getEmployee(session.userId)
    if (!employee || !employee.workIn_shopId) {
        redirect('/admin/employee')
    }
    console.log("employee", employee)

    const products = await prisma.product.findMany({
        take: 100,
        where: { PreOrders: { every: { sellIn_shopId: employee.workIn_shopId } } }
    })

    return <EmployeeDetail employee={ employee }
                           products={ products }/>
}

