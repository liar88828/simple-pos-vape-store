'use server'

import { writeFile } from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { InventoryModelType, StoreModelType } from "@/lib/schema";
import { prisma } from "@/lib/prisma";
import { ActionResponse } from "@/interface/actionType";
import { CompletePayment, CompletePaymentList, CompleteShipping, CompleteShippingList } from "@/lib/generated/zod";

export async function saveStoreLogo(file: File | null) {

    if (!file || file.size === 0) {
        return;
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const filePath = path.join(process.cwd(), 'public', 'logo.png') // overwrite as logo.png
    await writeFile(filePath, buffer)

    revalidatePath('/') // optional: revalidate homepage

    return { success: true, filePath: '/logo.png' }
}

export const getStoreLoader = async () => {
    return prisma.store.findFirst()
}

export async function saveSettingStore(data: StoreModelType): Promise<ActionResponse> {
    const storeDB = await getStoreLoader()

    if (!storeDB) await prisma.store.create({ data })
    else await prisma.store.update({ where: { id: storeDB.id }, data })
    revalidatePath('/')
    return {
        success: true,
        message: "Successfully updated store"
    }
}

export async function saveSettingPayment(
    {
        PaymentList,
        id: paymentID,
        ...data
    }: CompletePayment): Promise<ActionResponse> {

    const shippingResponse = await prisma.$transaction(async (tx) => {
        const shippingDB = await tx.payment.findFirst()

        if (!shippingDB) {
            const createdPayment = await tx.payment.create({ data })
            paymentID = createdPayment.id

        } else {
            const updatedPayment = await tx.payment.update({ where: { id: shippingDB.id }, data })
            paymentID = updatedPayment.id
        }
        if (await tx.paymentList.count() > 0) {
            await tx.paymentList.deleteMany({ where: { paymentId: paymentID } })
        }
        const datas: Omit<CompletePaymentList, 'id'>[] = PaymentList.map(item => ({
            title: item.title,
            fee: item.fee,
            value: item.value,
            paymentId: paymentID,
        }))
        // console.log(datas)

        await tx.paymentList.createMany({ data: datas })

    })
    revalidatePath('/')

    return {
        data: shippingResponse, success: true,
        message: "Successfully updated store"
    }
}

export async function getSettingPayment() {
    return prisma.payment.findFirst({ include: { PaymentList: true } })
}

export async function saveSettingShipping(
    {
        ShippingList,
        id: shippingID,
        ...data
    }: CompleteShipping): Promise<ActionResponse> {

    const shippingResponse = await prisma.$transaction(async (tx) => {
        const shippingDB = await tx.shipping.findFirst()

        if (!shippingDB) {
            const createdShipping = await tx.shipping.create({ data })
            shippingID = createdShipping.id

        } else {
            const updatedShipping = await tx.shipping.update({ where: { id: shippingDB.id }, data })
            shippingID = updatedShipping.id
        }

        if (await tx.shippingList.count() > 0) {
            await tx.shippingList.deleteMany({ where: { shippingId: shippingID } })
        }
        // console.log(shippingID)
        const datas: Omit<CompleteShippingList, 'id'>[] = ShippingList.map(item => ({
            name: item.name,
            price: item.price,
            rates: item.rates,
            shippingId: shippingID,
        }))
        await tx.shippingList.createMany({ data: datas })

    })
    revalidatePath('/')

    return {
        data: shippingResponse,
        success: true,
        message: "Successfully updated store"
    }
}

export async function getSettingShipping() {
    return prisma.shipping.findFirst({ include: { ShippingList: true } })
}

export async function saveSettingInventory(data: InventoryModelType): Promise<ActionResponse> {
    const inventoryDB = await prisma.inventory.findFirst()
    if (!inventoryDB) await prisma.inventory.create({ data })
    else await prisma.inventory.update({ data, where: { id: inventoryDB.id } })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully updated store"
    }
}

export async function getSettingInventory() {
    return prisma.inventory.findFirst()
}