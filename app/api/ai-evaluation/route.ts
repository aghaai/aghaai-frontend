import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { essaySubmissionTypeT } from "@/types/ai-evaluation";

// Helper to simulate 10-second delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  try {
    // extract the essay from the request
    const data = (await request.json()) as {
      essayText: string;
      essaySubmissionType: essaySubmissionTypeT;
    };

    console.log("Essay received:", data.essayText);

    // Simulate processing delay
    await delay(10000);

    // Read dummy data from JSON file
    const filePath = path.join(process.cwd(), "data", "dummy-evaluation.json");
    const fileContents = await readFile(filePath, "utf-8");
    const dummyData = JSON.parse(fileContents);

    // Send the dummy evaluation as response
    return NextResponse.json(dummyData, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "error", error }, { status: 500 });
  }
}
