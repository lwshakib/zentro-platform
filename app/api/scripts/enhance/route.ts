import { NextRequest, NextResponse } from "next/server"
import { enhancePrompt } from "@/lib/helpers"

export async function POST(req:NextRequest){
    const {prompt} = await req.json()

    const enhanced = await enhancePrompt(prompt)

    return NextResponse.json({
        success: true,
        message: "Prompt enhanced successfully!",
        data: enhanced,
    })
}