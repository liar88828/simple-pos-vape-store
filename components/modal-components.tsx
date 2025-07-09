"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { ModalProps } from "@/interface/actionType";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

interface ResponsiveModalProps {
    title: string
    description?: string
    trigger?: React.ReactNode
    children: React.ReactNode
    footer?: React.ReactNode
}

export function ResponsiveModal(
    {
        title,
        description,
        trigger,
        children,
        footer,
    }: ResponsiveModalProps) {
    const [ open, setOpen ] = useState(false)
    const [ isMounted, setIsMounted ] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null // SSR-safe render

    return isDesktop ? (
        <Dialog open={ open } onOpenChange={ setOpen }>
            <DialogTrigger asChild>{ trigger }</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{ title }</DialogTitle>
                    { description && <DialogDescription>{ description }</DialogDescription> }
                </DialogHeader>
                { children }
                { footer && <DialogFooter className="pt-4">
                    { footer }
					<DialogClose asChild>
						<Button variant="outline">Tutup</Button>
					</DialogClose>
				</DialogFooter> }
            </DialogContent>
        </Dialog>
    ) : (
        <Drawer open={ open } onOpenChange={ setOpen }>
            <DrawerTrigger asChild>{ trigger }</DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{ title }</DrawerTitle>
                        { description && <DrawerDescription>{ description }</DrawerDescription> }
                    </DrawerHeader>
                    <div className="px-6">{ children }</div>
                    <DrawerFooter className="pt-2">
                        { footer }
                        <DrawerClose asChild>
                            <Button variant="outline">Tutup</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export function ResponsiveModalOnly(
    {
        title,
        description,
        children,
        footer,
        setOpenAction,
        isOpen
    }: ResponsiveModalProps & ModalProps) {

    const [ isMounted, setIsMounted ] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null // SSR-safe render

    return isDesktop
        ? (<Dialog open={ isOpen } onOpenChange={ setOpenAction }>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{ title }</DialogTitle>
                        { description && <DialogDescription>{ description }</DialogDescription> }
                    </DialogHeader>

                    { children }
                    { footer && <DialogFooter className="pt-4">
                        { footer }
						<DialogClose asChild>
							<Button variant="outline">Tutup</Button>
						</DialogClose>
					</DialogFooter> }
                </DialogContent>
        </Dialog>)
        : (<Drawer open={ isOpen } onOpenChange={ setOpenAction }>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader className="text-left">
                        <DrawerTitle>{ title }</DrawerTitle>
                        { description && <DrawerDescription>{ description }</DrawerDescription> }
                    </DrawerHeader>
                    <div className="px-4">
                        { children }
                    </div>
                    <DrawerFooter className="pt-2">
                        { footer }
                        <DrawerClose asChild>
                            <Button variant="outline">Tutup</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
