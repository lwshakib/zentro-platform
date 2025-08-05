import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { inngest } from "@/inngest/client"

export async function POST(req:NextRequest){
    const {imageId} = await req.json();


    await inngest.send({
        name: "zentro.image.generate",
        data: {
            imageId,
        }
    })

    
    return NextResponse.json({
        success: true,
    })
}