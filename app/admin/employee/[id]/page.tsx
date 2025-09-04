'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Calendar, CheckCircle, DollarSign, Mail, MapPin, Package, Phone, ShoppingBag, XCircle } from "lucide-react"
import React, { useState } from "react"

// Interfaces for type clarity
interface Product {
    name: string;
    qty: number;
    revenue: number;
}

interface AttendanceRecord {
    datetime: string;
    status: "present" | "absent";
    sold: number;
    revenue: number;
    products: Product[];
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
const attendanceList: AttendanceRecord[] = [
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

// type for attendance status
type AttendanceStatus = "present" | "absent"

// type for record

interface AttendanceRecord {
    datetime: string
    status: AttendanceStatus
    sold: number
    revenue: number
}

// format Rupiah
const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(num)

export default function Page() {
    const [ selectedRecord, setSelectedRecord ] = useState<AttendanceRecord['products'] | null>(null)

    return (
        <div className="flex p-6 gap-6 flex-col">
            <Card className="w-full max-w-2xl shadow-lg rounded-2xl">
                <CardHeader className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src="/avatar.png" alt="Employee Photo"/>
                        <AvatarFallback>EM</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl font-semibold">John Doe</CardTitle>
                    <p className="text-gray-500 text-sm">Software Engineer</p>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500"/>
                        <span>john.doe@example.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500"/>
                        <span>+62 812-3456-7890</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500"/>
                        <span>Jakarta, Indonesia</span>
                    </div>
                    <div className="pt-4 flex justify-center">
                        <Button className="w-full">Edit Profile</Button>
                    </div>
                </CardContent>
            </Card>


            {/* Attendance Table */ }
            <EmployeeTableRecord setSelectedRecord={ setSelectedRecord }/>
            <SoldProductsCard products={ selectedRecord ? selectedRecord : [] }/>
        </div>
    )
}

function EmployeeTableRecord(
    { setSelectedRecord }: { setSelectedRecord: (products: Product[]) => void }
) {

    const [ selectedMonth, setSelectedMonth ] = useState<string>("09")
    const [ selectedYear, setSelectedYear ] = useState<string>("2025")

    const years = Array.from(
        new Set(attendanceList.map((r) => r.datetime.split("-")[0]))
    ).sort()

    // State for filters

    // Apply filters
    const filteredList = attendanceList.filter((record) => {
        const date = new Date(record.datetime)
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const year = String(date.getFullYear())
        return (selectedMonth === "all" || month === selectedMonth) &&
            (selectedYear === "all" || year === selectedYear)
    })

    // Totals
    const totalSold = filteredList.reduce((sum, r) => sum + r.sold, 0)
    const totalRevenue = filteredList.reduce((sum, r) => sum + r.revenue, 0)

    return (
        <Card className="w-full max-w-4xl shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-600"/>
              Attendance, Sales & Revenue
            </span>

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
                        { filteredList.map((record, i) => (
                            <TableRow
                                key={ i }
                                className="cursor-pointer "
                            >

                                <TableCell

                                >{ record.datetime }</TableCell>
                                <TableCell>
                                    { record.status === "present" ? (
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
                                            onClick={ () => setSelectedRecord(record.products) }
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
interface Product {
    name: string
    qty: number
    revenue: number
}

// New component
function SoldProductsCard({ products }: { products: Product[] }) {

    const totalQty = products.reduce((sum, p) => sum + p.qty, 0)
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0)

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
                                <TableCell className="text-right">{ p.qty }</TableCell>
                                <TableCell className="text-right text-emerald-600 font-semibold">
                  <span className="flex items-center justify-end gap-1">
                    <DollarSign className="h-4 w-4"/>
                      { formatRupiah(p.revenue) }
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
