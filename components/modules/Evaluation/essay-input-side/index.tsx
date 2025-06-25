"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, FileText, Images, NotebookPen, Upload } from "lucide-react";
import ManuallyWrite from "./manually-write";
import { useAppSelector } from "@/store";
import ShowWrittenEssay from "./show-written-essay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UploadPdf from "./upload-pdf";
import UploadImages from "./upload-images";

const EssayInputSide = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { evaluationResult, isLoading } = useAppSelector(
    (state) => state.aiEvaluation
  );
  console.log(evaluationResult);

  const mode = searchParams.get("mode") || "manual";

  const setMode = (newMode: "manual" | "upload-pdf" | "upload-images") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (evaluationResult && !isLoading) {
    return <ShowWrittenEssay />;
  }
  if (!evaluationResult) {
    return (
      <div className="flex  flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setMode("manual")}
            disabled={isLoading}
            variant={mode === "manual" ? "default" : "outline"}
          >
            <NotebookPen className="h-5 w-5 " />
            Write Manually
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoading}>
              <Button variant={mode.includes("upload") ? "default" : "outline"}>
                <Upload className="h-5 w-5 " />
                Upload Essay
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuItem>
                <Camera className="mr-3 h-4 w-4" />
                Open Camera
              </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => setMode("upload-images")}>
                <Images className="mr-3 h-4 w-4" />
                Upload Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMode("upload-pdf")}>
                <FileText className="mr-3 h-4 w-4" />
                Upload PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {mode === "manual" && <ManuallyWrite />}

        {mode === "upload-pdf" && <UploadPdf />}

        {mode === "upload-images" && <UploadImages />}
      </div>
    );
  }
};

export default EssayInputSide;
