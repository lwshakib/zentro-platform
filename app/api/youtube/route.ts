import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getChannelData } from "@/lib/helpers";
import { googleClientId, googleClientSecret } from "@/config";

export async function GET() {
  try{
    const cookieStore = await cookies();
    const token = cookieStore.get("googleAccessToken")?.value;
    if (!token) {
      const refreshToken = cookieStore.get("googleRefreshToken")?.value;
      if (!refreshToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
          // Exchange refresh token for new access token
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: googleClientId!,
        client_secret: googleClientSecret!,
        refresh_token: refreshToken,
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
    const channel = await getChannelData(data.access_token);
    return NextResponse.json({
      channel,
    });
    }
  
    const channel = await getChannelData(token);
  
    return NextResponse.json({
      channel,
    });
  }catch(error){
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(){
    try{
        const cookieStore = await cookies();
        cookieStore.delete("googleAccessToken");
        cookieStore.delete("googleRefreshToken");

        return NextResponse.json({ message: "YouTube connection removed successfully" }, { status: 200 });
      }catch(error){
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
      }
}