'use client'
import {
    createEmployee,
    EmployeeProps,
    EmployeesAll,
    getShopAllApi,
    updateEmployee
} from "@/app/admin/employee/employee-action";
import { InputForm, SelectForm } from "@/components/mini/form-hook";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { ROLE_USER_LIST } from "@/lib/constants";
import { Shop } from "@/lib/validation";
import ROLE_USERSchema from "@/lib/validation/inputTypeSchemas/ROLE_USERSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { ROLE_USER } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const _employees = [
    {
        id: 1,
        name: "Alice Johnson",
        role: "Software Engineer",
        email: "alice@example.com",
        location: "New York",
        active: true
    },
    {
        id: 2,
        name: "Bob Smith",
        role: "Product Manager",
        email: "bob@example.com",
        location: "San Francisco",
        active: false
    },
    {
        id: 3,
        name: "Charlie Davis",
        role: "UI/UX Designer",
        email: "charlie@example.com",
        location: "Chicago",
        active: true
    },
]

export default function EmployeePage(
    {
        employees,
    }: {
        employees: EmployeesAll[],
    }) {
    const [ dialogOpen, setDialogOpen ] = useState(false)
    const [ selectedEmployee, setSelectedEmployee ] = useState<EmployeeProps | undefined>(undefined)

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-lg sm:text-3xl font-bold">Manajemen Karyawan</h1>
                {/*<ModalTambahCustomer/>*/ }
                <Button
                    onClick={ () => {
                        setSelectedEmployee(undefined)
                        setDialogOpen(true)
                    } }
                >
                    Add Employee
                </Button>
            </div>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Employee List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>A list of all employees.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Shop</TableHead>
                                {/*<TableHead>Status</TableHead>*/ }
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { employees.map((emp, i) => (
                                <TableRow key={ emp.id }>
                                    {/*<TableCell className="font-medium">{ emp.id }</TableCell>*/ }
                                    <TableCell className="font-medium">{ i + 1 }</TableCell>
                                    <TableCell>
                                        <p className={ 'font-bold' }> { emp.name }</p>
                                        <p>{ emp.address }</p>
                                        <p>{ emp.phone }</p>
                                    </TableCell>
                                    <TableCell className={ 'justify-center' }>
                                        <p>{ emp.role }</p>
                                        <p>{ emp.active ? (
                                            <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>) : (
                                            <Badge variant="destructive">Inactive</Badge>) }
                                        </p>

                                    </TableCell>
                                    <TableCell>
                                        <p className={ 'font-bold' }>{ emp?.Shop?.name ?? '' }</p>
                                        <p>{ emp?.Shop?.location ?? '' }</p>
                                    </TableCell>

                                    <TableCell className="flex gap-2 ">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={ () => {
                                                setSelectedEmployee(emp)
                                                setDialogOpen(true)
                                            } }
                                        >
                                            Edit
                                        </Button>
                                        <Button size="sm" asChild>
                                            <Link href={ `/admin/employee/${ emp.id }` }>Detail</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EmployeeDialog
                open={ dialogOpen }
                onOpenChange={ setDialogOpen }
                employee={ selectedEmployee }
            />
        </div>
    )
}
// : z.ZodType<EmployeeForm>
const employeeSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    role: ROLE_USERSchema,
    address: z.string().min(1, "Location is required"),
    workIn_shopId: z.string().min(1, "Shop is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    img: z.string().min(1, "Img is required"),
    active: z.boolean(),
})

export type EmployeeFormData = z.infer<typeof employeeSchema>

export function EmployeeDialog(
    {
        open,
        onOpenChange,
        employee,
    }: {
        open: boolean
        onOpenChange: (open: boolean) => void
        employee?: EmployeeProps
    }) {

    const [ shop, setShop ] = useState<Shop[]>([])

    useEffect(() => {
        getShopAllApi().then(data => {
            setShop(data.data)
        })
        console.log('render')
    }, []);

    const methods = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),//
        defaultValues: {
            id: "",
            name: "",
            role: ROLE_USER.USER,
            address: "",
            workIn_shopId: "",
            email: "",
            phone: "",
            img: "",
            active: true,
        } satisfies EmployeeFormData
    })

    useEffect(() => {
        if (employee) {
            methods.reset({
                ...employee,
                phone: employee.phone ?? '',
                address: employee.address ?? '',
                workIn_shopId: employee.workIn_shopId ?? '',
                img: employee.img ?? '',
            })
        } else {
            methods.reset({
                id: "",
                name: "",
                role: ROLE_USER.USER,
                address: "",
                workIn_shopId: "",
                email: "",
                phone: "",
                img: "",
                active: true,
            })
        }
    }, [ employee, methods ])
    console.log(methods.formState.errors)
    const onSubmit = methods.handleSubmit(async (data) => {
        try {
            if (data.id) {
                await updateEmployee(data.id, data)
                toast.success("Employee updated successfully")
            } else {
                await createEmployee(data)
                toast.success("Employee created successfully")
            }
            methods.reset()
            onOpenChange(false)
        } catch (err) {
            toast.error("Failed to save employee")
            console.error(err)
        }
    })

    return (
        <Dialog open={ open } onOpenChange={ onOpenChange }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        { employee ? "Edit Employee" : "Add Employee" }
                    </DialogTitle>
                </DialogHeader>

                <FormProvider { ...methods }>
                    <form className="space-y-4">
                        <InputForm name="name" title="Name" placeholder="Employee name"/>
                        { employee || employee !== ROLE_USER.ADMIN ?
                            null
                            : <SelectForm
                                name="role"
                                label="Role"
                                placeholder="Select a role"
                                options={ ROLE_USER_LIST }
                            /> }

                        {/*<InputForm name="role" title="Role" placeholder="Employee role"/>*/ }
                        <InputForm
                            name="address"
                            title="Address"
                            placeholder="Employee location"
                        />
                        <InputForm name="email" title="Email" placeholder="Email address"/>
                        <InputForm name="phone" title="Phone" placeholder="Phone number"/>
                        <InputForm name="img" title="Image URL" placeholder="Profile image"/>
                        { employee || employee !== ROLE_USER.ADMIN ?
                            null
                            :
                            <SelectForm
                                name="workIn_shopId"
                                label="Shop"
                                placeholder="Select a shop"
                                options={ shop.map((s) => ({
                                    label: s.name,
                                    value: s.id,
                                })) }
                            />
                        }
                        { employee || employee !== ROLE_USER.ADMIN ?
                            null
                            :
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="active"
                                    checked={ methods.watch("active") }
                                    onCheckedChange={ (value) =>
                                        methods.setValue("active", Boolean(value))
                                    }
                                />
                                <label htmlFor="active" className="text-sm">
                                    Active
                                </label>
                            </div>
                        }
                    </form>
                </FormProvider>

                <DialogFooter>
                    <Button variant="outline" onClick={ () => onOpenChange(false) }>
                        Cancel
                    </Button>
                    <Button onClick={ onSubmit }>
                        { employee ? "Update" : "Create" }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
