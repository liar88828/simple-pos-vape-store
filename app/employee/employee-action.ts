'use server'
import { prisma } from "@/lib/prisma";

export const getTodayAbsent = async (userId: string) => {

    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    return prisma.absent.findMany({
        where: {
            userId,
            datetime: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    })
}

export const absent = async (userId: string) => await prisma.absent.findMany({
    where: { userId }
})

export const products = async (marketId_sellIn: string) => prisma.product.findMany({
    take: 100,
    where: { PreOrders: { every: { marketId_sellIn } } }
})


