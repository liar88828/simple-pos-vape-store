'use client'

import {
    createCustomerAction,
    CustomerRelational,
    deleteCustomerAction,
    updateCustomerAction
} from "@/app/admin/customers/customers-action";
import { InputDateForm, InputForm, SelectForm } from "@/components/mini/form-hook";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { STATUS_USER } from "@/lib/constants";
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import { toastResponse } from "@/lib/helper";
import { Customer, CustomerOptionalDefaults, CustomerOptionalDefaultsSchema, CustomerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Edit, Eye, Plus, SearchIcon, XIcon } from "lucide-react"
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

export function CustomersPage({ customers, }: {
    customers: CustomerRelational[],
}) {
    // const [ selectStatusCustomer, setSelectStatusCustomer ] = useState('all')
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(6);

    const filteredCustomer = customers.filter((customer: CustomerRelational) => {
        return customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    });

    const totalPages = Math.ceil(filteredCustomer.length / itemsPerPage);

    const paginatedCustomer = filteredCustomer.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-3xl font-bold">Manajemen Pelanggan</h1>
                <ModalTambahCustomer/>
            </div>

            {/*<VerificationAge length={ customers.length }*/ }
            {/*                 filter={ customers.filter(item => item.status === 'rejected') }*/ }
            {/*                 numbers={ customers.map(item => item.age) }/>*/ }


            {/* Customer List */ }
            {/* min-w-2xl m-auto */ }
            <Card className="mb-6 ">
                <CardHeader>
                    <CardTitle>Daftar Pelanggan</CardTitle>
                    <div className="flex justify-between">
                        <div className="flex w-full max-w-sm items-center gap-2">
                            <Input value={ searchTerm }
                                   onChange={ (e) => setSearchTerm(e.target.value) }
                                   placeholder="Cari pelanggan..."
                                   className="max-w-sm"/>
                            <Button type="button" variant="outline">
                                <SearchIcon/>
                            </Button>
                        </div>

                        {/*<Select defaultValue="all" onValueChange={ setSelectStatusCustomer }>*/ }
                        {/*    <SelectTrigger className="w-40">*/ }
                        {/*        <SelectValue placeholder="Status"/>*/ }
                        {/*    </SelectTrigger>*/ }
                        {/*    <SelectContent>*/ }
                        {/*        <SelectItem value="all">Semua</SelectItem>*/ }
                        {/*        <SelectItem value="verified">Valid</SelectItem>*/ }
                        {/*        <SelectItem value="pending">Pending</SelectItem>*/ }
                        {/*        <SelectItem value="rejected">Ditolak</SelectItem>*/ }
                        {/*    </SelectContent>*/ }
                        {/*</Select>*/ }

                    </div>
                </CardHeader>
                <CardContent>
                    <Table >
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-28">Nama</TableHead>
                                <TableHead className="min-w-32">Total Pembelian</TableHead>
                                <TableHead>Terakhir Belanja</TableHead>
                                <TableHead>Aksi</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            { paginatedCustomer
                            .map((customer) => (
                                <TableRow key={ customer.id }>
                                    <TableCell>{ customer.name }</TableCell>
                                    <TableCell>{ formatRupiah(customer.totalPurchase) }</TableCell>
                                    <TableCell>{ formatDateIndo(customer.lastPurchase) }</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <CustomerDetailDialog customer={ customer }/>
                                            <ModalEditCustomer customer={ customer }/>
                                            <Button size="sm" variant="outline"
                                                    onClick={ async () => {
                                                        if (confirm('Are you Sure to Delete ?')) {
                                                            toastResponse({ response: await deleteCustomerAction(customer.id) })
                                                        }
                                                    } }
                                            >
                                                <XIcon className="h-3 w-3"/>
                                            </Button>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={ 2 }> </TableCell>
                                <TableCell>
                                    <Select value={ String(itemsPerPage) } onValueChange={ (value) => {
                                        setItemsPerPage(Number(value));
                                        setCurrentPage(1); // Reset ke halaman pertama
                                    } }>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tampil"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="6">6</SelectItem>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="15">15</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell
                                    className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        disabled={ currentPage === 1 }
                                        onClick={ () => setCurrentPage((prev) => prev - 1) }
                                    >
                                        <ChevronLeft/>
                                    </Button>

                                    <Button variant="outline" disabled={ true }>
                                        { currentPage } / { totalPages }
                                    </Button>

                                    <Button
                                        variant="outline"
                                        disabled={ currentPage === totalPages }
                                        onClick={ () => setCurrentPage((prev) => prev + 1) }
                                    >
                                        <ChevronRight/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}

export function CustomerDetailDialog({ customer }: { customer: CustomerRelational }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3"/>
                </Button>
            </DialogTrigger>

            <DialogContent className=" max-w-3xl md:min-w-2xl">
                <DialogHeader>
                    <DialogTitle>Customer Detail: { customer.name }</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 ">
                    <section className="grid grid-cols-2 gap-4">
                        <div><strong>Name:</strong> { customer.name }</div>
                        <div><strong>Age:</strong> { customer.age }</div>
                        <div><strong>Status:</strong> { customer.status }</div>
                        <div><strong>Total Purchase:</strong> { formatRupiah(customer.totalPurchase) }</div>
                        <div><strong>Last Purchase:</strong> { formatDateIndo(customer.lastPurchase) }</div>
                    </section>

                    <section>
                        <h3 className="text-lg font-semibold mt-4">Sales History</h3>

                        { customer.Sales.length === 0 ? (
                            <p className="text-gray-500 italic mt-2">No sales data.</p>
                        ) : (
                            <div className="overflow-auto h-96 mt-2 border rounded-md">
                                <Table>
                                    <TableHeader className="sticky top-0 bg-muted z-10">
                                        <TableRow>
                                            <TableHead className="w-[150px]">Tanggal</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Jumlah Item</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        { customer.Sales.map((sale) => (
                                            <TableRow key={ sale.id }>
                                                <TableCell>{ formatDateIndo(sale.date) }</TableCell>
                                                <TableCell>{ formatRupiah(sale.total) }</TableCell>
                                                <TableCell>{ sale.items }</TableCell>
                                                <TableCell>
                                                    <Button size={ 'sm' }>
                                                        Proses
                                                    </Button>
                                                    {/*<ModalSalesDetail sale={sale} />*/ }
                                                </TableCell>
                                            </TableRow>
                                        )) }
                                    </TableBody>
                                </Table>
                            </div>
                        ) }
                    </section>


                </div>
            </DialogContent>
        </Dialog>
    );
}

const customerFormCreate = CustomerOptionalDefaultsSchema.merge(z.object({
    userId: z.string().uuid().optional(),
    id: z.string().optional(),
}))

type CustomerFormCreate = z.infer<typeof customerFormCreate>
export function ModalTambahCustomer() {
    const [ open, setOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const methods = useForm<CustomerFormCreate>({
        resolver: zodResolver(customerFormCreate),
        defaultValues: {
            buyer_userId: "",
            name: "",
            age: 0,
            totalPurchase: 0,
            status: STATUS_USER.PENDING,
            lastPurchase: new Date(),
        } satisfies CustomerFormCreate,
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        setLoading(true)
        toastResponse({
            response: await createCustomerAction(data),
                onSuccess: () => {
                    setOpen(false)
                    setLoading(false)
                }
            }
        )

    });

    return (<Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Tambah Pelanggan
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
                </DialogHeader>
                <FormProvider { ...methods }>
                    <form onSubmit={ onSubmit } className="grid gap-4">
                        <InputForm name="name" title="Nama" placeholder="Nama pelanggan"/>
                        <InputForm name="age" title="Umur" placeholder="0" type="number"/>
                        <InputForm name="totalPurchase" title="Total Pembelian" placeholder="0" type="number"/>
                        <InputDateForm name="lastPurchase" title="Tanggal Pembelian Terakhir"
                        />
                        <SelectForm
                            name="status"
                            label="Status"
                            placeholder="Pilih status"
                            options={ [
                                { label: "Valid", value: "verified" },
                                { label: "Pending", value: "pending" },
                                { label: "Ditolak", value: "banned" },
                            ] }
                        />
                        <DialogFooter>
                            <Button type="submit"
                                    disabled={ loading }
                            >{ loading ? 'Loading...' : "Simpan" }
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

export function ModalEditCustomer({ customer }: { customer: CustomerOptionalDefaults }) {
    const [ open, setOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const methods = useForm<Customer>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: customer
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        setLoading(true)
        toastResponse({
            response: await updateCustomerAction(data),
                onSuccess: () => {
                    setOpen(false)
                    setLoading(false)
                }
            }
        )
    });

    return (<Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3"/>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah Pelanggan Baru</DialogTitle>
                </DialogHeader>
                <FormProvider { ...methods }>
                    <form onSubmit={ onSubmit } className="grid gap-4">
                        <InputForm name="name" title="Nama" placeholder="Nama pelanggan"/>
                        <InputForm name="age" title="Umur" placeholder="0" type="number"/>
                        <InputForm name="totalPurchase" title="Total Pembelian" placeholder="0" type="number"/>
                        <InputDateForm name="lastPurchase" title="Tanggal Pembelian Terakhir"
                        />
                        <SelectForm
                            name="status"
                            label="Status"
                            placeholder="Pilih status"
                            options={ [
                                { label: "Valid", value: "verified" },
                                { label: "Pending", value: "pending" },
                                { label: "Ditolak", value: "rejected" },
                            ] }
                        />
                        <DialogFooter>
                            <Button type="submit"
                                    disabled={ loading }
                            >{ loading ? 'Loading...' : "Simpan" }
                            </Button>
                            {/*<Button*/ }
                            {/*    type="button"*/ }
                            {/*    disabled={ loading }*/ }
                            {/*    onClick={ async () => {*/ }
                            {/*        if (confirm('Are you Sure to Delete ?')) {*/ }
                            {/*            toastResponse({ response: await deleteCustomer(customer.id) })*/ }
                            {/*        }*/ }
                            {/*    } }*/ }
                            {/*>*/ }
                            {/*    { loading ? 'Loading...' : "Delete" }*/ }
                            {/*</Button>*/ }


                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
