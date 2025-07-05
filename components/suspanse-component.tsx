import { LoadingSpin } from "@/components/loading-spin";
import React, { useEffect, useState } from "react";

interface Customer_ {
    id: number
    name: string
}

export function SuspenseComponent<T>({ data, pending, loader }: {
    data: T | undefined
    pending: React.ReactNode
    loader: (data: T) => React.ReactNode
}) {
    if (!data) return <>{ pending }</>
    return <>{ loader(data) }</>
}

export default function CustomersPagex() {
    const [ myData, setMyData ] = useState<Customer_[] | undefined>(undefined)

    useEffect(() => {
        // Simulate async loading
        setTimeout(() => {
            setMyData([
                { id: 1, name: "Fandy" },
                { id: 2, name: "Azmi" },
            ])
        }, 1000)
    }, [])

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Customer List</h2>
            <SuspenseComponent
                data={ myData }
                pending={ <LoadingSpin/> }
                loader={ (data) => (
                    <div className="space-y-2">
                        { data.map((item) => (
                            <div key={ item.id } className="p-2 border rounded">
                                { item.name }
                            </div>
                        )) }
                    </div>
                ) }
            />
        </div>
    )
}