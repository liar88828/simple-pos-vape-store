import React from "react";

export function page() {
    // : PreorderProduct
    const orderData = {
        id: 3,
        status: '',
        customerId: 10,
        productId: 4,
        quantity: 20,
        estimatedDate: new Date(),
        createdAt: new Date(),
        customer: {
            id: 10,
            name: "_admin",
            age: 0,
            totalPurchase: 500000,
            status: "verified",
            lastPurchase: new Date()
        },
        product: {
            id: 4,
            name: "apik update x",
            category: "liquid",
            price: 300000,
            stock: 4000,
            minStock: 10,
            image: "https://picsum.photos/200/300",
            description: "iki enak ",
            nicotineLevel: "12mg",
            flavor: "asdasd",
            type: "vanta"
        }
    };
    return (
        <div>
            {/*<PreOrderInvoice orderData={ orderData }/>*/ }
        </div>
    )
}