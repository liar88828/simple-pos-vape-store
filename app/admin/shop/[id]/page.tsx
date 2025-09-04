import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import React from "react"

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

export default function StoreDetailPage({ params }: { params: { id: string } }) {
    const storeId = Number(params.id)
    const store = shops.find((s) => s.id === storeId)

    if (!store) {
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
                    <CardTitle>{ store.name }</CardTitle>
                    <CardDescription>{ store.description }</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                    <p><span className="font-semibold">Location:</span> { store.location }</p>
                    <p><span className="font-semibold">Category:</span> { store.category }</p>
                    <p>
                        <span className="font-semibold">Status:</span>{ " " }
                        { store.open ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600">Open</Badge>
                        ) : (
                            <Badge variant="destructive">Closed</Badge>
                        ) }
                    </p>
                </CardContent>
            </Card>

            {/* Show products & employees only if open */ }
            {/* Product List */ }
            {/*{ store.open && (*/ }
            <Card>
                <CardHeader>
                    <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Products available in { store.name }.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { store.products.map((product) => (
                                <TableRow key={ product.id }>
                                    <TableCell>{ product.id }</TableCell>
                                    <TableCell>{ product.name }</TableCell>
                                    <TableCell>{ product.price }</TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>

            </Card>
            {/*) }*/ }

            {/* Employee List */ }
            <Card>
                <CardHeader>
                    <CardTitle>Employees</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>Employees working at { store.name }.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { store.employees.map((emp) => (
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
        </div>
    )
}
