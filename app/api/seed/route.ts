import { generateRekening } from "@/lib/helper";
import { prisma } from "@/lib/prisma"
import { ROLE_USER, STATUS_PREORDER } from "@prisma/client";
import bcrypt from "bcrypt";

export async function GET() {
    await prisma.$transaction(async (tx) => {
        // ✅ Create Store
        const store = await tx.store.create({
            data: {
                name: "Cloud Vape Store",
                currency: "IDR",
                description: "Best vape market in town",
                phone: "08123456789",
                address: "Jl. Sudirman No. 123, Jakarta",
                email: "store@example.com",
            },
        })

        await tx.market.createMany({
            data: [
                { name: "Fresh Mart", location: "New York", category: "Grocery", open: true },
                { name: "Tech Hub", location: "San Francisco", category: "Electronics", open: false },
                { name: "Style Corner", location: "Chicago", category: "Fashion", open: true }, ]
        })
        const market = await tx.market.findMany()
        // ✅ Create Users
        await tx.user.createMany({
            data: [
                {
                    name: "Admin",
                    email: "admin@example.com",
                    password: await bcrypt.hash('admin@example.com', 10), // hash this in real app
                    role: ROLE_USER.ADMIN,
                    img: "https://randomuser.me/api/portraits/women/1.jpg",
                    marketId_workIn: null
                },
                {
                    name: "Employee User",
                    email: "employee@example.com",
                    phone: '+62 2131 1233 123',
                    address: 'Jl Jelambar Utr Bl C/57 A, Dki Jakarta',
                    img: "https://randomuser.me/api/portraits/women/69.jpg",
                    password: await bcrypt.hash('employee@example.com', 10),
                    role: ROLE_USER.EMPLOYEE,
                    marketId_workIn: market[1].id
                },
                {
                    name: "Regular User 1",
                    email: "user1@example.com",
                    img: "https://randomuser.me/api/portraits/women/87.jpg",
                    password: await bcrypt.hash('user1@example.com', 10),
                    role: ROLE_USER.USER,
                    marketId_workIn: null
                },
                {
                    name: "Regular User 2",
                    email: "user2@example.com",
                    img: "https://randomuser.me/api/portraits/women/23.jpg",
                    password: await bcrypt.hash('user2@example.com', 10),
                    role: ROLE_USER.EMPLOYEE,
                    marketId_workIn: null
                },
            ],
        })
        const users = await tx.user.findMany()

        // ✅ Create Customers
        await tx.customer.createMany({
            data: [
                {
                    name: "John Doe",
                    age: 28,
                    totalPurchase: 0,
                    status: "Pending",
                    lastPurchase: new Date(),
                    buyer_userId: users[2].id
                },
                {
                    name: "Alice Smith",
                    age: 35,
                    totalPurchase: 500000,
                    status: "Active",
                    lastPurchase: new Date(),
                    buyer_userId: users[3].id
                },
            ],
        })
        const customers = await tx.customer.findMany()

        // ✅ Create Products
        await tx.product.createMany({
            data: [
                {

                    category: "Vape",
                    name: "Starter Kit X1",
                    price: 500000,
                    stock: 50,
                    minStock: 5,
                    image: 'https://picsum.photos/200/300',
                    brand: "VapeMaster",
                    type: "Device",
                    description: "Compact starter kit with rechargeable battery",
                },
                {
                    category: "Liquid",
                    name: "Mango Blast",
                    price: 150000,
                    stock: 200,
                    minStock: 20,
                    image: 'https://picsum.photos/200/301',
                    brand: "CloudJuice",
                    type: "E-liquid",
                    description: "Sweet mango flavored liquid",
                    nicotineLevel: "6mg",
                    fluidLevel: "60ml",
                    flavor: "Mango",
                },
                {
                    category: "Liquid",
                    name: "Cool Mint Ice",
                    price: 200000,
                    stock: 150,
                    minStock: 20,
                    image: 'https://picsum.photos/200/320',
                    brand: "FreshCloud",
                    type: "E-liquid",
                    description: "Refreshing mint with icy finish",
                    nicotineLevel: "3mg",
                    fluidLevel: "60ml",
                    flavor: "Mint",
                },
                {
                    category: "Coil",
                    name: "Mesh Coil 0.15Ω",
                    price: 50000,
                    stock: 100,
                    minStock: 10,
                    image: 'https://picsum.photos/200/307',
                    brand: "VapeCoil",
                    type: "Coil",
                    description: "High-performance mesh coil for dense vapor",
                    resistanceSize: "0.15Ω",
                    coilSize: "Single Mesh",
                },
                {
                    category: "Cotton",
                    name: "Organic Cotton Pack",
                    price: 20000,
                    stock: 250,
                    minStock: 30,
                    image: 'https://picsum.photos/200/309',
                    brand: "CloudCotton",
                    type: "Cotton",
                    description: "100% organic Japanese cotton",
                    cottonSize: "10g pack",
                },
                {
                    category: "Battery",
                    name: "18650 Rechargeable Battery",
                    price: 100000,
                    stock: 50,
                    minStock: 10,
                    image: 'https://picsum.photos/200/389',
                    brand: "PowerCell",
                    type: "Battery",
                    description: "High capacity 3000mAh rechargeable battery",
                    batterySize: "18650",
                },
                {
                    category: "Device",
                    name: "Pod System Lite",
                    price: 200000,
                    stock: 100,
                    minStock: 5,
                    image: 'https://picsum.photos/200/376',
                    brand: "Podify",
                    type: "Device",
                    description: "Lightweight pod system with refillable cartridge",
                },
            ],

        })
        const products = await tx.product.findMany()

        // ✅ Create PreOrders
        await tx.preOrder.createMany({
            data: [
                {
                    userId: users[0].id,
                    productId: products[0].id,
                    marketId_sellIn: market[0].id,
                    market_name: market[0].name,
                    quantity: 100,
                    priceOriginal: 500000,
                    estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    expired: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    status: STATUS_PREORDER.Pending,
                },
                {
                    userId: users[1].id,
                    productId: products[1].id,
                    marketId_sellIn: market[1].id,
                    market_name: market[1].name,
                    quantity: 50,
                    priceOriginal: 150000,
                    estimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                    expired: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    status: STATUS_PREORDER.Success,
                },
            ],
        })
        const preorder=await tx.preOrder.findMany()

        // ✅ Create a Sale (linked to Customer)
        const sale = await tx.sale.create({
            data: {
                marketId: market[0].id,
                seller_userId: users[0].id,
                buyer_customerId: customers[0].id, // 👈 replace with actual seeded customer ID
                date_buy: new Date(),
                date_confirm: new Date(new Date().getHours() + 1),
                total: 650000,
                items: 2,
                statusTransaction: "Accept",
                typeTransaction: "Cash",
            },
        })

        await tx.salesItem.createMany({
            data: [
                {
                    saleId: sale.id,
                    productId: products[0].id, // Starter Kit X1
                    quantity: 1,
                    priceAtBuy: 500000,
                    preorderId:preorder[0].id,
                },
                {
                    saleId: sale.id,
                    productId: products[1].id, // Mango Blast
                    quantity: 1,
                    priceAtBuy: 150000,
                    preorderId:preorder[0].id,
                },
            ],
        })

        // ✅ Create Payment Methods
        const payment = await tx.paymentSetting.create({
            data: {
                isCod: true,
                isTax: true,
                valueCod: 10000,
                valueTax: 10,
            },
        })
        const paymentList = await tx.paymentSettingList.createMany({
            data: [
                {
                    title: "Mandiri",
                    value: "MANDIRI",
                    fee: 5000,
                    rekening: generateRekening(13),
                    paymentId: payment.id
                },
                { title: "BCA", value: "BCA", fee: 5000, rekening: generateRekening(10), paymentId: payment.id },
                { title: "BRI", value: "BRI", fee: 5000, rekening: generateRekening(15), paymentId: payment.id },
                { title: "BNI", value: "BNI", fee: 5000, rekening: generateRekening(10), paymentId: payment.id },
                {
                    title: "E-Wallet (OVO, Dana, Gopay)",
                    value: "EWALLET",
                    fee: 2500,
                    rekening: generateRekening(12),
                    paymentId: payment.id
                },
                { title: "Cash", value: "CASH", fee: 0, rekening: '-', paymentId: payment.id },

            ]
        })

        // ✅ Create Inventory Settings
        await tx.inventorySetting.createMany({
            data: [
                {
                    trackInventory: true,
                    lowStockThreshold: 10,
                    allowBackorders: false,
                    autoReorder: true,
                },
                {
                    trackInventory: true,
                    lowStockThreshold: 5,
                    allowBackorders: true,
                    autoReorder: false,
                },
                {
                    trackInventory: false,
                    lowStockThreshold: 0,
                    allowBackorders: false,
                    autoReorder: false,
                },
            ],
        })

        // ✅ Create Shipping Options
        const shipping = await tx.shippingSetting.create({
            data: {
                freeShippingThreshold: 1000000,
                handlingFee: 10000,
                internationalShipping: true,
                internationalRate: 50000,
            },
        })
        const shippingList = await tx.shippingSettingList.createMany({
            data: [
                { name: "JNE Express", price: 20000, rates: 2, shippingId: shipping.id },
                { name: "J&T Cargo", price: 25000, rates: 3, shippingId: shipping.id },
                { name: "GoSend Instant", price: 15000, rates: 1, shippingId: shipping.id },
            ],
        })

        // ✅ Create Member Tiers
        // const memberTier = await tx.memberTier.createMany({
        //     data: [
        //         { name: "Bronze", range: "0-1M", progress: 0, count: 0 },
        //         { name: "Silver", range: "1M-5M", progress: 0, count: 0 },
        //         { name: "Gold", range: "5M+", progress: 0, count: 0 },
        //     ],
        // })

        return {
            shippingList,
            shipping,
            paymentList,
            store,
            users,
            customers,
            products

        }
    })

    return new Response("✅ Seed data inserted successfully")
}
