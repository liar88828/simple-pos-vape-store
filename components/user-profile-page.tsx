'use client'
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomerComplete } from "@/action/customer-action";
import { formatDateIndo, formatRupiah } from "@/lib/my-utils";

export default function UserProfilePage({ customer }: { customer: CustomerComplete }) {
    const [ expandedSaleIds, setExpandedSaleIds ] = useState<number[]>([]);

    const toggleExpand = (id: number) => {
        setExpandedSaleIds((prev) =>
            prev.includes(id) ? prev.filter((saleId) => saleId !== id) : [ ...prev, id ]
        );
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">User Profile</CardTitle>
                </CardHeader>
                <Separator/>
                <CardContent>
                    <p>
                        <strong>Name:</strong> { customer.name }
                    </p>
                    <p>
                        <strong>Status:</strong> { customer.status }
                    </p>
                    <p>
                        <strong>Created At:</strong>
                        { formatDateIndo(customer.createdAt) }
                    </p>
                    <p>
                        <strong>Last Updated:</strong>
                        { formatDateIndo(customer.updatedAt) }
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Purchase History</CardTitle>
                </CardHeader>
                <Separator/>
                <CardContent>
                    { customer.Sales.length === 0 ? (
                        <p>No purchases yet.</p>
                    ) : (
                        <div className="space-y-4">
                            { customer.Sales.map((sale) => (
                                <div key={ sale.id } className="border rounded p-4">
                                    <div
                                        className="flex justify-between cursor-pointer"
                                        onClick={ () => toggleExpand(sale.id) }
                                    >
                                        <div>
                                            <p>
                                                <strong>Date:</strong>{ " " }
                                                { formatDateIndo(sale.date) }
                                            </p>
                                            <p>
                                                <strong>Total:</strong> { formatRupiah(sale.total) }
                                            </p>
                                            <p>
                                                <strong>Items:</strong> { sale.items }
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p>
                                                <strong>Status:</strong> { sale.statusTransaction }
                                            </p>
                                            <p>
                                                <strong>Payment:</strong> { sale.typeTransaction }
                                            </p>
                                            <button className="text-blue-600 underline">
                                                { expandedSaleIds.includes(sale.id) ? "Hide" : "Show" }{ " " }
                                                Products
                                            </button>
                                        </div>
                                    </div>

                                    { expandedSaleIds.includes(sale.id) && (
                                        <table className="w-full mt-4 text-left border-collapse">
                                            <thead>
                                            <tr className="border-b">
                                                <th className="py-2 px-4">Product</th>
                                                <th className="py-2 px-4">Quantity</th>
                                                <th className="py-2 px-4">Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            { sale.SaleItems.map((item) => (
                                                <tr key={ item.id } className="border-b">
                                                    <td className="py-2 px-4">{ item.product.name }</td>
                                                    <td className="py-2 px-4">{ item.quantity }</td>
                                                    <td className="py-2 px-4">
                                                        { formatRupiah(item.price) }
                                                    </td>
                                                </tr>
                                            )) }
                                            </tbody>
                                        </table>
                                    ) }
                                </div>
                            )) }
                        </div>
                    ) }
                </CardContent>
            </Card>
        </div>
    );
}