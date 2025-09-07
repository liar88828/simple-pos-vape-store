import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { prisma } from "@/lib/prisma";

import Link from "next/link";
import React from "react"

export default async function Page() {
    const shops = await prisma.market.findMany()
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
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                {/*<TableHead>Category</TableHead>*/ }
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { shops.map((shop, i) => (
                                <TableRow key={ shop.id }>
                                    <TableCell className="font-medium">{ i + 1 }</TableCell>
                                    <TableCell>{ shop.name }</TableCell>
                                    <TableCell>{ shop.location }</TableCell>
                                    {/*<TableCell>{shop.category}</TableCell>*/ }
                                    <TableCell>
                                        { shop.open
                                            ? <Badge variant="default">Open</Badge>
                                            : <Badge variant="destructive">Closed</Badge>
                                         }
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