"use client"

import { ProductPaging, ProductPreorder } from "@/action/product-action";
import { ProductsFilter } from "@/app/admin/products/products-page";
import { ProductPending } from "@/app/user/home/page"
import { ProductDetailDialogOnly } from "@/components/page/product-detail-dialog-only";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CartItem, SessionUserPayload } from "@/interface/actionType";
import { formatRupiah } from "@/lib/formatter";
import { toastResponse } from "@/lib/helper";
import { Market } from "@/lib/validation";
import { useCartStore } from "@/store/use-cart-store";
import { useSaleStore } from "@/store/use-sale-store";
import { MinusIcon, Plus, PlusIcon, ShoppingCart, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState, useTransition } from "react"

export function ProductUserPage(
    {
        marketIdProps,
        productPending,
        session,
        products,
        markets
    }: {
        marketIdProps?: string;
        markets: Market[],
        productPending: ProductPending
        session: SessionUserPayload
        products: ProductPaging,

    }) {
    const router = useRouter()
    const [ isPending, startTransition ] = useTransition()
    const [ isProduct, setIsProduct ] = useState<ProductPreorder | null>(null)
    const [ isOpen, setIsOpen ] = useState(false)
    const [ marketId, setMarketId ] = useState<string | undefined>(marketIdProps)
    const currentMarket = markets.find(i => i.id === marketId)
    const {
        cartItems,
        incrementItem,
        decrementItem,
        removeFromCart,
        addToCart,
        setCartItems,
        calculateCart
    } = useCartStore();
    const { createSaleUserPending, createSaleUserAction } = useSaleStore()
    const { total } = calculateCart()
    useEffect(() => {
        if (productPending?.current) {
            setCartItems(productPending.current);
        }
    }, [ productPending, setCartItems ]);

    async function onTransaction() {
        startTransition(async () => {
            if (productPending.isPending) {
                if (productPending.data) {
                    toastResponse({ response: await createSaleUserPending(cartItems, productPending.data), })
                }
            } else if (marketId) {
                toastResponse({ response: await createSaleUserAction(cartItems, marketId) })
            }
        })
    }

    const getProductStock = useCallback((id: string) => {
        return products.data.find(product => product.id === id)?.stock || 0;
    }, [ products ])

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
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold mb-6">User Home { session.name }</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>Market { currentMarket?.name ?? '' }</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Select Market</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuRadioGroup value={ marketId } onValueChange={ setMarketId }>
                            { markets.map(i => (
                                <DropdownMenuRadioItem key={ i.id }
                                                       value={ i.id }
                                                       onClick={ () => {
                                                           router.push(`/user/home?shopId=${ i.id }`)
                                                       } }
                                >{ i.name } - { i.location }</DropdownMenuRadioItem>
                            )) }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 space-y-6  xl:space-y-0 xl:space-x-6  ">
                {/* Product Selection */ }
                <div className="lg:col-span-2 ">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Produk</CardTitle>
                            <ProductsFilter products={ products.data }/>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                                { products.data.map((product) => {
                                    const actualStockProduct = product.PreOrders.reduce((sum, item) => sum + item.quantity, 0)
                                    const cartItem = cartItems.find(item => item.id === product.id);
                                    // const remainingStock = cartItem ? product.stock - cartItem.quantity : product.stock;
                                    const remainingStock = cartItem ? actualStockProduct - cartItem.quantity : actualStockProduct;

                                    return (
                                        <Card key={ product.id }
                                              className="cursor-pointer hover:shadow-md transition-shadow p-0 gap-0">
                                            <picture>
                                                <img
                                                    onClick={ () => {
                                                        setIsOpen(prev => !prev)
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
                                                {/*<div className={ 'flex flex-wrap gap-1' }>{ product.PreOrders.map(i =>*/ }
                                                {/*    <Badge*/ }
                                                {/*        key={ i.id }> { i.Shop.name }: { i.quantity }*/ }
                                                {/*    </Badge>*/ }
                                                {/*) }*/ }
                                                {/*</div>*/ }
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
                                        <span>{ formatRupiah(total) }</span>
                                    </div>
                                </div>


                                {/*<SelectOption*/ }
                                {/*    name="workIn_shopId"*/ }
                                {/*    label="Shop"*/ }
                                {/*    placeholder="Select a shop"*/ }
                                {/*    value={ shopId }*/ }
                                {/*    onChangeAction={ (e) => setShopId(e) }*/ }
                                {/*    options={ shops.map((s) => ({*/ }
                                {/*        label: s.name,*/ }
                                {/*        value: s.id,*/ }
                                {/*    })) }*/ }
                                {/*/>*/ }

                                <Button className="w-full" size="lg"
                                        disabled={ isPending }
                                        onClick={ onTransaction }
                                >
                                    <ShoppingCart
                                        className="h-4 w-4 mr-2"/>
                                    { isPending ? "Loading ...." : 'Checkout' }
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

