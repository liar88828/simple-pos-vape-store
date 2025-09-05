//
import { DashboardStats, } from "@/action/sale-action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RangeStats, SaleCustomers } from "@/interface/actionType";
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import React from "react";

const salesData = {
    range: "today",

    "sales": [
        {
            "id": 22,
            statusTransaction: 'test data',
            typeTransaction: 'test data',
            "date": new Date(),
            "total": 3711,
            "items": 2,
            "customerId": 6,
            "customer": {
                "id": 6,
                "name": "orak genah",
                "age": 12,
                "totalPurchase": 3734,
                "status": "pending",
                "lastPurchase": new Date()
            },
            "SaleItems": [
                {
                    "id": 41,
                    "saleId": 22,
                    "productId": 8,
                    "quantity": 12,
                    "price": 217,
                    "category": "coil",
                    "product": {
                        "id": 8,
                        "name": "Orlando Dillon",
                        "category": "coil",
                        "price": 217,
                        "stock": 12,
                        "minStock": 80,
                        "image": "https://www.gowihixu.info",
                        "description": "Nemo quis nobis exer",
                        "nicotineLevel": "0mg",
                        "flavor": "Eum unde fugiat odio",
                        "type": "Pod System"
                    }
                },

            ]
        },
    ],

    "trending": {
        "changeText": "Trending down by 74.8% this today",
        "isUp": false,
        "value": 402690
    },

    "stats": {
        "totalSales": 2012297,
        "salesGrowth": -66.46171666666667,
        "transactions": 4,
        "transactionsGrowth": 0,
        "avgTransaction": 503074.25,
        "avgTransactionGrowth": -66.46171666666667,
        "topProduct": {
            "unitsSold": 14,
            "product": {
                "id": 8,
                "name": "Orlando Dillon",
                "category": "coil",
                "price": 217,
                "stock": 12,
                "minStock": 80,
                "image": "https://www.gowihixu.info",
                "description": "Nemo quis nobis exer",
                "nicotineLevel": "0mg",
                "flavor": "Eum unde fugiat odio",
                "type": "Pod System"
            },
        }
    }
}

interface ReportsPageProps {
    range: RangeStats,
    sales: SaleCustomers[],
    stats: DashboardStats,
    trending: {
        changeText: string,
        isUp: boolean,
        value: number
    }
}

// export default function App() {
//     return <DailySalesReport_x5_indonesia sales={ salesData.sales } trending={ salesData.trending } range={ 'today' }
//                                           stats={ salesData.stats }/>;
// }

