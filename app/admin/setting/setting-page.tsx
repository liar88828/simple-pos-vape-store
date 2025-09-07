"use client"

import {
    saveSettingInventory,
    saveSettingPayment,
    saveSettingShipping,
    saveSettingStore,
    saveStoreLogo
} from "@/app/admin/setting/setting-action";
import { InputForm, SelectForm, SwitchForm, SwitchOnlyForm, TextareaForm } from "@/components/mini/form-hook";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { toastResponse } from "@/lib/helper";
import {
    InventorySetting,
    InventorySettingSchema,
    PaymentSettingWithRelations,
    ShippingSettingWithRelations,
    Store,
    StoreOptionalDefaults,
    StoreOptionalDefaultsSchema
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Plus, Trash2, Upload } from "lucide-react";
import React, { useState, useTransition } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

export default function SettingPage(
    { store, shipping, inventory, payment }:
    {
        store: Store | null,
        inventory: InventorySetting | null,
        shipping: ShippingSettingWithRelations | null,
        payment: PaymentSettingWithRelations | null
    }) {
    return (
        <div className="p-6 w-full mx-auto h-screen">
            <div className="flex  max-w-7xl flex-col gap-6">
                <Tabs defaultValue="store">
                    <TabsList>
                        <TabsTrigger value="store">Store</TabsTrigger>
                        <TabsTrigger value="payment">Pembayaran</TabsTrigger>
                        <TabsTrigger value="shipping">Pengiriman</TabsTrigger>
                        <TabsTrigger value="inventory">Penyimpanan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="store"><RenderStoreSection data={ store }/></TabsContent>
                    <TabsContent value="payment"><RenderPaymentSection data={ payment }/></TabsContent>
                    <TabsContent value="shipping"><RenderShippingSection data={ shipping }/></TabsContent>
                    <TabsContent value="inventory"><RenderInventorySection data={ inventory }/></TabsContent>

                </Tabs>
            </div>
        </div>
    )
}

export function RenderStoreSection({ data }: { data: Store | null }) {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ logoPreview, setLogoPreview ] = useState<string>('http://localhost:3000/logo.png');
    const [ logoImage, setLogoImage ] = useState<File | null>(null);

    const methods = useForm<StoreOptionalDefaults>({
        resolver: zodResolver(StoreOptionalDefaultsSchema),
        defaultValues: {
            id: data?.id ?? undefined,
            name: data?.name ?? '',
            currency: data?.currency ?? 'IDR',
            description: data?.description ?? '',
            phone: data?.phone ?? '',
            email: data?.email ?? '',
            address: data?.address ?? '',
        } satisfies StoreOptionalDefaults
    });
    console.log(methods.formState.errors)
    const onSubmit = methods.handleSubmit(async (dataStore) => {
        toastResponse({
            onFinish: () => setIsLoading(false),
            onSuccess: async () => await saveStoreLogo(logoImage),
            onStart: () => setIsLoading(true),
            response: await saveSettingStore(dataStore)
        })

    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoImage(file)
            const imageUrl = URL.createObjectURL(file);
            setLogoPreview(imageUrl);

        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Store</CardTitle>
                <CardDescription>
                    Make changes to your account here. Click save when you&apos;re
                    done.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider { ...methods }>
                    <div className="space-y-4">

                        <InputForm name="name" title="Nama Toko" placeholder="Nama Toko"/>
                        <SelectForm
                            name="currency"
                            label="Currency"
                            placeholder="Pilih Mata Uang"
                            options={ [
                                { value: 'IDR', label: 'IDR - Indonesia Rupiah' },
                                { value: 'USD', label: 'USD - US Dollar' },
                                { value: 'EUR', label: 'EUR - Euro' },
                                { value: 'GBP', label: 'GBP - British Pound' },
                                { value: 'JPY', label: 'JPY - Japanese Yen' },
                            ] }
                        />
                        <TextareaForm name="description" title="Deskripsi" placeholder="Toko Deskripsi"/>
                        <InputForm name="phone" title="No HP" placeholder="Nomor Telephone/WA"/>
                        <InputForm name="email" title="Alamat Email" placeholder="Masukan Alamat Email"/>
                        <TextareaForm name="address" title="Alamat Toko" placeholder="Masukan Alamat Toko"/>
                        {/* Store logo upload with preview */ }
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
                            <div className="flex sm:flex-row sm:items-end flex-col gap-4 ">
                                <div
                                    className=" w-36 h-36 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center">
                                    { logoPreview ? (
                                        <picture>
                                            <img
                                                src={ logoPreview }
                                                alt="Logo Preview"
                                                className="object-cover w-full h-full "
                                            />
                                        </picture>
                                    ) : (
                                        <Upload className="size-6 text-gray-400"/>
                                    ) }
                                </div>

                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={ handleImageChange }
                                />
                            </div>
                        </div>

                    </div>
                </FormProvider>
            </CardContent>
            <CardFooter>
                <Button disabled={ isLoading }
                        onClick={ onSubmit }>Save changes</Button>
            </CardFooter>
        </Card>
    );
}

