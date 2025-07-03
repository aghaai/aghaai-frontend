"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store";
import { aiEvaluationActions } from "@/store/features/ai-evaluation.slice";
import {
  ArrowDownToLine,
  ArrowLeft,
  BookOpen,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const ShowWrittenEssay = () => {
  const { evaluationResult } = useAppSelector((state) => state.aiEvaluation);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ShowMode, setShowMode] = React.useState<"original" | "aiWritten">(
    "original"
  );

  console.log("evaluationResult", evaluationResult);

  const highlightSection = searchParams.get("highlight");

  if (!evaluationResult) return null;

  const essayText =
    ShowMode === "original"
      ? evaluationResult.originalEssay
      : evaluationResult.reWrittenEssay;

  const matchedSection = evaluationResult.evaluationAndScoring.find(
    (section) => section.label === highlightSection
  );

  const highlightPhrases =
    matchedSection?.issuesList?.map((i) =>
      ShowMode === "original" ? i.before : i.after
    ) ?? [];

  const getHighlightedEssay = () => {
    if (!highlightPhrases.length) return essayText;

    let highlighted = essayText;

    highlightPhrases.forEach((phrase) => {
      const safePhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${safePhrase})`, "gi");

      highlighted = highlighted.replace(
        regex,
        ShowMode === "original"
          ? `<mark class="bg-red-200 rounded px-1 py-1">$1</mark>`
          : // : `<mark class="bg-green-200 rounded px-1 py-1">$1</mark>`
            `$1`
      );
    });

    return highlighted;
  };

  const handleReset = () => {
    // Clear Redux state
    dispatch(aiEvaluationActions.clearEvaluationResult());

    // Build new search params
    const params = new URLSearchParams(searchParams.toString());

    // If 'tab' is insights, set to history
    if (params.get("tab") === "insights") {
      params.set("tab", "history");
    }

    // Remove highlight key if present
    if (params.has("highlight")) {
      params.delete("highlight");
    }

    // Push new URL without full reload, preserve scroll
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xl font-semibold">Topic</Label>
      <Label className="text-lg font-semibold text-muted-foreground">
        {evaluationResult.topic}
      </Label>
      {/* Header */}
      <div className="flex items-center justify-between mt-5">
        <Label className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-5 w-5" />
          {ShowMode === "original" ? "Original Essay" : "AI Re-Written Essay"}
        </Label>

        {ShowMode === "aiWritten" && (
          <div className="space-x-2">
            <Button variant="ghost" onClick={handleReset}>
              <RotateCcw className="h-5 w-5 mr-1" />
              Reset
            </Button>
            {/* <Button variant="secondary">
              <ArrowDownToLine className="h-5 w-5 mr-1" />
              Download PDF
            </Button> */}
          </div>
        )}
      </div>

      {/* Essay */}
      <div
        className="min-h-[80vh] leading-7 flex-1 p-4 border rounded-md whitespace-pre-line prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: getHighlightedEssay() }}
      />

      {/* Footer */}
      <div className="flex items-start justify-between">
        <Label>
          <span className="text-muted-foreground">Word Count: </span>
          <span className="text-muted-foreground">
            {ShowMode === "original"
              ? evaluationResult.originalEssay.split(" ").length
              : evaluationResult.reWrittenEssay.split(" ").length}
          </span>
        </Label>

        {ShowMode === "original" && (
          <Button variant="secondary" onClick={() => setShowMode("aiWritten")}>
            <Sparkles className="h-5 w-5" />
            Show Rewritten
          </Button>
        )}

        {ShowMode === "aiWritten" && (
          <Button variant="secondary" onClick={() => setShowMode("original")}>
            <ArrowLeft className="h-5 w-5" />
            Show Original
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShowWrittenEssay;