export function DailySalesReport_x5_english(props: ReportsPageProps) {
    // @ts-ignore
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Daily Sales Report</h1>
                <p className="text-gray-600">Date: { formatDateIndo(new Date()) }</p>
                <p className="text-gray-600">Report Period: ${ props.range }</p>
            </div>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
                <p>Today&#39;s sales performance shows a significant decline compared to previous periods, with total
                    sales of { props.stats.totalSales } across { props.stats.transactions } transactions. The business
                    experienced a { props.stats.avgTransactionGrowth }% decrease in sales growth,
                    indicating challenging market conditions or operational factors that require immediate
                    attention.</p>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Key Performance Indicators</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Total Sales Revenue: { formatRupiah(props.stats.totalSales) }</li>
                    <li>Sales Growth: ${ (props.stats.salesGrowth).toFixed(2) }% (declining trend)</li>
                    <li>Total Transactions: ${ props.stats.transactions }</li>
                    <li>Transaction Growth: ${ props.stats.transactionsGrowth }% (no change)</li>
                    <li>Average Transaction Value: { formatRupiah(props.stats.avgTransaction) }</li>
                    <li>Average Transaction Growth: ${ props.stats.avgTransactionGrowth.toFixed(2) }%</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Trending Analysis</h2>
                <p>The current { props.trending.changeText } movement with a trending value of { props.trending.value },
                    indicating
                    significant challenges in maintaining sales momentum.</p>
            </section>

            {/* Transaction Analysis */ }
            <section className="mb-8 bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Transaction Analysis</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Transaction # (Time)
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer (Status,
                                Age)
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total (Rp)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Items</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Products</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        { props.sales.map((sale) => (
                            <tr key={ sale.id }>
                                <td className="px-4 py-2">
                                    #{ sale.id } ({ new Date(sale.date).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) })
                                </td>
                                <td className="px-4 py-2 capitalize">
                                    { sale.Customer.name } ({ sale.Customer.status }, Age: { sale.Customer.age })
                                </td>
                                <td className="px-4 py-2">{ sale.total.toLocaleString() }</td>
                                <td className="px-4 py-2">{ sale.items }</td>
                                <td className="px-4 py-2">
                                    { sale.SaleItems.map(item => (
                                        <span key={ item.id }
                                              className="block">{ item.product.name } ({ item.quantity } units)</span>
                                    )) }
                                </td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </div>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Product Performance Analysis</h2>
                <p><strong>Top Performing Product:</strong> Orlando Dillon (Product ID: 8)</p>
                {
                    props.stats.topProduct.product &&
						<ul className="list-disc list-inside">
							<li>Category: { props.stats.topProduct.product.category }</li>
							<li>Units Sold: { props.stats.topProduct.unitsSold }</li>
							<li>Price: { formatRupiah(props.stats.topProduct.unitsSold) } per unit</li>
							<li>Type: { props.stats.topProduct.product.type }</li>
							<li>Nicotine Level: { props.stats.topProduct.unitsSold }</li>
							<li>Current Stock: { props.stats.topProduct.product.stock } units (Below minimum stock
								level: { props.stats.topProduct.product.minStock } units)
							</li>
						</ul>
                }
                <h3 className="mt-2 font-semibold">Category Performance</h3>
                <ul className="list-disc list-inside">
                    <li>Coil Products: Dominated sales volume with multiple high-value transactions</li>
                    <li>Device Products: Lower transaction values but consistent demand</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Stock Management Concerns</h2>
                <ul className="list-disc list-inside">
                    <li>Orlando Dillon: 12 units (minimum: 80) - <span className="text-red-600">Critical</span></li>
                    <li>Macy Tillman: 61 units (minimum: 73) - <span className="text-yellow-600">Below minimum</span>
                    </li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Customer Analysis</h2>
                <ul className="list-disc list-inside">
                    <li>
                        <strong>Verified Customers:</strong> 1 customer (_admin) contributing Rp 803,494 (39.9% of total
                        sales)
                    </li>
                    <li>
                        <strong>Pending Customers:</strong> 2 customers contributing Rp 1,208,803 (60.1% of total sales)
                    </li>
                    <li>
                        <strong>_admin:</strong> High-value repeat customer with total purchases of Rp 1,303,494
                    </li>
                    <li>Limited new customer acquisition (3 active customers today)</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Hourly Sales Distribution</h2>
                <ul className="list-disc list-inside">
                    <li><strong>Peak Hours:</strong> 8:00-9:30 AM (all transactions)</li>
                    <li><strong>Afternoon/Evening:</strong> No sales recorded</li>
                    <li><strong>Opportunity:</strong> Potential for extending sales hours</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
                <h3 className="font-semibold">Immediate Actions Required</h3>
                <ul className="list-disc list-inside">
                    <li>Restock Orlando Dillon and Macy Tillman products</li>
                    <li>Follow-up with pending customers Orak Genah and Alan Jetis</li>
                    <li>Investigate reasons for afternoon/evening sales drop</li>
                </ul>
                <h3 className="font-semibold mt-2">Strategic Improvements</h3>
                <ul className="list-disc list-inside">
                    <li>Launch loyalty programs for high-value customers like _admin</li>
                    <li>Analyze coil vs. device product performance for diversification</li>
                    <li>Extend operating sales hours</li>
                    <li>Review customer age data for compliance</li>
                </ul>
                <h3 className="font-semibold mt-2">Performance Recovery Plan</h3>
                <ul className="list-disc list-inside">
                    <li>Track daily sales trends over the next week</li>
                    <li>Implement promotions to counter declining trends</li>
                    <li>Increase average transaction values through upselling</li>
                    <li>Expand customer base to reduce revenue concentration</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Conclusion</h2>
                <p>Today&#39;s sales report reveals a downward trend but highlights high purchasing power. Focus on
                    inventory, customer engagement, and extending sales hours to maximize revenue potential. Loyal
                    customers offer promise if supported with effective strategies.</p>
            </section>
        </div>
    );
}

export function DailySalesReport_x4({ data }: { data: any }) {
    // @ts-ignore
    // @ts-ignore
    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen font-sans text-gray-900">
            <h1 className="text-3xl font-bold mb-4">Daily Sales Report</h1>
            <p className="mb-8 text-gray-700">
                Date: June 5, 2025<br/>
                Report Period: Today
            </p>

            {/* Executive Summary */ }
            <section className="mb-8 bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
                <p className="text-gray-700">
                    Today&#39;s sales performance shows a significant decline compared to previous periods, with total
                    sales
                    of{ " " }
                    <strong>Rp { data.stats.totalSales.toLocaleString() }</strong> across { data.stats.transactions } transactions.
                    The business experienced a{ " " }
                    <strong>{ data.stats.salesGrowth.toFixed(2) }%</strong> decrease in sales growth, indicating
                    challenging market conditions or operational factors that require immediate attention.
                </p>
            </section>

            {/* Transaction Analysis */ }
            <section className="mb-8 bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Transaction Analysis</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Transaction # (Time)
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Customer (Status,
                                Age)
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total (Rp)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Items</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Products</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        { //@ts-expect-error
                            data.sales.map((sale) => (
                                <tr key={ sale.id }>
                                    <td className="px-4 py-2">
                                        #{ sale.id } ({ new Date(sale.date).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) })
                                    </td>
                                    <td className="px-4 py-2 capitalize">
                                        { sale.Customer.name } ({ sale.Customer.status }, Age: { sale.Customer.age })
                                    </td>
                                    <td className="px-4 py-2">{ sale.total.toLocaleString() }</td>
                                    <td className="px-4 py-2">{ sale.items }</td>
                                    <td className="px-4 py-2">
                                        {
                                            //@ts-expect-error
                                            sale.SaleItems.map(item => (
                                                <span key={ item.id }
                                                      className="block">{ item.product.name } ({ item.quantity } units)</span>)) }
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Add other sections here similarly if needed */ }

        </div>
    );
}

export function DailySalesReport_x3() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Daily Sales Report</h1>
                <p className="text-gray-600">Date: June 5, 2025</p>
                <p className="text-gray-600">Report Period: Today</p>
            </div>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Executive Summary</h2>
                <p>Today&#39;s sales performance shows a significant decline compared to previous periods, with total
                    sales
                    of Rp 2,012,297 across 4 transactions. The business experienced a 66.46% decrease in sales growth,
                    indicating challenging market conditions or operational factors that require immediate
                    attention.</p>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Key Performance Indicators</h2>
                <ul className="list-disc list-inside space-y-1">
                    <li>Total Sales Revenue: Rp 2,012,297</li>
                    <li>Sales Growth: -66.46% (declining trend)</li>
                    <li>Total Transactions: 4</li>
                    <li>Transaction Growth: 0% (no change)</li>
                    <li>Average Transaction Value: Rp 503,074.25</li>
                    <li>Average Transaction Growth: -66.46%</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Trending Analysis</h2>
                <p>The current trend shows a 74.8% downward movement with a trending value of Rp 402,690, indicating
                    significant challenges in maintaining sales momentum.</p>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Transaction Analysis</h2>
                <div className="space-y-2">
                    <div>
                        <h3 className="font-semibold">Transaction #22 (09:30 AM)</h3>
                        <p>Customer: Orak Genah (Age: 12, Status: Pending)</p>
                        <p>Total: Rp 3,711 | Items: 2 products</p>
                        <p>Products: Orlando Dillon coil (12 units), Random data device (9 units)</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Transaction #21 (08:30 AM) - Highest Value Sale</h3>
                        <p>Customer: Alan Jetis (Status: Pending)</p>
                        <p>Total: Rp 1,205,092 | Items: 3 products</p>
                        <p>Products: Coil jaya (6 units), Chava Baird coil (5 units), Macy Tillman device (3 units)</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Transaction #20 (08:29 AM)</h3>
                        <p>Customer: _admin (Status: Verified)</p>
                        <p>Total: Rp 3,494 | Items: 3 products</p>
                        <p>Products: Mixed coil and device purchases</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Transaction #19 (08:06 AM)</h3>
                        <p>Customer: _admin (Status: Verified)</p>
                        <p>Total: Rp 800,000 | Items: 1 product</p>
                        <p>Products: Coil jaya (4 units)</p>
                    </div>
                </div>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Product Performance Analysis</h2>
                <p><strong>Top Performing Product:</strong> Orlando Dillon (Product ID: 8)</p>
                <ul className="list-disc list-inside">
                    <li>Category: Coil</li>
                    <li>Units Sold: 14</li>
                    <li>Price: Rp 217 per unit</li>
                    <li>Type: Pod System</li>
                    <li>Nicotine Level: 0mg</li>
                    <li>Current Stock: 12 units (Below minimum stock level: 80 units)</li>
                </ul>
                <h3 className="mt-2 font-semibold">Category Performance</h3>
                <ul className="list-disc list-inside">
                    <li>Coil Products: Dominated sales volume with multiple high-value transactions</li>
                    <li>Device Products: Lower transaction values but consistent demand</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Stock Management Concerns</h2>
                <ul className="list-disc list-inside">
                    <li>Orlando Dillon: 12 units (minimum: 80) - <span className="text-red-600">Critical</span></li>
                    <li>Macy Tillman: 61 units (minimum: 73) - <span className="text-yellow-600">Below minimum</span>
                    </li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Customer Analysis</h2>
                <ul className="list-disc list-inside">
                    <li><strong>Verified Customers:</strong> 1 customer (_admin) contributing Rp 803,494 (39.9% of total
                        sales)
                    </li>
                    <li><strong>Pending Customers:</strong> 2 customers contributing Rp 1,208,803 (60.1% of total sales)
                    </li>
                    <li><strong>_admin:</strong> High-value repeat customer with total purchases of Rp 1,303,494</li>
                    <li>Limited new customer acquisition (3 active customers today)</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Hourly Sales Distribution</h2>
                <ul className="list-disc list-inside">
                    <li><strong>Peak Hours:</strong> 8:00-9:30 AM (all transactions)</li>
                    <li><strong>Afternoon/Evening:</strong> No sales recorded</li>
                    <li><strong>Opportunity:</strong> Potential for extending sales hours</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
                <h3 className="font-semibold">Immediate Actions Required</h3>
                <ul className="list-disc list-inside">
                    <li>Restock Orlando Dillon and Macy Tillman products</li>
                    <li>Follow-up with pending customers Orak Genah and Alan Jetis</li>
                    <li>Investigate reasons for afternoon/evening sales drop</li>
                </ul>
                <h3 className="font-semibold mt-2">Strategic Improvements</h3>
                <ul className="list-disc list-inside">
                    <li>Launch loyalty programs for high-value customers like _admin</li>
                    <li>Analyze coil vs. device product performance for diversification</li>
                    <li>Extend operating sales hours</li>
                    <li>Review customer age data for compliance</li>
                </ul>
                <h3 className="font-semibold mt-2">Performance Recovery Plan</h3>
                <ul className="list-disc list-inside">
                    <li>Track daily sales trends over the next week</li>
                    <li>Implement promotions to counter declining trends</li>
                    <li>Increase average transaction values through upselling</li>
                    <li>Expand customer base to reduce revenue concentration</li>
                </ul>
            </section>

            <section className=" p-4">
                <h2 className="text-xl font-semibold mb-2">Conclusion</h2>
                <p>Today&#39;s sales report reveals a downward trend but highlights high purchasing power. Focus on
                    inventory, customer engagement, and extending sales hours to maximize revenue potential. Loyal
                    customers offer promise if supported with effective strategies.</p>
            </section>
        </div>
    );
}

export function DailySalesReport_x2() {
    const salesData = {
        totalSales: 2012297,
        transactions: 4,
        avgTransaction: 503074.25,
        salesGrowth: -66.46,
        transactionsGrowth: 0,
        trending: {
            changeText: "Trending down by 74.8% this today",
            isUp: false,
            value: 402690,
        },
        topProduct: {
            name: "Orlando Dillon",
            category: "coil",
            unitsSold: 14,
            price: 217,
            stock: 12,
            minStock: 80,
        },
        sales: [
            {
                id: 22,
                customer: "orak genah",
                items: 2,
                total: 3711,
                time: "09:30 AM",
            },
            {
                id: 21,
                customer: "alan jetis",
                items: 3,
                total: 1205092,
                time: "08:30 AM",
            },
            {
                id: 20,
                customer: "_admin",
                items: 3,
                total: 3494,
                time: "08:29 AM",
            },
            {
                id: 19,
                customer: "_admin",
                items: 1,
                total: 800000,
                time: "08:06 AM",
            },
        ],
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl">
            <h1 className="text-3xl font-bold mb-6">📄 Daily Sales Report</h1>

            <div className="space-y-4">
                <section>
                    <h2 className="text-xl font-semibold">🧾 Summary</h2>
                    <ul className="list-disc list-inside">
                        <li>Total Sales Amount: Rp { salesData.totalSales.toLocaleString() }</li>
                        <li>Total Transactions: { salesData.transactions }</li>
                        <li>Average Transaction: Rp { salesData.avgTransaction.toLocaleString() }</li>
                        <li>Sales Growth: { salesData.salesGrowth }%</li>
                        <li>Transaction Growth: { salesData.transactionsGrowth }%</li>
                        <li>
                            Trend: { salesData.trending.isUp ? "🔺" : "🔻" } { salesData.trending.changeText }
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6">📊 Sales Breakdown</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border mt-2">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Sale ID</th>
                                <th className="p-2 border">Customer</th>
                                <th className="p-2 border">Items</th>
                                <th className="p-2 border">Total Amount</th>
                                <th className="p-2 border">Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            { salesData.sales.map((sale) => (
                                <tr key={ sale.id } className="text-center">
                                    <td className="p-2 border">{ sale.id }</td>
                                    <td className="p-2 border">{ sale.customer }</td>
                                    <td className="p-2 border">{ sale.items }</td>
                                    <td className="p-2 border">Rp { sale.total.toLocaleString() }</td>
                                    <td className="p-2 border">{ sale.time }</td>
                                </tr>
                            )) }
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6">📦 Top Product of the Day</h2>
                    <ul className="list-disc list-inside">
                        <li>Product: { salesData.topProduct.name }</li>
                        <li>Category: { salesData.topProduct.category }</li>
                        <li>Units Sold: { salesData.topProduct.unitsSold }</li>
                        <li>Price per Unit: Rp { salesData.topProduct.price.toLocaleString() }</li>
                        <li>Stock Left: { salesData.topProduct.stock } (Min
                            Required: { salesData.topProduct.minStock })
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6">🔍 Observations</h2>
                    <ul className="list-disc list-inside">
                        <li>Sales performance dropped significantly today.</li>
                        <li>High revenue generated by large orders (e.g., Sale ID 21 and 19).</li>
                        <li>&#34;Orlando Dillon&#34; is a top-selling product but low in stock.</li>
                        <li>Repeat buyer: <strong>_admin</strong>.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mt-6">📌 Recommended Actions</h2>
                    <ul className="list-disc list-inside">
                        <li>Restock fast-moving products like &#34;Orlando Dillon&#34;.</li>
                        <li>Investigate the cause of the sales drop and consider promotions.</li>
                        <li>Reward or follow up with high-value customers.</li>
                        <li>Analyze time slots with no sales to optimize store strategy.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export function DailySalesReportx1() {

    const salesData = {
        totalSales: 2012297,
        transactions: 4,
        avgTransaction: 503074.25,
        salesGrowth: -66.46,
        transactionsGrowth: 0,
        trend: {
            isUp: false,
            value: 402690,
            changeText: "Trending down by 74.8% this today",
        },
        topProduct: {
            name: "Orlando Dillon",
            category: "coil",
            unitsSold: 14,
            price: 217,
            stock: 12,
            minStock: 80,
        },
        sales: [
            { id: 22, customer: "orak genah", items: 2, total: 3711, time: "09:30" },
            { id: 21, customer: "alan jetis", items: 3, total: 1205092, time: "08:30" },
            { id: 20, customer: "_admin", items: 3, total: 3494, time: "08:29" },
            { id: 19, customer: "_admin", items: 1, total: 800000, time: "08:06" },
        ],
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">📄 Daily Sales Report</h1>
            <p className="text-gray-500">Date: June 5, 2025</p>

            <Card>
                <CardContent className="p-4 space-y-2">
                    <h2 className="text-xl font-semibold">🧾 Summary</h2>
                    <p>Total Sales: Rp { salesData.totalSales.toLocaleString() }</p>
                    <p>Transactions: { salesData.transactions }</p>
                    <p>Average Transaction: Rp { salesData.avgTransaction.toLocaleString() }</p>
                    <p>Sales Growth: { salesData.salesGrowth }%</p>
                    <p>Transaction Growth: { salesData.transactionsGrowth }%</p>
                    <p>
                        Trend: { salesData.trend.isUp ? "📈 Up" : "🔻 Down" } – { salesData.trend.changeText }
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-4">📊 Sales Breakdown</h2>
                    <table className="w-full text-left">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        { salesData.sales.map((sale) => (
                            <tr key={ sale.id } className="border-t">
                                <td>{ sale.id }</td>
                                <td>{ sale.customer }</td>
                                <td>{ sale.items }</td>
                                <td>Rp { sale.total.toLocaleString() }</td>
                                <td>{ sale.time }</td>
                            </tr>
                        )) }
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 space-y-2">
                    <h2 className="text-xl font-semibold">📦 Top Product</h2>
                    <p>Name: { salesData.topProduct.name }</p>
                    <p>Category: { salesData.topProduct.category }</p>
                    <p>Units Sold: { salesData.topProduct.unitsSold }</p>
                    <p>Stock
                        Left: { salesData.topProduct.stock } { salesData.topProduct.stock < salesData.topProduct.minStock &&
								<Badge variant="destructive">Low Stock</Badge> }</p>
                </CardContent>
            </Card>
        </div>
    );
}
