import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { ShopOptionalDefaults } from "@/lib/validation";
import Link from "next/link";
import React from "react"

const shops: ShopOptionalDefaults[] = [
    { id: '13', name: "Fresh Mart", location: "New York", category: "Grocery", open: true },
    { id: '123', name: "Tech Hub", location: "San Francisco", category: "Electronics", open: false },
    { id: '3', name: "Style Corner", location: "Chicago", category: "Fashion", open: true },
]

function Page() {
    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Shop List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of all registered shops.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                {/*<TableHead>Category</TableHead>*/ }
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { shops.map((shop) => (
                                <TableRow key={ shop.id }>
                                    <TableCell className="font-medium">{ shop.id }</TableCell>
                                    <TableCell>{ shop.name }</TableCell>
                                    <TableCell>{ shop.location }</TableCell>
                                    {/*<TableCell>{shop.category}</TableCell>*/ }
                                    <TableCell>
                                        { shop.open ? (
                                            <Badge variant="default"
                                                   className="bg-green-500 hover:bg-green-600">Open</Badge>
                                        ) : (
                                            <Badge variant="destructive">Closed</Badge>
                                        ) }
                                    </TableCell>
                                    <TableCell><Button size={ 'sm' } asChild>
                                        <Link href={ `/admin/shop/${ shop.id }` }>
                                            Detail
                                        </Link>
                                    </Button></TableCell>

                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}

export default Page
