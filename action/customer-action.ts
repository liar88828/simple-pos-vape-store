'use server'
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CustomerModel } from "@/lib/generated/zod";
import { ActionResponse } from "@/interface/actionType";
import { CustomerModelComplete, CustomerModelNew, CustomerModelType } from "@/lib/schema";
import { Customer, PreOrder, Product, Sale, SalesItem } from "@/lib/generated/zod_gen";

// Create a new customer
export async function createCustomerNew(formData: CustomerModelType): Promise<ActionResponse<Customer>> {
    try {

        const valid = CustomerModelNew.safeParse(formData);
        if (!valid.success) {
            return {
                data: valid.data,
                message: "Pelanggan gagal ditambahkan",
                error: valid.error.flatten().fieldErrors,
                success: false,
            };
        }
        const customer = await prisma.customer.create({
            data: {
                status: "pending",
                age: 0,
                lastPurchase: new Date(),
                name: valid.data.name,
                totalPurchase: 0,
            }
        });

        revalidatePath("/"); // Refresh halaman agar data baru tampil

        return {
            data: customer,
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    } catch (error) {
        console.log(error);
        return {
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    }

}

export async function createCustomer(formData: CustomerModelType): Promise<ActionResponse> {
    try {

        const valid = CustomerModel.safeParse(formData);
        if (!valid.success) {
            return {
                data: valid.data,
                message: "Pelanggan gagal ditambahkan",
                error: valid.error.flatten().fieldErrors,
                success: false,
            };
        }
        const { id, ...rest } = valid.data
        await prisma.customer.create({
            data: rest
        });

        revalidatePath("/"); // Refresh halaman agar data baru tampil

        return {
            data: valid.data,
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    } catch (error) {
        console.log(error);
        return {
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    }

}

export async function getAllCustomers(name: string = ''): Promise<Customer[]> {
    return prisma.customer.findMany({
        where: { name: { contains: name } },
        orderBy: { updatedAt: 'desc' },
        take: 20,
    });
}

export type CustomerRelational = Customer & {
    Sales: Sale[]
    PreOrders: (PreOrder & { product: Product })[]
}

export async function getAllCustomerRelational(): Promise<CustomerRelational[]> {
    return prisma.customer.findMany({
        include: {
            Sales: true,
            PreOrders: {
                include: {
                    product: true
                }
            },
        }
    })
}

export async function getCustomerById(id: Customer['id']): Promise<Customer | null> {
    return prisma.customer.findUnique({ where: { id } });
}

export async function updateCustomer(formData: CustomerModelComplete): Promise<ActionResponse> {
    const valid = CustomerModel.safeParse(formData);

    const customerFound = await prisma.customer.findUnique({
        where: { id: formData.id },
        select: { id: true },
    });

    if (!customerFound) {
        return {
            data: valid.data,
            success: true,
            message: "Pelanggan tidak ditemukan",
        };
    }

    if (!valid.success) {
        return {
            data: valid.data,
            message: "Pelanggan gagal diperbarui",
            error: valid.error.flatten().fieldErrors,
            success: false,
        };
    }

    const { id, ...rest } = valid.data;

    await prisma.customer.update({
        where: { id },
        data: rest,
    });

    revalidatePath("/");
    return {
        data: valid.data,
        success: true,
        message: "Pelanggan berhasil diperbarui",
    };
}

export async function deleteCustomer(id: Customer['id']): Promise<ActionResponse> {
    const customerFound = await prisma.customer.findUnique({ where: { id } });

    if (!customerFound) {
        return {
            success: false,
            message: "Pelanggan tidak ditemukan",
        };
    }

    await prisma.customer.delete({ where: { id } });

    revalidatePath("/");
    return {
        success: true,
        message: "Pelanggan berhasil dihapus",
    };
}

export type CustomerComplete = Customer & {
    Sales: (Sale & {
        SaleItems: (SalesItem & {
            product: Product
        })[]
    })[]
};
export const getDataCustomer = async (customerId: number): Promise<CustomerComplete | null> => {
    if (!customerId) {
        return null
    }

    return prisma.customer.findUnique({
        where: { id: customerId },
        include: {
            Sales: {
                include: {
                    SaleItems: {
                        include: {
                            product: true,
                        },
                    },
                },
                orderBy: { date: 'desc' },
            },
        },
    });
};
