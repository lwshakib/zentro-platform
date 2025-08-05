import { googleAuthRedirectUri, googleClientId, googleClientSecret } from "@/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const code = req.nextUrl.searchParams.get("code");

    
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code: code!,
      client_id: googleClientId!,
      client_secret: googleClientSecret!,
      redirect_uri: googleAuthRedirectUri!,
      grant_type: "authorization_code",
    }),
  });
  const data = await res.json();

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.set("googleAccessToken", data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: data.expires_in, // 3599
    });
    response.cookies.set("googleRefreshToken", data.refresh_token);

    return response;
}