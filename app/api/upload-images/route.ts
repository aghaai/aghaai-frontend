import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("Upload Images API called");
    const formData = await req.formData();

    console.log(formData);

    const images = formData.getAll("images");

    console.log("Images:", images);

    if (!images.length) {
      return NextResponse.json(
        { message: "No images uploaded" },
        { status: 400 }
      );
    }

    const uploadForm = new FormData();
    images.forEach((file: FormDataEntryValue) => {
      if (file instanceof File) {
        uploadForm.append("files", file);
      }
    });

    const res = await fetch(
      "https://danishjameel003-dockerhuggingface.hf.space/api/upload/bulk",
      {
        method: "POST",
        body: uploadForm,
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      return NextResponse.json(
        { message: "Error from images API", error: errorBody },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log(data);

    let combined_word_count = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data.results.forEach((result: any) => {
      combined_word_count += result.word_count;
    });

    return NextResponse.json(
      {
        extractedText: data.combined_text,
        wordCount: combined_word_count,
      },
      { status: 200 }
    );
    // return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Upload Images Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error?.toString?.() || error },
      { status: 500 }
    );
  }
}
