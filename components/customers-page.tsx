'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Edit, Eye, Plus, SearchIcon, Users, XIcon } from "lucide-react"
import { MemberTier } from "@/lib/data";
import { calculateAverage, formatDateIndo, formatRupiah, toastResponse } from "@/lib/my-utils";
import { FormProvider, useForm } from "react-hook-form";
import { CustomerModel } from "@/lib/generated/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputDateForm, InputForm, SelectForm } from "@/components/form-hook";
import { CustomerModelComplete } from "@/lib/schema";
import { createCustomer, CustomerRelational, deleteCustomer, updateCustomer } from "@/action/customer-action";
import { useState } from "react";

interface CustomersPageProps {
    customers: CustomerRelational[],
    members: MemberTier[]
}

function VerificationAge(props: { length: number, filter: CustomerRelational[], numbers: any[] }) {
    return <>
        {/* Age Verification System */ }
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2"/>
                    Sistem Verifikasi Umur
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium mb-4">Pengaturan Verifikasi</h3>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="require-id" defaultChecked/>
                                <Label htmlFor="require-id">Wajib verifikasi KTP</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="photo-verification"/>
                                <Label htmlFor="photo-verification">Verifikasi foto</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="age-reminder" defaultChecked/>
                                <Label htmlFor="age-reminder">Reminder umur di setiap transaksi</Label>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium mb-4">Statistik Verifikasi</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Total pelanggan terverifikasi:</span>
                                <span className="font-medium">{ props.length }</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Verifikasi ditolak bulan ini:</span>
                                <span
                                    className="font-medium text-red-600">{ props.filter.length }</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Rata-rata umur pelanggan:</span>
                                <span
                                    className="font-medium">{ calculateAverage(props.numbers) } tahun</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </>;
}

export function CustomersPage({ customers, members }: CustomersPageProps) {
    const [ selectStatusCustomer, setSelectStatusCustomer ] = useState('all')
    const [ searchTerm, setSearchTerm ] = useState("")
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(6);

    const filteredCustomer = customers.filter((customer: CustomerRelational) => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectStatusCustomer === "all" ||
            customer.status === selectStatusCustomer;

        return matchesSearch && matchesCategory;
    });
    const totalPages = Math.ceil(filteredCustomer.length / itemsPerPage);
    const paginatedCustomer = filteredCustomer.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manajemen Pelanggan</h1>
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

                        <Select defaultValue="all" onValueChange={ setSelectStatusCustomer }>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="verified">Valid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="rejected">Ditolak</SelectItem>
                            </SelectContent>
                        </Select>

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
                                                            toastResponse({ response: await deleteCustomer(customer.id) })
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
                    <div className="grid grid-cols-2 gap-4">

                        <section>
                            <h3 className="text-lg font-semibold mt-4">Sales History</h3>
                            <ul className="mt-2 space-y-2 h-96 overflow-y-auto">
                                { customer.Sales.map(sale => (
                                    <li key={ sale.id } className="border p-2 rounded shadow-sm">
                                        <div><strong>Date:</strong> { formatDateIndo(sale.date) }</div>
                                        <div><strong>Total:</strong> { formatRupiah(sale.total) }</div>
                                        <div><strong>Items:</strong> { sale.items }</div>
                                    </li>
                                )) }
                                { customer.Sales.length === 0 &&
										<p className="text-gray-500 italic">No sales data.</p> }
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold mt-4">Pre-Orders</h3>
                            <ul className="mt-2 space-y-2 h-96 overflow-y-auto">
                                { customer.PreOrders.map(po => (
                                    <li key={ po.id } className="border p-2 rounded shadow-sm">
                                        <div><strong>Product:</strong> { po.product.name }</div>
                                        <div><strong>Quantity:</strong> { po.quantity }</div>
                                        <div><strong>Estimated
                                            Date:</strong> { new Date(po.estimatedDate).toLocaleDateString() }</div>
                                        <div><strong>Status:</strong> { po.status }</div>
                                    </li>
                                )) }
                                { customer.PreOrders.length === 0 &&
										<p className="text-gray-500 italic">No pre-orders.</p> }
                            </ul>
                        </section>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ModalTambahCustomer() {
    const [ open, setOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const methods = useForm<CustomerModelComplete>({
        resolver: zodResolver(CustomerModel),
        defaultValues: {
            id: 0,
            name: "",
            age: 0,
            totalPurchase: 0,
            status: "pending",
            lastPurchase: new Date(),
        },
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        setLoading(true)
        toastResponse({
                response: await createCustomer(data),
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

export function ModalEditCustomer({ customer }: { customer: CustomerModelComplete }) {
    const [ open, setOpen ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const methods = useForm<CustomerModelComplete>({
        resolver: zodResolver(CustomerModel),
        defaultValues: customer
    });

    const onSubmit = methods.handleSubmit(async (data) => {
        setLoading(true)
        toastResponse({
                response: await updateCustomer(data),
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