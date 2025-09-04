'use server'

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { Customer, Product, Sale, SalesItem } from "@/lib/validation";

export type CustomerComplete = Customer & {
    Sales: (Sale & {
        SaleItems: (SalesItem & {
            product: Product
        })[]
    })[]
};

export const getDataCustomer = async (customerId: string): Promise<CustomerComplete | null> => {
    if (!customerId) {
        logger.error("data : getDataCustomer");
        return null
    }

    const data = await prisma.customer.findUnique({
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
    logger.info("data : getDataCustomer");
    return data;
};