export function RenderPaymentSection({ data }: { data: PaymentSettingWithRelations | null }) {
    const [ isPending, startTransition ] = useTransition()
    const [ isCod, setIsCod ] = useState(data?.isCod ?? false)
    const [ isTax, setIsTax ] = useState(data?.isTax ?? false)

    const methods = useForm<PaymentSettingWithRelations>({
        // resolver: zodResolver(RelatedPaymentModel),
        defaultValues: {
            id: data?.id ?? '',
            isCod: data?.isCod ?? false,
            isTax: data?.isTax ?? false,
            valueCod: data?.valueCod ?? 0,
            valueTax: data?.valueTax ?? 0,
            PaymentList: data?.PaymentList ?? [ {
                value: "",
                fee: 0,
                id: "",
                title: "",
                paymentId: "",
                rekening: ""
            } ]
            //[ { value: "", fee: 0, id: "", title: "", paymentId: "" } ]
        } satisfies PaymentSettingWithRelations
    });

    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: 'PaymentList'
    })

    const onSubmit = methods.handleSubmit(async (dataPayment) => {
        startTransition(async () => {
            toastResponse({
                response: await saveSettingPayment(dataPayment),
            })
        })
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pembayaran </CardTitle>
                <CardDescription>
                    Change your pembayaran here. After saving, you&apos;ll be logged
                    out.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider { ...methods }>
                    <div className="space-y-6 ">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">Payment list</h4>
                                <Button type="button" size="sm"
                                        onClick={ () => append({
                                            id: '',
                                            title: '',
                                            value: '',
                                            fee: 0,
                                            rekening: "",
                                            paymentId: '',
                                        }) }>
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Add Method
                                </Button>
                            </div>

                            <div className="space-y-3 w-full">
                                { fields.map((field, index) => (
                                    <div key={ field.id }
                                         className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-lg ">
                                        <InputForm name={ `PaymentList.${ index }.title` } title="Name"
                                                   placeholder="Shipping Method"/>
                                        <InputForm name={ `PaymentList.${ index }.value` } title="Rekening"

                                                   placeholder="No"/>
                                        <InputForm name={ `PaymentList.${ index }.rekening` } title="Rekening"
                                                   placeholder="No"/>

                                        <InputForm name={ `PaymentList.${ index }.fee` } title="Biaya"
                                                   type={ 'number' } placeholder="biaya"/>

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={ () => remove(index) }
                                            className="mt-2 md:mt-0 w-auto"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                )) }
                            </div>
                        </div>


                        {/* Cash on Delivery */ }
                        <div className="flex items-center justify-between mb-4 ">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-green-600"/>
                                </div>
                                <div>
                                    <h4 className="font-medium">Cash on Delivery</h4>
                                    <p className="text-sm text-gray-500">Pay when you receive</p>
                                </div>
                            </div>
                            <SwitchOnlyForm name={ 'isCod' } onChange={ setIsCod }/>
                        </div>
                        <InputForm name={ 'valueCod' } type={ "number" } title={ 'COD Fee' }
                                   disabled={ !isCod }
                                   placeholder={ 'Pembayaran COD Fee' }/>

                        {/* Tax */ }
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-600"/>
                                </div>
                                <div>
                                    <h4 className="font-medium">Tax</h4>
                                    <p className="text-sm text-gray-500">Additional tax fee</p>
                                </div>
                            </div>
                            <SwitchOnlyForm name={ "isTax" } onChange={ setIsTax }/>
                        </div>
                        <InputForm
                            name={ "valueTax" }
                            type={ "number" }
                            title={ "Tax Fee" }
                            disabled={ !isTax }
                            placeholder={ "Masukkan Tax Fee" }
                        />

                    </div>
                </FormProvider>
            </CardContent>
            <CardFooter>
                <Button disabled={ isPending }
                        onClick={ onSubmit }>Save Pembayaran</Button>
            </CardFooter>
        </Card>
    );
}

