'use server'
import { SaleCustomers, SessionPayload } from "@/interface/actionType";
import { prisma } from "@/lib/prisma";

export const getHistories = async (session: SessionPayload): Promise<SaleCustomers[]> => prisma.sale.findMany({
    orderBy: { date: "desc" },
    where: {
        customer: {
            name: session.name
        }
    },
    include: {
        customer: true,
        SaleItems: {
            include: {
                product: true
            }
        },

    }
})

