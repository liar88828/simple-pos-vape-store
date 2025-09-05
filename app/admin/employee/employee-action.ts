'use server'
import { EmployeeFormData } from "@/app/admin/employee/employee-page";
import { Prettify } from "@/interface/generic";
import { ROLE_USER } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Shop, User } from "@/lib/validation";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export type EmployeesAll = (EmployeeProps & { Shop: Shop | null })
export const employeesAll = async (): Promise<EmployeesAll[]> => await prisma.user.findMany({
    include: { Shop: true },
    where: {
        role: { in: [ ROLE_USER.EMPLOYEE, ROLE_USER.ADMIN ], }
    }
})

export type GetEmployee = User & { Shop: Shop | null }

export async function getEmployee(userId: string): Promise<GetEmployee | null> {
    return prisma.user.findUnique({
        where: {
            id: userId,
            role: {
                in: [ ROLE_USER.EMPLOYEE, ROLE_USER.ADMIN, ]
            }
        },
        include: { Shop: true }
    })
}

export type EmployeeProps = Pick<User,
    "id" |
    "name" |
    "email" |
    // "password" |
    "role" |
    "phone" |
    "address" |
    "img" |
    "workIn_shopId" |
    'active' |
    "createdAt" |
    "updatedAt"
>

export type EmployeeForm = Prettify<Pick<User,
    "name" |
    "email" |
    // "password" |
    "role" |
    "phone" |
    "address" |
    "img" |
    "workIn_shopId" |
    'active'
> & { id?: string | undefined }>

export async function createEmployee(
    employeeForm: EmployeeFormData,
) {
    const employee = await prisma.user.create({
        data: {
            password: await bcrypt.hash(employeeForm.email, 10),
            name: employeeForm.name,
            email: employeeForm.email,
            role: employeeForm.role,
            phone: employeeForm.phone,
            address: employeeForm.address,
            img: employeeForm.img,
            active: false,
            workIn_shopId: employeeForm.workIn_shopId
        },
    })
    // revalidatePath('/admin/employee')
    revalidatePath('/')
    return employee
}

export async function updateEmployee(
    id: string,
    employeeForm: EmployeeFormData
) {
    const employee = await prisma.user.update({
        where: { id },
        data: {
            ...(employeeForm.name && { name: employeeForm.name }),
            ...(employeeForm.email && { email: employeeForm.email }),
            ...(employeeForm.role && { role: employeeForm.role }),
            ...(employeeForm.phone && { phone: employeeForm.phone }),
            ...(employeeForm.address && { address: employeeForm.address }),
            ...(employeeForm.img && { img: employeeForm.img }),
            ...(employeeForm.workIn_shopId && { workIn_shopId: employeeForm.workIn_shopId }),
        },
    })
    revalidatePath('/')
    return employee
}

export const getShopAllApi = async () => {
    const response = await fetch(
        `${ process.env.CURRENT_HOST }/api/shop`, {
            method: "GET",
            cache: "force-cache",
            next: {
                revalidate: 60,
                tags: [ 'shop' ]
            }
        })
    // Pastikan respons berhasil (response.ok)
    if (!response.ok) {
        return {
            data: [],
            message: 'Server error'
        }
    }

    try {
        const body: { data: Shop[] } = await response.json();

        // console.log(body);
        return {
            data: body.data,
            message: "Success get data"
        };
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        return {
            data: [],
            message: 'Failed to parse data'
        };
    }
}
export const getShopAll = async (): Promise<Shop[]> => {
    return prisma.shop.findMany()
}