export function RenderShippingSection({ data }: { data: ShippingSettingWithRelations | null }) {
    const [ isLoading, setIsLoading ] = useState(false)
    const [ addInternational, setAddInternational ] = useState(false)
    const methods = useForm<ShippingSettingWithRelations>({
        defaultValues: {
            id: data?.id ?? '',
            freeShippingThreshold: data?.freeShippingThreshold ?? 0,
            handlingFee: data?.handlingFee ?? 0,
            internationalShipping: data?.internationalShipping ?? false,
            internationalRate: data?.internationalRate ?? 0,
            ShippingList: data?.ShippingList ?? [ { shippingId: "", id: "", name: '', price: 0, rates: 0, } ]
            //     data.ShippingList.map(item => (
            //     {
            //         shippingId: item.shippingId ?? "",
            //         id: item.id ?? "",
            //         name: item.name ?? '',
            //         price: item.price ?? 0,
            //         rates: item.rates ?? 0,
            //     }
            // ))
            // [ { shippingId: "", id: "", name: '', price: 0, rates: 0, } ]
        }

    });
    const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: 'ShippingList'
    })
    const onSubmit = methods.handleSubmit(async (dataShipping) => {
        toastResponse({
            onStart: () => setIsLoading(true),
            response: await saveSettingShipping(dataShipping),
            onFinish: () => setIsLoading(false)
        })

    });
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pengiriman</CardTitle>
                <CardDescription>
                    Make changes to your account here. Click save when you&apos;re
                    done.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider { ...methods }>
                    <div className={ 'space-y-4' }>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputForm name={ 'freeShippingThreshold' }
                                       title={ 'Free Shipping Threshold' }
                                       placeholder="Shipping method"
                                       type={ 'number' }
                            />
                            <InputForm name={ 'handlingFee' }
                                       title={ 'Handling Fee (Rp)' }
                                       placeholder="Shipping method"
                                       type={ 'number' }
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">Domestic Shipping Rates</h4>
                                <Button type="button" size="sm"
                                        onClick={ () => append({
                                            name: '',
                                            price: 0,
                                            rates: 0,
                                            shippingId: '',
                                            id: ""
                                        }) }>
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Add Method
                                </Button>
                            </div>

                            <div className="space-y-3">
                                { fields.map((field, index) => (
                                    <div key={ field.id }
                                         className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-lg">
                                        <InputForm name={ `ShippingList.${ index }.name` } title="Name"
                                                   placeholder="Shipping Method"/>
                                        <InputForm name={ `ShippingList.${ index }.price` } type={ 'number' }
                                                   title="Price"
                                                   placeholder="Price"/>
                                        <InputForm name={ `ShippingList.${ index }.rates` } title="Rates"
                                                   type={ 'number' }
                                                   placeholder="Rates"/>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={ () => remove(index) }
                                            className="mt-2 md:mt-0"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                )) }
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium text-gray-900">International Shipping</p>
                                <p className="text-sm text-gray-500">Enable shipping to international destinations</p>
                            </div>
                            <SwitchOnlyForm name={ 'internationalShipping' } onChange={ setAddInternational }/></div>
                        <InputForm
                            disabled={ !addInternational }
                            type={ 'number' }
                            name={ 'internationalRate' }
                            title={ 'International Rate (Rp)' }
                            placeholder="Shipping method"
                        />
                    </div>
                </FormProvider>
            </CardContent>
            <CardFooter>
                <Button disabled={ isLoading } onClick={ onSubmit }>Save Pengiriman</Button>
            </CardFooter>
        </Card>
    )
}

