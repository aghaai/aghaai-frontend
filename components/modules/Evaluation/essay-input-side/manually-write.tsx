"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAIEvaluation } from "@/hooks/use-ai-evaluation";
import { useAppDispatch, useAppSelector } from "@/store";
import { aiEvaluationActions } from "@/store/features/ai-evaluation.slice";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const ManuallyWrite = () => {
  const { submitEssay } = useAIEvaluation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { evaluationResult, isLoading } = useAppSelector(
    (state) => state.aiEvaluation
  );
  console.log(evaluationResult);
  const essayRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [wordCount, setWordCount] = React.useState(0);

  const minimumWordCount = 0;

  // Calculate word count
  const handleWordCountChange = () => {
    if (!essayRef.current) return;
    const text = essayRef.current.value;
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(count);
  };

  // Handle essay submission
  const handleSubmitEssay = async () => {
    if (!essayRef.current) return;
    // Check if essay is at least minimumWordCount words
    const text = essayRef.current?.value || "";
    const count = text.trim().split(/\s+/).filter(Boolean).length;

    if (count < minimumWordCount) {
      toast.error(`Essay must be at least ${minimumWordCount} words long`);
      return;
    }
    // Check if essay is already submitted
    if (submitEssay.isPending) return;

    // Start the Evaluation process in the store this will start the loading spinner
    dispatch(aiEvaluationActions.startEvaluation());

    // submit the essay to the server
    await submitEssay.mutateAsync(
      { essaySubmissionType: "manually", essayText: text },
      {
        onSuccess: (data) => {
          // Reset the essay and word count
          if (essayRef.current) essayRef.current.value = "";
          setWordCount(0);
          // Set the evaluation result
          dispatch(aiEvaluationActions.setEvaluationResult({ ...data }));

          const params = new URLSearchParams(searchParams.toString());
          params.set("tab", "insights");

          router.replace(`?${params.toString()}`, { scroll: false });
        },
      }
    );
  };

  return (
    <>
      {submitEssay.isPending || isLoading ? (
        <Skeleton className="min-h-[70vh] flex-1 p-4" />
      ) : (
        <Textarea
          inputMode="text"
          placeholder={`Write your essay here, make sure it is at least ${minimumWordCount} words long.`}
          onChange={handleWordCountChange}
          ref={essayRef}
          className=" flex-1 min-h-[70vh] max-h-[70vh] p-4  overflow-hidden"
        />
      )}

      <div className="flex justify-between items-start ">
        <Label className="">
          <span className="text-muted-foreground">Word Count</span>
          <span className="text-muted-foreground">{wordCount}</span>
        </Label>

        <Button
          variant="outline"
          disabled={submitEssay.isPending || isLoading}
          onClick={handleSubmitEssay}
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

export default ManuallyWrite;
