"use client";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAIEvaluation } from "@/hooks/use-ai-evaluation";
import { aiEvaluationActions } from "@/store/features/ai-evaluation.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const EditUploadedEssayText = ({
  extractedText,
  wordCount,
  uploadType,
}: {
  extractedText: string;
  wordCount: number;
  uploadType: "upload-images" | "upload-pdf";
}) => {
  const essayRef = useRef<HTMLTextAreaElement>(null);
  const { submitEssay } = useAIEvaluation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading } = useAppSelector((state) => state.aiEvaluation);
  const handleSubmit = () => {
    const finalText = essayRef.current?.value;

    if (finalText) {
      submitEssay.mutateAsync(
        {
          essaySubmissionType: uploadType,
          essayText: finalText,
        },
        {
          onSuccess: (data) => {
            // Reset the essay and word count
            if (essayRef.current) essayRef.current.value = "";
            // Set the evaluation result
            dispatch(aiEvaluationActions.setEvaluationResult({ ...data }));

            const params = new URLSearchParams(searchParams.toString());
            params.set("tab", "insights");

            router.replace(`?${params.toString()}`, { scroll: false });
          },
        }
      );
    }
  };

  return (
    <>
      {submitEssay.isPending || isLoading ? (
        <Skeleton className="min-h-[70vh] flex-1 p-4" />
      ) : (
        <>
          <div className="space-y-4 border rounded-md bg-card p-4 h-fit">
            <div>
              <Label className="text-lg font-semibold">
                Extracted Essay Text
              </Label>
              <p className="text-muted-foreground text-sm">
                Please edit the extracted text below to correct any errors and
                submit for review.
              </p>
            </div>
            <Textarea
              ref={essayRef}
              defaultValue={extractedText}
              className=" flex-1 min-h-[60vh] resize max-h-[60vh] p-4 overflow-hidden "
            />
          </div>
        </>
      )}

      <div className="flex justify-between items-start ">
        <Label className="">
          <span className="text-muted-foreground">Word Count</span>
          <span className="text-muted-foreground">{wordCount}</span>
        </Label>

        <Button
          variant="outline"
          disabled={submitEssay.isPending || isLoading}
          onClick={handleSubmit}
          type="submit"
        >
          {submitEssay.isPending ||
            (isLoading && <Loader2 className="animate-spin mr-2" />)}
          Submit For Review
        </Button>
      </div>
    </>
  );
};

export default EditUploadedEssayText;
