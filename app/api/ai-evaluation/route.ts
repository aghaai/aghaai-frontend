import { NextResponse } from "next/server";
import { essaySubmissionTypeT } from "@/types/ai-evaluation";

const EssayEvaluation_API =
  "https://ai-engineering-e5bd687053bb.herokuapp.com/api/essay-analysis";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as {
      essayText: string;
      essaySubmissionType: essaySubmissionTypeT;
    };

    // Build form data
    const formData = new URLSearchParams();
    formData.append("essay_text", data.essayText);

    const xyzRes = await fetch(EssayEvaluation_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!xyzRes.ok) {
      const errorBody = await xyzRes.text();
      return NextResponse.json(
        { message: "Error from essay evaluation API", error: errorBody },
        { status: xyzRes.status }
      );
    }

    const xyzData = await xyzRes.json();
    return NextResponse.json(xyzData, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "error", error: error?.toString?.() || error },
      { status: 500 }
    );
  }
}
