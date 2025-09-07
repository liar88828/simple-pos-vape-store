import { getEmployeeMarket, getProductMarket, getShopMarket } from "@/app/admin/shop/shop-action";
import { LoadingComponentSkeleton } from "@/components/mini/loading-component";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { formatRupiah } from "@/lib/formatter";
import { Market } from "@/lib/validation";

import React, { Suspense } from "react"

export default async function StoreDetailPage({ params }: PageProps<'/admin/shop/[id]'>) {
    const { id: shopId } = (await params)
    const shops = await getShopMarket(shopId)

    if (!shops) {
        return (
            <Card className={ 'p-6' }>
                <CardHeader>
                    <CardTitle>Store not found</CardTitle>
                    <CardDescription>The store you’re looking for does not exist.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <div className={ 'space-y-6 p-6' }>
            <Card>
                <CardHeader>
                    <CardTitle>{ shops.name }</CardTitle>
                    <CardDescription>{ shops.location }</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                    <p><span className="font-semibold">Location:</span> { shops.location }</p>
                    {/*<p><span className="font-semibold">Category:</span> { shops.category }</p>*/ }
                    <p>
                        <span className="font-semibold">Status:</span>{ " " }
                        { shops.open ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Open</Badge>
                        ) : (
                            <Badge variant="destructive">Closed</Badge>
                        ) }
                    </p>
                </CardContent>
            </Card>

            <Suspense fallback={ <LoadingComponentSkeleton count={ 2 }/> }>
                <ShopProduct market={ shops }/>
            </Suspense>

            <Suspense fallback={ <LoadingComponentSkeleton count={ 2 }/> }>
                <ShopEmployees market={ shops }/>
            </Suspense>
        </div>
    )
}

async function ShopProduct({ market }: { market: Market }) {
    const products = await getProductMarket(market.id)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>Products available in { market.name }.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            {/*<TableHead>ID</TableHead>*/ }
                            <TableHead>No</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { products.map((product, i) => (
                            <TableRow key={ product.id }>
                                <TableCell>{ i + 1 }</TableCell>
                                <TableCell>{ product.name }</TableCell>
                                <TableCell>{ formatRupiah(product.price) }</TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

async function ShopEmployees({ market }: { market: Market }) {
    const employees = await getEmployeeMarket(market.id)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Employees</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>Employees working at { market.name }.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { employees.map((emp) => (
                            <TableRow key={ emp.id }>
                                <TableCell>{ emp.id }</TableCell>
                                <TableCell>{ emp.name }</TableCell>
                                <TableCell>{ emp.role }</TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// Fake shops data
const shops = [
    {
        id: 1,
        name: "Fresh Mart",
        location: "New York",
        category: "Grocery",
        open: true,
        description: "Your go-to place for fresh groceries and organic products.",
        products: [
            { id: 1, name: "Apples", price: "$2.5 / kg" },
            { id: 2, name: "Milk", price: "$1.2 / liter" },
        ],
        employees: [
            { id: 1, name: "Alice Johnson", role: "Cashier" },
            { id: 2, name: "Bob Smith", role: "Stock Manager" },
        ],
    },
    {
        id: 2,
        name: "Tech Hub",
        location: "San Francisco",
        category: "Electronics",
        open: false,
        description: "Latest gadgets, laptops, and mobile phones available.",
        products: [],
        employees: [],
    },
    {
        id: 3,
        name: "Style Corner",
        location: "Chicago",
        category: "Fashion",
        open: true,
        description: "Trendy clothing and accessories for all styles.",
        products: [
            { id: 1, name: "T-Shirt", price: "$15" },
            { id: 2, name: "Sneakers", price: "$45" },
        ],
        employees: [
            { id: 3, name: "Charlie Davis", role: "Sales Assistant" },
            { id: 4, name: "Dana Lee", role: "Store Manager" },
        ],
    },
]
