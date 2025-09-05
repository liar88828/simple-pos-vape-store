'use server'
import { createCustomer } from "@/action/customer-action";
import type { ActionResponse } from "@/interface/actionType";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { CustomerModelType } from "@/lib/schema";
import { Customer, CustomerSchema, Sale } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export type CustomerRelational = Customer & {
    Sales: Sale[]
    // PreOrders: (PreOrder & { product: Product })[]
}

export async function getAllCustomerRelational(): Promise<CustomerRelational[]> {
    logger.info("data : getAllCustomerRelational");
    const customer = await prisma.customer.findMany({
        include: {
            Sales: true,
            // PreOrders: {
            //     include: {
            //         product: true
            //     }
            // },
        }
    })

    return customer
}

export async function createCustomerAction(formData: CustomerModelType): Promise<ActionResponse> {
    try {

        const { data, success, error } = CustomerSchema.safeParse(formData);
        if (!success) {
            return {
                data: data,
                message: "Pelanggan gagal ditambahkan",
                error: error.flatten().fieldErrors,
                success: false,
            };
        }

        const createCustomerData = await createCustomer(data.name)

        revalidatePath("/"); // Refresh halaman agar data baru tampil
        logger.info("success createCustomerAction", data.id);
        return {
            data: data,
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    } catch (error) {
        // console.log(error);
        logger.error("error createCustomerAction", error);
        return {
            success: true,
            message: "Pelanggan berhasil ditambahkan",
        };
    }

}

export async function getAllCustomers(name: string = ''): Promise<Customer[]> {
    'use cache'
    const data = await prisma.customer.findMany({
        where: { name: { contains: name } },
        orderBy: { updatedAt: 'desc' },
        take: 20,
    });
    logger.info("data : getAllCustomers");
    return data
}

export async function updateCustomerAction(formData: Customer): Promise<ActionResponse> {
    try {

        const valid = CustomerSchema.safeParse(formData);
        const customerFound = await prisma.customer.findUnique({
            where: { id: formData.id },
            select: { id: true },
        });

        if (!customerFound) {
            logger.error(`error DB customer customer not found by id ${ formData.id }`);
            return {
                data: valid.data,
                success: true,
                message: "Pelanggan tidak ditemukan",
            };
        }

        if (!valid.success) {
            const validationError = valid.error.flatten().fieldErrors
            logger.error("error validation updateCustomerAction ", validationError);
            return {
                data: valid.data,
                message: "Pelanggan gagal diperbarui",
                error: validationError,
                success: false,
            };
        }

        const { id, ...rest } = valid.data;

        await prisma.customer.update({
            where: { id },
            data: rest,
        });

        revalidatePath("/");
        logger.info("success updateCustomerAction", id);
        return {
            data: valid.data,
            success: true,
            message: "Pelanggan berhasil diperbarui",
        };
    } catch (error) {
        logger.error("error catch : updateCustomerAction", error);
        return {
            success: false,
            message: "Something went wrong : updateCustomerAction",
        }
    }
}

export async function deleteCustomerAction(id: Customer['id']): Promise<ActionResponse> {
    try {
        const customerFound = await prisma.customer.findUnique({ where: { id } });
        if (!customerFound) {
            logger.error(`error DB deleteCustomerAction `, id);
            return {
                success: false,
                message: "Pelanggan tidak ditemukan",
            };
        }

        await prisma.customer.delete({ where: { id } });

        revalidatePath("/");
        logger.info("success : deleteCustomerAction");
        return {
            success: true,
            message: "Pelanggan berhasil dihapus",
        };

    } catch (error) {
        logger.error("error catch : deleteCustomerAction", error);
        return {
            success: false,
            message: "Something went wrong : deleteCustomerAction",
        }
    }

}