export function RenderInventorySection({ data }: { data: InventorySetting | null }) {
    const methods = useForm<InventorySetting>({
        resolver: zodResolver(InventorySettingSchema),
        defaultValues: {
            id: data?.id ?? '',
            allowBackorders: data?.allowBackorders ?? false,
            autoReorder: data?.autoReorder ?? false,
            lowStockThreshold: data?.lowStockThreshold ?? 0,
            trackInventory: data?.trackInventory ?? false,
        } satisfies InventorySetting
    });

    const onSubmit = methods.handleSubmit(async (dataInventory) => {
        toastResponse({
            response: await saveSettingInventory(dataInventory),
        });
    })


    return (
        <Card>
            <CardHeader>
                <CardTitle>Penyimpanan</CardTitle>
                <CardDescription>
                    Make changes to your account here. Click save when you&apos;re
                    done.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormProvider { ...methods }>
                    <div className={ 'space-y-4' }>

                        <SwitchForm name={ 'trackInventory' }
                                    title={ 'Track Inventory' }
                                    description={ 'Monitor stock levels for products' }/>

                        <InputForm name={ 'lowStockThreshold' }
                                   title={ 'Low Stock Threshold' } type={ 'number' }
                                   description={ 'Get notified when stock falls below this number' }/>


                        <SwitchForm name={ 'allowBackorders' }
                                    title={ 'Allow Backorders' }
                                    description={ 'Allow customers to order out-of-stock items' }/>

                        <SwitchForm name={ 'autoReorder' }
                                    title={ 'Auto Reorder' }
                                    description={ 'Automatically reorder products when low stock' }
                        />
                    </div>
                </FormProvider>
            </CardContent>
            <CardFooter>
                <Button onClick={ onSubmit }>Save changes</Button>
            </CardFooter>
        </Card>)

}

// const renderNotificationsSection = () => (
//     <div className="space-y-6">
//         <div>
//             <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
//             <div className="space-y-4">
//                 <div className="flex items-center justify-between py-3">
//                     <div>
//                         <p className="font-medium text-gray-900">Order Confirmations</p>
//                         <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
//                     </div>
//                     <Switch
//                         checked={ settings.notifications.orderConfirmation }
//                         onChange={ (value) => updateSetting('notifications', 'orderConfirmation', value) }
//                     />
//                 </div>
//
//                 <div className="flex items-center justify-between py-3">
//                     <div>
//                         <p className="font-medium text-gray-900">Low Stock Alerts</p>
//                         <p className="text-sm text-gray-500">Receive alerts when inventory is low</p>
//                     </div>
//                     <Switch
//                         checked={ settings.notifications.lowStock }
//                         onChange={ (value) => updateSetting('notifications', 'lowStock', value) }
//                     />
//                 </div>
//
//                 <div className="flex items-center justify-between py-3">
//                     <div>
//                         <p className="font-medium text-gray-900">New Customer Registrations</p>
//                         <p className="text-sm text-gray-500">Get notified about new customer signups</p>
//                     </div>
//                     <Switch
//                         checked={ settings.notifications.newCustomer }
//                         onChange={ (value) => updateSetting('notifications', 'newCustomer', value) }
//                     />
//                 </div>
//
//                 <div className="flex items-center justify-between py-3">
//                     <div>
//                         <p className="font-medium text-gray-900">Daily Sales Report</p>
//                         <p className="text-sm text-gray-500">Receive daily sales summary</p>
//                     </div>
//                     <Switch
//                         checked={ settings.notifications.dailyReport }
//                         onChange={ (value) => updateSetting('notifications', 'dailyReport', value) }
//                     />
//                 </div>
//
//                 <div className="flex items-center justify-between py-3">
//                     <div>
//                         <p className="font-medium text-gray-900">Weekly Sales Report</p>
//                         <p className="text-sm text-gray-500">Receive weekly sales analysis</p>
//                     </div>
//                     <Switch
//                         checked={ settings.notifications.weeklyReport }
//                         onChange={ (value) => updateSetting('notifications', 'weeklyReport', value) }
//                     />
//                 </div>
//             </div>
//         </div>
//     </div>
// );
