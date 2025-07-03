import { NextResponse } from "next/server";
import { essaySubmissionTypeT } from "@/types/ai-evaluation";

const EssayEvaluation_API =
  "https://danishjameel003-dockerhuggingface.hf.space/api/essay-analysis";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as {
      essayText: string;
      essaySubmissionType: essaySubmissionTypeT;
      topic: string;
    };

    const formData = new FormData();
    formData.append("essay_text", data.essayText);
    formData.append("topic", data.topic);
    const xyzRes = await fetch(EssayEvaluation_API, {
      method: "POST",
      // headers: {
      //   "Content-Type": "application/x-www-form-urlencoded",
      // },
      body: formData,
    });

    if (!xyzRes.ok) {
      const errorBody = await xyzRes.text();
      return NextResponse.json(
        { message: "Error from essay evaluation API", error: errorBody },
        { status: xyzRes.status }
      );
    }

    const xyzData = await xyzRes.json();
    console.log(xyzData);
    return NextResponse.json(
      { ...xyzData, topic: data.topic },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "error", error: error?.toString?.() || error },
      { status: 500 }
    );
  }
}
