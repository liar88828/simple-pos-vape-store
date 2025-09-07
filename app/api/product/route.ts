import { ActionResponse } from "@/interface/actionType";
import { prisma } from "@/lib/prisma"
import type { Product } from "@prisma/client"
import { NextResponse } from "next/server"

export async function GET(){
    const data=await prisma.preOrder.groupBy({
        by:['productId'],
        _avg:{

        },
        _sum:{
            quantity:true
        }

    })
    return  NextResponse.json({})
}
