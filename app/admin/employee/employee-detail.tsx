'use client'
import { GetEmployee, handlerAbsent } from "@/app/admin/employee/employee-action";
import { EmployeeDialog } from "@/app/admin/employee/employee-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { formatDateIndo, formatRupiah } from "@/lib/formatter";
import { Absent, Product } from "@/lib/validation";
import { STATUS_ABSENT } from "@prisma/client";
import { Calendar, CheckCircle, DollarSign, Mail, MapPin, Package, Phone, ShoppingBag, XCircle } from "lucide-react"
import React, { useState, useTransition } from "react"
import { toast } from "sonner";

// Interfaces for type clarity

interface AttendanceRecord {
    datetime: string;
    status: "present" | "absent";
    sold: number;
    revenue: number;
    products: {
        name: string;
        qty: number;
        revenue: number;
    }[];
}

// Months & Years
const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
]

const _attendanceList: AttendanceRecord[] = [
    // === 2024 ===
    {
        datetime: "2024-08-15 08:10:00",
        status: "present",
        sold: 8,
        revenue: 800000,
        products: [ { name: "Shoes", qty: 8, revenue: 800000 } ],
    },
    {
        datetime: "2024-09-02 08:00:00",
        status: "absent",
        sold: 0,
        revenue: 0,
        products: [],
    },
    {
        datetime: "2024-12-20 08:30:00",
        status: "present",
        sold: 12,
        revenue: 1200000,
        products: [ { name: "T-Shirt", qty: 12, revenue: 1200000 } ],
    },

    // 2025 Data
    {
        datetime: "2025-09-01 08:05:00",
        status: "present",
        sold: 15,
        revenue: 1500000,
        products: [
            { name: "T-Shirt", qty: 8, revenue: 400000 },
            { name: "Shoes", qty: 3, revenue: 750000 },
            { name: "Hat", qty: 4, revenue: 350000 },
        ],
    },
    {
        datetime: "2025-09-02 08:10:00",
        status: "absent",
        sold: 0,
        revenue: 0,
        products: [],
    },
    {
        datetime: "2025-09-03 08:00:00",
        status: "present",
        sold: 22,
        revenue: 2200000,
        products: [
            { name: "Shoes", qty: 10, revenue: 1500000 },
            { name: "Hat", qty: 12, revenue: 700000 },
        ],
    },
    {
        datetime: "2025-09-04 08:15:00",
        status: "present",
        sold: 10,
        revenue: 1000000,
        products: [
            { name: "T-Shirt", qty: 5, revenue: 250000 },
            { name: "Shoes", qty: 5, revenue: 750000 },
        ],
    },
    {
        datetime: "2025-09-05 08:08:00",
        status: "present",
        sold: 18,
        revenue: 1850000,
        products: [
            { name: "Hat", qty: 8, revenue: 450000 },
            { name: "T-Shirt", qty: 10, revenue: 1400000 },
        ],
    },
    {
        datetime: "2025-09-06 08:02:00",
        status: "absent",
        sold: 0,
        revenue: 0,
        products: [],
    },
    {
        datetime: "2025-09-07 08:07:00",
        status: "present",
        sold: 30,
        revenue: 3500000,
        products: [
            { name: "Shoes", qty: 15, revenue: 2250000 },
            { name: "T-Shirt", qty: 15, revenue: 1250000 },
        ],
    },
    {
        datetime: "2025-09-08 08:01:00",
        status: "present",
        sold: 12,
        revenue: 1100000,
        products: [
            { name: "Hat", qty: 7, revenue: 400000 },
            { name: "T-Shirt", qty: 5, revenue: 700000 },
        ],
    },
    {
        datetime: "2025-09-09 08:09:00",
        status: "present",
        sold: 25,
        revenue: 2500000,
        products: [
            { name: "Shoes", qty: 25, revenue: 2500000 },
        ],
    },

    // 2026 Data
    {
        datetime: "2026-01-10 09:00:00",
        status: "present",
        sold: 5,
        revenue: 550000,
        products: [
            { name: "T-Shirt", qty: 3, revenue: 300000 },
            { name: "Hat", qty: 2, revenue: 250000 },
        ],
    },
    {
        datetime: "2026-01-11 08:45:00",
        status: "present",
        sold: 15,
        revenue: 1750000,
        products: [
            { name: "Shoes", qty: 8, revenue: 1200000 },
            { name: "T-Shirt", qty: 7, revenue: 550000 },
        ],
    },
    {
        datetime: "2026-01-12 09:15:00",
        status: "absent",
        sold: 0,
        revenue: 0,
        products: [],
    },
    {
        datetime: "2026-01-13 08:30:00",
        status: "present",
        sold: 8,
        revenue: 900000,
        products: [
            { name: "Shoes", qty: 2, revenue: 300000 },
            { name: "Hat", qty: 6, revenue: 600000 },
        ],
    },
];
type AttendanceStatus = "present" | "absent"

