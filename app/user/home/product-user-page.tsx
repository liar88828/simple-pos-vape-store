"use client"

import { ProductPaging, ProductPreorder } from "@/action/product-action";
import { ProductsFilter } from "@/app/admin/products/products-page";
import { ProductPending } from "@/app/user/home/page"
import { createTransactionUserAction, createTransactionUserPendingAction } from "@/app/user/user-action";
import { ProductDetailDialogOnly } from "@/components/page/product-detail-dialog-only";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/hooks/use-cart";
import { CartItem, SessionPayload } from "@/interface/actionType";
import { formatRupiah } from "@/lib/formatter";
import { toastResponse } from "@/lib/helper";
import { MinusIcon, Plus, PlusIcon, ShoppingCart, Trash2 } from "lucide-react"
import React, { useEffect, useState } from "react"

export function ProductUserPage(
    {
        productPending,
        session,
        products,

    }: {
        productPending: ProductPending
        session: SessionPayload
        products: ProductPaging,

    }) {
    const [ loading, setLoading ] = useState(false)
    const [ isProduct, setIsProduct ] = useState<ProductPreorder | null>(null)
    const [ isOpen, setIsOpen ] = useState(false)

    // Zustand state/actions
    const { cartItems, incrementItem, decrementItem, removeFromCart, addToCart, setCartItems } =
        useCartStore();

    // ✅ initialize cart items from productPending.current
    useEffect(() => {
        if (productPending?.current) {
            setCartItems(productPending.current);
        }
    }, [ productPending, setCartItems ]);

    const getTotalCart = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    async function onTransaction() {
        setLoading(true)
        if (productPending.isPending) {
            if (productPending.data) {
                toastResponse({ response: await createTransactionUserPendingAction(cartItems, productPending.data), })
            }
        } else {
            toastResponse({ response: await createTransactionUserAction(cartItems) })
        }
        setLoading(false)
    }

    const getProductStock = (id: string) => {
        return products.data.find(product => product.id === id)?.stock || 0;
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            { isProduct && <ProductDetailDialogOnly
					isAdd={ true }
					product={ isProduct }
					isOpen={ isOpen }
					setOpenAction={ setIsOpen }
					onAdd={ () => {
                        if (isProduct) {
                            // incrementItem(isProduct.id)
                            addToCart(isProduct)
                        }
                    } }
			/>
            }
            <h1 className="text-3xl font-bold mb-6">User Home { session.name }</h1>

            <div className="grid grid-cols-1 xl:grid-cols-3 space-y-6  xl:space-y-0 xl:space-x-6  ">

                {/* Product Selection */ }
                <div className="lg:col-span-2 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Produk</CardTitle>
                            <ProductsFilter products={ products }/>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                { products.data.map((product) => {
                                    const cartItem = cartItems.find(item => item.id === product.id);
                                    const remainingStock = cartItem ? product.stock - cartItem.quantity : product.stock;

                                    return (
                                        <Card key={ product.id }
                                              className="cursor-pointer hover:shadow-md transition-shadow p-0 gap-0">
                                            <picture>
                                                <img
                                                    onClick={ () => {
                                                        setIsOpen(prev => {
                                                            return !prev
                                                        })
                                                        setIsProduct(product)
                                                    } }
                                                    src={ product.image }
                                                    alt={ product.name }
                                                    className="w-full h-40 object-contain rounded  bg-white"
                                                />
                                            </picture>
                                            <CardContent className="p-4 md:p-6">
                                                <h3 className="font-medium text-sm mb-1">{ product.name }</h3>
                                                <p className="text-xs text-muted-foreground mb-2">{ product.category }</p>
                                                <div className="flex justify-between items-center">
                                                                <span
                                                                    className="font-bold text-sm">{ formatRupiah(product.price) }</span>
                                                    <Button size="sm"
                                                            onClick={ () => addToCart(product) }
                                                            disabled={ remainingStock <= 0 }

                                                    >
                                                        <Plus className="h-3 w-3"/>
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">Stok: { remainingStock }</p>
                                            </CardContent>
                                        </Card>
                                    )
                                }) }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cart & Checkout */ }
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Keranjang Belanja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 ">
                                <ProductCart cartItems={ cartItems }
                                             removeFromCartAction={ removeFromCart }
                                             decrementItemAction={ decrementItem }
                                             incrementItemAction={ incrementItem }
                                             getProductStockAction={ getProductStock }
                                />
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center font-bold">
                                        <span>Total:</span>
                                        <span>{ formatRupiah(getTotalCart()) }</span>
                                    </div>
                                </div>


                                <Button className="w-full" size="lg"
                                        disabled={ loading }
                                        onClick={ onTransaction }
                                >
                                    <ShoppingCart
                                        className="h-4 w-4 mr-2"/>
                                    { loading ? "Loading ...." : 'Checkout' }
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// @ts-ignore
export function ProductCart(
    {
        cartItems,
        decrementItemAction,
        incrementItemAction,
        getProductStockAction,
        removeFromCartAction
    }: {
        cartItems: CartItem[],
        decrementItemAction: (id: string) => void,
        incrementItemAction: (id: string) => void,
        getProductStockAction: (id: string) => number,
        removeFromCartAction: (productId: string) => void
    }) {

    if (cartItems.length === 0) {
        return <p className="text-muted-foreground text-center py-4">Keranjang kosong</p>
    }
    return cartItems.map((product) => {
            return (
                <div key={ product.id }
                     className="flex justify-between items-center py-2 border-b xl:flex-col xl:items-start">
                    <div className="flex-1">
                        <p className="font-medium text-sm">{ product.name }</p>
                        <p className="text-xs text-muted-foreground">
                            { product.quantity } x { formatRupiah(product.price) }
                        </p>
                    </div>

                    <div className="flex items-center space-x-2">

                        {/* Total price */ }
                        <span
                            className="font-medium text-sm">{ formatRupiah(product.price * product.quantity) }</span>
                        {/* Counter */ }
                        <div className="grid grid-cols-4 gap-2">
                            <Button
                                size={ 'sm' }
                                onClick={ () => decrementItemAction(product.id) }
                                disabled={ product.quantity <= 1 }
                            >
                                <MinusIcon/>
                            </Button>
                            <Button
                                size={ 'sm' }
                                variant={ 'ghost' }>{ product.quantity }</Button>
                            <Button
                                size={ 'sm' }
                                onClick={ () => incrementItemAction(product.id) }
                                disabled={ product.quantity >= getProductStockAction(product.id) }
                            >
                                <PlusIcon/>
                            </Button>

                            {/* Delete button */ }
                            <Button size="sm" variant="outline"
                                    onClick={ () => removeFromCartAction(product.id) }>
                                <Trash2 className="h-3 w-3"/>
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    )
}

