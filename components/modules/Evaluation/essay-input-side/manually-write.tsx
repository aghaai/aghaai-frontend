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
  const essayRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [wordCount, setWordCount] = React.useState(0);
  const [textValue, setTextValue] = React.useState("");

  const minimumWordCount = 100;
  const maximumWordCount = 1000;

  // Calculate word count on input
  const handleWordCountChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(count);

    // Option 1: Prevent typing after maximum
    if (count <= maximumWordCount) {
      setTextValue(text);
    } else {
      // Optionally show a toast
      toast.warning(`Maximum allowed words is ${maximumWordCount}.`);
    }
  };

  // Handle essay submission
  const handleSubmitEssay = async () => {
    const text = essayRef.current?.value || "";
    const count = text.trim().split(/\s+/).filter(Boolean).length;

    if (count < minimumWordCount) {
      toast.error(`Essay must be at least ${minimumWordCount} words long`);
      return;
    }
    if (count > maximumWordCount) {
      toast.error(`Essay must not exceed ${maximumWordCount} words`);
      return;
    }
    if (submitEssay.isPending) return;

    dispatch(aiEvaluationActions.startEvaluation());

    await submitEssay.mutateAsync(
      { essaySubmissionType: "manually", essayText: text },
      {
        onSuccess: (data) => {
          if (essayRef.current) essayRef.current.value = "";
          setWordCount(0);
          setTextValue("");
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
          placeholder={`Write your essay here, between ${minimumWordCount} and ${maximumWordCount} words.`}
          onChange={handleWordCountChange}
          value={textValue}
          ref={essayRef}
          className=" flex-1 min-h-[70vh] max-h-[70vh] p-4  overflow-hidden"
        />
      )}

      <div className="flex justify-between items-start ">
        <Label className="">
          <span className="text-muted-foreground">Word Count </span>
          <span
            className={`text-muted-foreground ${
              wordCount > maximumWordCount
                ? "text-red-500 font-bold"
                : wordCount < minimumWordCount
                ? ""
                : ""
            }`}
          >
            {wordCount}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            (min: {minimumWordCount}, max: {maximumWordCount})
          </span>
        </Label>

        <Button
          variant="outline"
          disabled={submitEssay.isPending || isLoading}
          onClick={handleSubmitEssay}
          type="submit"
        >
          {(submitEssay.isPending || isLoading) && (
            <Loader2 className="animate-spin mr-2" />
          )}
          Submit For Review
        </Button>
      </div>
    </>
  );
};

export default ManuallyWrite;
