import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

// Helper to simulate delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  try {
    // Simulate processing delay (10 seconds)
    await delay(10000);

    // Parse the multipart form data (this will work if the file is sent with FormData)
    const formData = await request.formData();
    const pdfFile = formData.get("pdf");

    if (!pdfFile || !(pdfFile instanceof File)) {
      return NextResponse.json(
        { message: "No PDF file uploaded" },
        { status: 400 }
      );
    }

    console.log("Uploaded PDF file name:", pdfFile.name);

    // Return dummy extracted essay data
    const filePath = path.join(process.cwd(), "data", "extracted-data.json");
    const fileContents = await readFile(filePath, "utf-8");
    const dummyData = JSON.parse(fileContents);

    return NextResponse.json(dummyData, { status: 200 });
  } catch (error) {
    console.error("Upload PDF Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
