import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { googleClientId, googleClientSecret } from "@/config";

export async function GET(){
    try{
        const cookieStore = await cookies();
        const googleAccessToken = cookieStore.get("googleAccessToken")?.value;
        if(!googleAccessToken){
            const googleRefreshToken = cookieStore.get("googleRefreshToken")?.value;
            if(!googleRefreshToken){
                return NextResponse.json({
                    success: false,
                    message: "YouTube connection not established",
                }, {status: 404});
            }
            const response = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: googleClientId!,
                    client_secret: googleClientSecret!,
                    refresh_token: googleRefreshToken,
                    grant_type: "refresh_token",
                }),
            });
            const data = await response.json();
            cookieStore.set("googleAccessToken", data.access_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: data.expires_in, // 3599
            });
            return NextResponse.json({
                success: true,
                message: "YouTube connection established successfully",
            }, {status: 200});
        }

        return NextResponse.json({
            success: true,
            message: "YouTube connection established successfully",
        }, {status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