interface AttendanceRecord {
    datetime: string
    status: AttendanceStatus
    sold: number
    revenue: number
}

export default function EmployeeDetail(
    { employee, products, absent }: {
        todayAbsent: number
        absent: Absent[]
        employee: GetEmployee,
        products: Product[],
    }) {
    // const [ selectedRecord, setSelectedRecord ] = useState<AttendanceRecord['products'] | null>(null)

    return (
        <div className="flex p-6 gap-6 flex-col">
            <EmployeeDetailCard employee={ employee }/>
            <EmployeeTableRecord absent={ absent }/>
            <SoldProductsCard products={ products }/>
        </div>
    )
}

export function EmployeeDetailCard({ employee, }: { employee: GetEmployee, }) {
    const [ isOpen, setIsOpen ] = useState(false);

    return (
        <>
            <EmployeeDialog
                open={ isOpen }
                onOpenChange={ setIsOpen }
                employee={ employee }
            />

            <Card className="w-full shadow-lg rounded-2xl">
                <div className="flex p-6 w-full">
                    {/* Avatar Section */ }
                    <div className="flex flex-col items-center mr-6">
                        <Avatar className="h-24 w-24 mb-3">
                            <AvatarImage src={ employee.img ?? 'https://randomuser.me/api/portraits/men/10.jpg' }
                                         alt="Employee Photo"/>
                            <AvatarFallback>EM</AvatarFallback>
                        </Avatar>
                        <Button
                            onClick={ () => setIsOpen(true) }
                            className="mt-2 w-full">Edit Profile
                        </Button>

                    </div>

                    {/* Info Section */ }
                    <div className="flex-1">
                        <CardHeader className="p-0 mb-4">
                            <CardTitle>{ employee.name }</CardTitle>
                            <CardDescription>{ employee.role }</CardDescription>

                            {/*<p className="text-gray-500 text-sm">{employee.phone}</p>*/ }
                            {/*<p className="text-gray-500 text-sm">{employee.email}</p>*/ }
                        </CardHeader>

                        <CardContent className="space-y-3 p-0">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-500"/>
                                <span>{ employee.email }</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-500"/>
                                <span>{ employee.phone }</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-500"/>
                                <span>{ employee.address }</span>
                            </div>
                        </CardContent>
                    </div>
                    {/* Info Shop */ }

                    { employee.Shop ?
                        <div className="flex-1">
                            <CardHeader className="p-0 mb-4">
                                <CardTitle>Market: { employee.Shop.name }</CardTitle>
                                <CardDescription>{ employee.Shop.open
                                    ? <Badge variant={ 'default' }>Open</Badge>
                                    : <Badge variant={ 'destructive' }>Close</Badge>
                                }</CardDescription>
                                {/*<p className="text-gray-500 text-sm">{employee.phone}</p>*/ }
                                {/*<p className="text-gray-500 text-sm">{employee.email}</p>*/ }
                            </CardHeader>
                            <CardContent className="space-y-3 p-0">

                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-gray-500"/>
                                    <span>{ employee.Shop.category }</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="h-4 w-4 text-gray-500"/>
                                    <span>{ employee.Shop.location }</span>
                                </div>

                            </CardContent>
                        </div> : null }
                </div>
            </Card>
        </>

    );
}

