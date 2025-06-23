/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

// Disable bodyParser so we can handle multipart ourselves
export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req: Request): Promise<{ files: any }> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true });

    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ files });
    });
  });
}

export async function POST(req: Request) {
  try {
    console.log(req)
    // const { files } = await parseForm(req);
    // console.log("Received files:", files);

    // Simulate delay
    await new Promise((res) => setTimeout(res, 5000));

    const filePath = path.join(process.cwd(), "data", "extracted-data.json");
    const fileContents = await fs.promises.readFile(filePath, "utf-8");
    const dummyData = JSON.parse(fileContents);

    return NextResponse.json(dummyData, { status: 200 });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}
