import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const pdfFile = formData.get("pdf");

    if (!pdfFile || !(pdfFile instanceof File)) {
      return NextResponse.json(
        { message: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    const uploadForm = new FormData();
    uploadForm.append("file", pdfFile);

    const res = await fetch(
      "https://ai-engineering-e5bd687053bb.herokuapp.com/api/upload",
      {
        method: "POST",
        body: uploadForm,
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      return NextResponse.json(
        { message: "Error from upload API", error: errorBody },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(
      {
        extractedText: data.extracted_text,
        wordCount: data.word_count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload PDF Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error?.toString?.() || error },
      { status: 500 }
    );
  }
}
