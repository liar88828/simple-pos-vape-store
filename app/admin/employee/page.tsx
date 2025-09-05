import { employeesAll } from "@/app/admin/employee/employee-action";
import EmployeePage from "@/app/admin/employee/employee-page";
import { prisma } from "@/lib/prisma";
import React from 'react';

export default async function Page() {
    return (
        <EmployeePage employees={ await employeesAll() }/>
    );
}

