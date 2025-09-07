import { getProductLowStockComplete, ProductPaging } from "@/action/product-action";
import { getExpiredProduct } from "@/app/admin/inventory/inventory-action";
import {
    AddStockModal,
    InventoryPaging,
    ProductExpired,
    ProductPreorderHistory, ReorderStockModal
} from "@/app/admin/inventory/inventory-page";
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle } from "lucide-react"
import React from "react"

export async function InventoryPage({ products, preorders, }: {
    products: ProductPaging,
    preorders: InventoryPaging
}) {
    const expiredProduct = await getExpiredProduct()
    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-3xl font-bold">Manajemen Inventori</h1>
                {/*Tambah Stok Produk*/ }
                <AddStockModal preorder={ products.data }/>
            </div>

            {/* History Preorder */ }
            <ProductPreorderHistory preorders={ preorders }/>


            {/* Low Stock Alert */ }
            <ProductLowStock/>


            {/* Expired Alert */ }
            <ProductExpired expiredProduct={ expiredProduct }/>

        </div>
    )
}

// Low Stock Alert
export async function ProductLowStock() {
    const lowStockProducts = await getProductLowStockComplete()
    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2"/>
                    Produk Stok Rendah : { lowStockProducts.length } Produk
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produk</TableHead>
                            <TableHead>Stok Saat Ini</TableHead>
                            <TableHead>Minimum Stok</TableHead>
                            <TableHead>Perlu Reorder</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { lowStockProducts.map((product) => (
                            <TableRow key={ product.id }>
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <picture>
                                            <img
                                                src={ product.image || "/placeholder.svg" }
                                                alt={ product.name }
                                                className="w-8 h-8 rounded object-cover"
                                            />
                                        </picture>
                                        <span className="font-medium">{ product.name }</span>
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant="destructive">{ product.stock }</Badge></TableCell>
                                <TableCell>{ product.minStock }</TableCell>
                                <TableCell>{ product.minStock - product.stock + 10 }</TableCell>
                                <TableCell>
                                    <ReorderStockModal isStock={ product }/>
                                </TableCell>
                            </TableRow>
                        )) }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
