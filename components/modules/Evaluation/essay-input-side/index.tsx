"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Camera,
  FileText,
  Images,
  NotebookPen,
  RefreshCcw,
  Upload,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const EssayInputSide = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { evaluationResult, isLoading } = useAppSelector(
    (state) => state.aiEvaluation
  );

  const essayTopic = searchParams.get("essayTopic");
  const mode = searchParams.get("mode") || "";

  // For new topic input (before it's submitted)
  const [topicInput, setTopicInput] = React.useState(() => {
    const params = new URLSearchParams(searchParams.toString());
    return params.get("essayTopic") || "";
  });

  // Set the essay topic in the URL
  const setEssayTopic = (newEssayTopic: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("essayTopic", newEssayTopic);
    // Default to "upload-images" mode after topic set, can be changed
    params.set("mode", "upload-images");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Change mode (upload-pdf or upload-images)
  const setMode = (newMode: "upload-pdf" | "upload-images") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Show result if done
  if (evaluationResult && !isLoading) {
    return <ShowWrittenEssay />;
  }

  // Main UI
  return (
    <div className="flex flex-col gap-4">
      {!essayTopic ? (
        <div>
          <div>
            <Label className="text-lg font-semibold">Topic</Label>
          </div>
          <Textarea
            className="mt-2 h-20"
            placeholder="The impact of technology on society"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Your essay will be evaluated based on this topic. Please be specific
            enough.
          </p>
          <div className="mt-2 flex justify-end">
            <Button
              className="btn mt-1"
              disabled={!topicInput.trim()}
              variant="outline"
              onClick={() => {
                setEssayTopic(topicInput.trim());
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Show submitted topic */}
          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xl font-semibold">Topic</Label>
              <Button variant="outline" onClick={() => setEssayTopic("")}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
                <span className="sr-only">Reset</span>
              </Button>
            </div>
            <Label className="text-lg font-semibold text-muted-foreground">
              {essayTopic}
            </Label>
          </div>

          {/* Upload Buttons */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isLoading}>
                <Button
                  variant={mode.includes("upload") ? "default" : "outline"}
                >
                  <Upload className="h-5 w-5 " />
                  Upload Essay
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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

          {/* Upload Components */}
          {mode === "upload-pdf" && <UploadPdf />}
          {mode === "upload-images" && <UploadImages />}
        </>
      )}
    </div>
  );
};

export default EssayInputSide;