export function EmployeeTableRecord(
    { absent }: { absent: Absent[] }
) {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ isPending, startTransition ] = useTransition()
    const [ selectedMonth, setSelectedMonth ] = useState<string>("09")
    const [ selectedYear, setSelectedYear ] = useState<string>("2025")

    // Extract years from datetime (works even if datetime is Date type)
    const years = Array.from(
        new Set(absent.map((r) => new Date(r.datetime).getFullYear().toString()))
    ).sort()

    // Apply filters
    const filteredList = absent.filter((record) => {
        const date = new Date(record.datetime)
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = String(date.getFullYear())
        return (selectedMonth === "all" || month === selectedMonth) &&
            (selectedYear === "all" || year === selectedYear)
    })

    // Totals
    const totalSold = filteredList.reduce((sum, r) => sum + r.sold, 0)
    const totalRevenue = filteredList.reduce((sum, r) => sum + r.revenue, 0)

    const isAbsent: boolean = absent.some((item) => {
        const itemDate = new Date(item.datetime)
        const today = new Date()

        // compare only year, month, and day
        return (
            itemDate.getFullYear() === today.getFullYear() &&
            itemDate.getMonth() === today.getMonth() &&
            itemDate.getDate() === today.getDate()
        )
    })
    return (
        <Card className="w-full  shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className=" flex  gap-2">

                        <span className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-600"/>
                          Attendance, Sales & Revenue
                        </span>
                        <Dialog open={ isOpen } onOpenChange={ setIsOpen }>
                            <DialogTrigger asChild>
                                <Button size="sm" disabled={ isAbsent }>
                                    Absent
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[400px]">
                                <DialogHeader>
                                    <DialogTitle>Confirm Absent</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to mark yourself as absent for today?
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="flex justify-end gap-2 mt-4">
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={ () => startTransition(async () => {
                                        toast.promise(handlerAbsent, {
                                                success: () => 'Success Absent',
                                                error: () => "Error Absent",
                                                finally: () => setIsOpen(false)
                                            }
                                        )
                                    }) }
                                            disabled={ isPending }>
                                        { isPending ? "Submitting..." : "Confirm" }
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Filters */ }
                    <div className="flex gap-2">
                        {/* Month Select */ }
                        <Select value={ selectedMonth } onValueChange={ setSelectedMonth }>
                            <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Month"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Month</SelectItem>
                                { months.map((m) => (
                                    <SelectItem key={ m.value } value={ m.value }>
                                        { m.label }
                                    </SelectItem>
                                )) }
                            </SelectContent>
                        </Select>

                        {/* Year Select */ }
                        <Select value={ selectedYear } onValueChange={ setSelectedYear }>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Year"/>
                            </SelectTrigger>
                            <SelectContent>
                                { years.map((y) => (
                                    <SelectItem key={ y } value={ y }>
                                        { y }
                                    </SelectItem>
                                )) }
                            </SelectContent>
                        </Select>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableCaption>
                        Attendance records for { selectedMonth }/{ selectedYear }
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Sold</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { absent.map((record, i) => (
                            <TableRow
                                key={ i }
                                className="cursor-pointer "
                            >
                                <TableCell>{ formatDateIndo(record.datetime) }</TableCell>
                                <TableCell>
                                    { record.status_absent === STATUS_ABSENT.Present ? (
                                        <span className="flex items-center text-green-600 font-medium">
                                            <CheckCircle className="h-4 w-4 mr-1"/> Present
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-600 font-medium">
                                                <XCircle className="h-4 w-4 mr-1"/> Absent
                                        </span>
                                    ) }

                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="flex items-center justify-end font-semibold">
                                      <ShoppingBag className="h-4 w-4 mr-1 text-blue-600"/>
                                        { record.sold }
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <span className="flex items-center justify-end font-semibold text-emerald-600">
                                      <DollarSign className="h-4 w-4 mr-1"/>
                                        { formatRupiah(record.revenue) }
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button size={ 'sm' }
                                        // onClick={ () => setSelectedRecord(record.products) }
                                    >Detail</Button>
                                </TableCell>

                            </TableRow>
                        )) }

                        {/* Totals */ }
                        <TableRow className="font-bold ">
                            <TableCell>Total</TableCell>
                            <TableCell>—</TableCell>
                            <TableCell className="text-right">{ totalSold }</TableCell>
                            <TableCell className="text-right">
                                { formatRupiah(totalRevenue) }
                            </TableCell>
                            <TableCell>—</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

// Product type
// interface Product {
//     name: string
//     qty: number
//     revenue: number
// }

// New component
function SoldProductsCard({ products }: { products: Product[] }) {

    const totalQty = products.reduce((sum, p) => sum + p.stock, 0)
    const totalRevenue = products.reduce((sum, p) => sum + p.price, 0)

    return (
        <Card className="w-full shadow-lg rounded-2xl ">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-gray-600"/>
                    Products Sold
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>List of sold products</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Revenue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { products.map((p, i) => (
                            <TableRow key={ i }>
                                <TableCell>{ p.name }</TableCell>
                                <TableCell className="text-right">{ p.stock }</TableCell>
                                <TableCell className="text-right text-emerald-600 font-semibold">
                  <span className="flex items-center justify-end gap-1">
                    <DollarSign className="h-4 w-4"/>
                      { formatRupiah(p.price) }
                  </span>
                                </TableCell>
                            </TableRow>
                        )) }

                        {/* Totals */ }
                        <TableRow className="font-bold ">
                            <TableCell>Total</TableCell>
                            <TableCell className="text-right">{ totalQty }</TableCell>
                            <TableCell className="text-right">{ formatRupiah(totalRevenue) }</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
