import { imagekitPrivateKey, imagekitUrlEndpoint, imagekitPublicKey } from "@/config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const ik = new ImageKit({
  publicKey: imagekitPublicKey!,
  privateKey: imagekitPrivateKey!,
  urlEndpoint: imagekitUrlEndpoint!
});

export async function GET() {
  const auth = ik.getAuthenticationParameters();
  return NextResponse.json({ ...auth, publicKey: imagekitPublicKey });
}
