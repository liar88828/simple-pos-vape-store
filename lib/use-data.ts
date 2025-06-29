import { preOrders, products, salesData } from "@/lib/data"

export function myData() {

  return {
    products,
    salesData,
    preOrders,
      lowStockProducts: products.filter((p) => p.stock <= p.minStock),
  }
}
