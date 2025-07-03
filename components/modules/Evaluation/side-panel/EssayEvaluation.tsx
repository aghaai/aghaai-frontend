"use client";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Hourglass,
  Newspaper,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import PercentageChart from "../percentage-chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/store";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EssayEvaluation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { evaluationResult } = useAppSelector((state) => state.aiEvaluation);
  console.log(evaluationResult);

  const currentInsight = searchParams.get("insight") || "overview";
  const handleInsightChange = (insight: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "insights");
    params.set("insight", insight);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const highlight = searchParams.get("highlight");

  const defaultOpenIndex = evaluationResult?.evaluationAndScoring.findIndex(
    (section) => section.label === highlight
  );

  const defaultAccordionValue =
    defaultOpenIndex !== -1 ? `item-${defaultOpenIndex}` : undefined;

  if (!evaluationResult) {
    return (
      <TabsContent value="insights" className="p-3">
        <div className="flex flex-col gap-4 justify-center items-center mt-16">
          <Hourglass className="h-6 w-6 text-muted-foreground" />
          <Label className="text-md text-muted-foreground">
            You haven&apos;t submitted your essay yet
          </Label>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="insights" className="p-3">
      {currentInsight === "overview" && (
        <>
          {/* <Label className="text-muted-foreground">
            Over all Essay Evaluation
          </Label>
          <div className="mt-6 flex justify-center items-center">
            <PercentageChart
              score={evaluationResult.overallEssayEvaluationScore}
              isScoreShow
              scoreLabelClassName="text-muted-foreground"
            />
          </div> */}
          {/* <Separator className="my-4" /> */}
          <Button
            className="w-full justify-start mb-3 py-5"
            variant="secondary"
            onClick={() => handleInsightChange("evaluation")}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Evaluation & Score
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
          <Button
            className="w-full justify-start py-5"
            variant="secondary"
            onClick={() => handleInsightChange("structure")}
          >
            <Newspaper className="h-4 w-4 mr-2" />
            Essay Structure
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </>
      )}

      {currentInsight === "evaluation" && (
        <>
          <Button
            variant="secondary"
            className="mb-3"
            size={"sm"}
            onClick={() => handleInsightChange("overview")}
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
          <div className="space-y-4 ">
            <Label className="text-muted-foreground">Evaluation & Score</Label>
            <Accordion
              type="single"
              defaultValue={defaultAccordionValue}
              onValueChange={(value) => {
                const index = Number(value?.split("-")[1]);
                const label =
                  evaluationResult.evaluationAndScoring[index]?.label;

                const params = new URLSearchParams(searchParams.toString());

                if (!value) {
                  params.delete("highlight");
                } else {
                  params.set("highlight", label);
                }

                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              collapsible
              className="space-y-4"
            >
              {evaluationResult.evaluationAndScoring.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  {item.issuesCount > 0 ? (
                    <div className="border p-3 rounded-md bg-card">
                      <div className="flex justify-between">
                        <Label>{item.label}</Label>
                        {/* <PercentageChart
                          score={item.score}
                          radius={14}
                          stroke={3}
                        /> */}
                      </div>
                      <AccordionTrigger className="hover:decoration-card pb-0 items-center">
                        <div
                          className={cn(
                            "rounded-2xl py-1 w-20 text-center bg-destructive dark:bg-red-200 text-accent font-semibold"
                          )}
                        >
                          <span>
                            {item.issuesCount > 1
                              ? `${item.issuesCount} Issue's`
                              : `${item.issuesCount} Issue`}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {item.issuesList?.map((issue, j) => (
                          <div key={j} className={j === 0 ? "mt-3" : "mt-6"}>
                            <div className="w-1/2 mx-auto">
                              <Separator />
                            </div>
                            <div className="mb-5 mt-2">
                              <div className="flex items-start justify-start text-start">
                                <XCircle className="text-card fill-destructive dark:fill-red-200 h-5 w-5 mr-2" />
                                <div className="flex flex-col">
                                  <span className="font-semibold">
                                    Before :
                                  </span>
                                  <span className="text-muted-foreground">
                                    {issue.before}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className={
                                j === item.issuesList.length - 1 ? "" : "mb-2"
                              }
                            >
                              <div className="flex items-start justify-start text-start">
                                <CircleCheck className="text-card fill-green-500 dark:fill-green-200 h-5 w-5 mr-1" />
                                <div className="flex flex-col">
                                  <span className="font-semibold">After :</span>
                                  <span className="text-muted-foreground">
                                    {issue.after}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </AccordionContent>
                    </div>
                  ) : (
                    <div className="border p-3 rounded-md bg-card flex flex-col justify-between">
                      <Label>{item.label}</Label>
                      <div className="mt-6">
                        <div
                          className={cn(
                            "rounded-2xl py-1 w-20 text-center bg-green-800 dark:bg-green-200  text-accent font-semibold text-sm"
                          )}
                        >
                          <span>All Ok</span>
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </>
      )}

      {currentInsight === "structure" && (
        <>
          <Button
            variant="secondary"
            className="mb-3"
            size={"sm"}
            onClick={() => handleInsightChange("overview")}
          >
            <ChevronLeft className="h-5 w-5" />
            Back
          </Button>
          <div className="space-y-4">
            <Label className="text-muted-foreground">Essay Structure</Label>
            <Accordion
              type="single"
              collapsible
              className="w-full rounded-md shadow"
            >
              {evaluationResult.essayStructure.map((section, i) => (
                <AccordionItem key={i} value={`section-${i}`}>
                  <AccordionTrigger className="">
                    {section.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-5 mt-2 p-1">
                      {section.features?.map((feature, j) => (
                        <li
                          key={j}
                          className="flex justify-between items-center"
                        >
                          <Label className="text-muted-foreground">
                            {feature.label}
                          </Label>
                          {feature.isCorrect ? (
                            <CircleCheck className="text-card fill-green-500 dark:fill-green-200 h-5 w-5 mt-1" />
                          ) : (
                            <Tooltip>
                              <TooltipTrigger className="">
                                <XCircle className="text-card fill-destructive dark:fill-red-200 h-5 w-5 mt-1" />
                              </TooltipTrigger>
                              {feature.errorMessage && (
                                <TooltipContent
                                  align="end"
                                  side="bottom"
                                  className="max-w-md break-words"
                                >
                                  {feature.errorMessage}
                                </TooltipContent>
                              )}
                            </Tooltip>
                          )}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </>
      )}
    </TabsContent>
  );
};

export default EssayEvaluation;
