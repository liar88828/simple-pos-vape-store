'use server'
import { getSessionEmployeePage } from "@/action/auth-action";
import { EmployeeFormData } from "@/app/admin/employee/employee-page";
import { Prettify } from "@/interface/generic";
import { statusAbsent } from "@/lib/helper";
import { prisma } from "@/lib/prisma";
import { Market, User } from "@/lib/validation";
import { ROLE_USER } from "@prisma/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export type EmployeesAll = (EmployeeProps & { Market: Market | null })
export const employeesAll = async (): Promise<EmployeesAll[]> => await prisma.user.findMany({
    include: { Market: true },
    where: {
        role: { in: [ ROLE_USER.EMPLOYEE, ROLE_USER.ADMIN ], }
    }
})

export type GetEmployee = User & { Market: Market | null }

export async function getEmployee(userId: string): Promise<GetEmployee | null> {
    return prisma.user.findUnique({
        where: {
            id: userId,
            role: {
                in: [ ROLE_USER.EMPLOYEE, ROLE_USER.ADMIN, ]
            }
        },
        include: { Market: true }
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
    "marketId_workIn" |
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
    "marketId_workIn" |
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
            marketId_workIn: employeeForm.sellIn_marketId
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
            marketId_workIn: employeeForm.sellIn_marketId,
            ...(employeeForm.name && { name: employeeForm.name }),
            ...(employeeForm.email && { email: employeeForm.email }),
            ...(employeeForm.role && { role: employeeForm.role }),
            ...(employeeForm.phone && { phone: employeeForm.phone }),
            ...(employeeForm.address && { address: employeeForm.address }),
            ...(employeeForm.img && { img: employeeForm.img }),

        },
    })
    revalidatePath('/')
    return employee
}

export const _getShopAllApi = async () => {
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
        const body: { data: Market[] } = await response.json();

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
export const getShopAll = async (): Promise<Market[]> => {
    return prisma.market.findMany()
}

export const handlerAbsent = async () => {
    try {

        const session = await getSessionEmployeePage()
        const currentDate = new Date()

        // Get today's start and end time (00:00:00 - 23:59:59)
        const startOfDay = new Date(currentDate)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(currentDate)
        endOfDay.setHours(23, 59, 59, 999)

        // Check if user already has absent today
        const existingAbsent = await prisma.absent.findFirst({
            where: {
                userId: session.userId,
                datetime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        })

        if (existingAbsent) {
            throw new Error("You have already submitted absent today.")
        }

        // Example: shift is 2 for now, adjust if dynamic
        const shift2 = "2"
        const statusAbsentData = shift2
            ? statusAbsent("09:00", "10:00")
            : statusAbsent("15:00", "21:00")

        const absent = await prisma.absent.create({
            data: {
                sold: 0,
                datetime: currentDate,
                revenue: 0,
                userId: session.userId,
                status_absent: statusAbsentData,
            },
        })

        revalidatePath("/")
        return absent

    } catch (error: unknown) {
        if (error instanceof Error) {
            throw error.message
        }
        throw 'Something went wrong'
    }

}