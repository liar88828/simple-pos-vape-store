'use server'

import { ActionResponse } from "@/interface/actionType";
import { prisma } from "@/lib/prisma";
import {
    InventorySetting,
    PaymentSettingList,
    PaymentSettingWithRelations,
    ShippingSettingList,
    ShippingSettingWithRelations,
    StoreOptionalDefaults
} from "@/lib/validation";
import { writeFile } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import path from 'path'

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

export async function saveSettingStore(data: StoreOptionalDefaults): Promise<ActionResponse> {
    console.log("setting action:", data);
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
    }: PaymentSettingWithRelations): Promise<ActionResponse> {

    const shippingResponse = await prisma.$transaction(async (tx) => {
        const shippingDB = await tx.paymentSetting.findFirst()

        if (!shippingDB) {
            const createdPayment = await tx.paymentSetting.create({ data })
            paymentID = createdPayment.id

        } else {
            const updatedPayment = await tx.paymentSetting.update({ where: { id: shippingDB.id }, data })
            paymentID = updatedPayment.id
        }

        if (await tx.paymentSettingList.count() > 0) {
            await tx.paymentSettingList.deleteMany({ where: { paymentId: paymentID } })
        }
        const datas: Omit<PaymentSettingList, 'id'>[] = PaymentList.map(item => ({
            title: item.title,
            fee: item.fee,
            value: item.value,
            paymentId: paymentID,
        }))
        // console.log(datas)

        await tx.paymentSettingList.createMany({ data: datas })

    })
    revalidatePath('/')

    return {
        data: shippingResponse, success: true,
        message: "Successfully updated store"
    }
}

export async function getSettingPayment() {
    return prisma.paymentSetting.findFirst({ include: { PaymentList: true } })
}

export async function getSettingPaymentFirst() {
    return prisma.paymentSetting.findFirst()
}



export async function saveSettingShipping(
    {
        ShippingList,
        id: shippingID,
        ...data
    }: ShippingSettingWithRelations): Promise<ActionResponse> {

    const shippingResponse = await prisma.$transaction(async (tx) => {
        const shippingDB = await tx.shippingSetting.findFirst()

        if (!shippingDB) {
            const createdShipping = await tx.shippingSetting.create({ data })
            shippingID = createdShipping.id

        } else {
            const updatedShipping = await tx.shippingSetting.update({ where: { id: shippingDB.id }, data })
            shippingID = updatedShipping.id
        }

        if (await tx.shippingSettingList.count() > 0) {
            await tx.shippingSettingList.deleteMany({ where: { shippingId: shippingID } })
        }
        // console.log(shippingID)
        const datas: Omit<ShippingSettingList, 'id'>[] = ShippingList.map(item => ({
            name: item.name,
            price: item.price,
            rates: item.rates,
            shippingId: shippingID,
        }))
        await tx.shippingSettingList.createMany({ data: datas })

    })
    revalidatePath('/')

    return {
        data: shippingResponse,
        success: true,
        message: "Successfully updated store"
    }
}

export async function getSettingShipping() {
    return prisma.shippingSetting.findFirst({ include: { ShippingList: true } })
}

export async function saveSettingInventory(data: InventorySetting): Promise<ActionResponse> {
    const inventoryDB = await prisma.inventorySetting.findFirst()
    if (!inventoryDB) await prisma.inventorySetting.create({ data })
    else await prisma.inventorySetting.update({ data, where: { id: inventoryDB.id } })

    revalidatePath('/')

    return {
        success: true,
        message: "Successfully updated store"
    }
}

export async function getSettingInventory() {
    return prisma.inventorySetting.findFirst()
}