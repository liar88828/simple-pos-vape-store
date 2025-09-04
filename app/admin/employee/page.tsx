'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import Link from "next/link";
import React, { useEffect, useState } from "react"

const employees = [
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

export default function Page() {
    const [ employees, setEmployees ] = useState<Employee[]>([
        { id: 1, name: "Alice", role: "Manager", location: "New York", active: true },
        { id: 2, name: "Bob", role: "Cashier", location: "San Francisco", active: false },
    ])

    const [ dialogOpen, setDialogOpen ] = useState(false)
    const [ selectedEmployee, setSelectedEmployee ] = useState<Employee | null>(null)

    const handleSave = (employee: Employee) => {
        if (employee.id) {
            // update existing employee
            setEmployees((prev) =>
                prev.map((e) => (e.id === employee.id ? { ...e, ...employee } : e))
            )
        } else {
            // add new employee
            const newId = Math.max(0, ...employees.map((e) => e.id ?? 0)) + 1
            setEmployees((prev) => [ ...prev, { ...employee, id: newId } ])
        }
    }
    return (
        <div className="p-6">
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Employee List</CardTitle>
                    <Button
                        onClick={ () => {
                            setSelectedEmployee(null)
                            setDialogOpen(true)
                        } }
                    >
                        Add Employee
                    </Button>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableCaption>A list of all employees.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { employees.map((emp) => (
                                <TableRow key={ emp.id }>
                                    <TableCell className="font-medium">{ emp.id }</TableCell>
                                    <TableCell>{ emp.name }</TableCell>
                                    <TableCell>{ emp.role }</TableCell>
                                    <TableCell>{ emp.location }</TableCell>
                                    <TableCell>
                                        { emp.active ? (
                                            <Badge className="bg-green-500 hover:bg-green-600">
                                                Active
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">Inactive</Badge>
                                        ) }
                                    </TableCell>
                                    <TableCell className="flex gap-2">
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
                handleSave={ handleSave }
                employee={ selectedEmployee }
            />
        </div>
    )
}

export interface Employee {
    id?: number
    name: string
    role: string
    location: string
    active: boolean
}

interface EmployeeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    handleSave: (employee: Employee) => void
    employee?: Employee | null
}

export function EmployeeDialog(
    {
        open,
        onOpenChange,
        handleSave,
        employee,
    }: EmployeeDialogProps) {
    const [ name, setName ] = useState("")
    const [ role, setRole ] = useState("")
    const [ location, setLocation ] = useState("")
    const [ active, setActive ] = useState(true)

    useEffect(() => {
        if (employee) {
            setName(employee.name)
            setRole(employee.role)
            setLocation(employee.location)
            setActive(employee.active)
        } else {
            setName("")
            setRole("")
            setLocation("")
            setActive(true)
        }
    }, [ employee, open ])

    const onSave = () => {
        handleSave({
            id: employee?.id,
            name,
            role,
            location,
            active,
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={ open } onOpenChange={ onOpenChange }>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ employee ? "Edit Employee" : "Add Employee" }</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={ name } onChange={ (e) => setName(e.target.value) }/>
                    </div>

                    <div>
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" value={ role } onChange={ (e) => setRole(e.target.value) }/>
                    </div>

                    <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={ location }
                            onChange={ (e) => setLocation(e.target.value) }
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="active"
                            type="checkbox"
                            checked={ active }
                            onChange={ (e) => setActive(e.target.checked) }
                            className="h-4 w-4"
                        />
                        <Label htmlFor="active">Active</Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={ () => onOpenChange(false) }>
                        Cancel
                    </Button>
                    <Button onClick={ onSave }>
                        { employee ? "Update" : "Create" }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
