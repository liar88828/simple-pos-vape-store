'use server'
import { prisma } from "@/lib/prisma";

export const getShopMarket = async (shopId: string) => await prisma.market.findUnique(
    { where: { id: shopId } })

export const getProductMarket = async (marketsId: string) => {
    return prisma.product.findMany({
        where: {
            PreOrders: {
                some: {
                    marketId_sellIn: marketsId
                }
            }
        },
        take: 100,
    })
}

export const getEmployeeMarket = async (marketsId: string) => await prisma.user.findMany({
    where: { marketId_workIn: marketsId, }
})
