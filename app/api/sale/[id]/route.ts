import { getHistoriesById } from "@/action/sale-action";
import { ActionResponse, SaleCustomers } from "@/interface/actionType";
import { NextResponse } from "next/server"

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ActionResponse<SaleCustomers>>> {

    try {
        const { id } = await params
        const saleId = Number(id)
        console.log(`is executed GET sale ${ saleId }`)

        if (isNaN(saleId)) {
            return NextResponse.json(
                {
                    message: "Invalid sale ID",
                    success: false,
                },
                { status: 400 }
            )
        }

        const saleData = await getHistoriesById(saleId)
        if (!saleData) {
            return NextResponse.json(
                {
                    message: "Sale not found",
                    success: false,
                },
                { status: 404 }
            )
        }

        return NextResponse.json({
            data: saleData,
            success: true,
            message: `Sale ${ saleId } has been successfully retrieved`,
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        return NextResponse.json(
            {
                message,
                success: false,
            },
            {
                status: 500,
                // statusText: "Internal Server Error",
            }
        )
    }
}
