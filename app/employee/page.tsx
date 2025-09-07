import { getSessionEmployeePage } from "@/action/auth-action";
import { getEmployee } from "@/app/admin/employee/employee-action";
import EmployeeDetail from "@/app/admin/employee/employee-detail";
import { absent, getTodayAbsent, products } from "@/app/employee/employee-action";
import { redirect } from "next/navigation";
import React from 'react';

export default async function Page() {
    const session = await getSessionEmployeePage()
    const employee = await getEmployee(session.userId)
    if (!employee || !employee.marketId_workIn) {
        redirect('/admin/employee')
    }

    return <EmployeeDetail
        todayAbsent={ (await getTodayAbsent(session.userId)).length }
        absent={ await absent(session.userId) }
        employee={ employee }
        products={ await products(employee.marketId_workIn) }/>
}

