import { SCRIPT_GENERATE_PROMPT } from "@/constants/prompts";
import { googleAi } from "@/config";
import { NextRequest, NextResponse } from "next/server";
import { cleanJSONResponse, generateContentViaGemini } from "@/lib/helpers";


export async function POST(req: NextRequest) {
  const { topic } = await req.json();

  const prompt = SCRIPT_GENERATE_PROMPT.replace("{{TOPIC}}", topic);

  const responseText = await generateContentViaGemini(prompt);

  return NextResponse.json({
    success: true,
    message: "Scripts Generated Successfully",
    data: cleanJSONResponse(responseText as string),
  });
}
