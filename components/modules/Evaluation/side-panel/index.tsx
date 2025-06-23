"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartSpline, History } from "lucide-react";
import EssayHistory from "./EssayHistory";
import EssayEvaluation from "./EssayEvaluation";

const SidePanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") || "history";

  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    if (newTab !== "insights") {
      params.delete("insight");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <TabsList className="w-full h-9 px-2 has-[>svg]:px-3">
        <TabsTrigger value="history" className="">
          <History className="h-5 w-5 mr-2" />
          History
        </TabsTrigger>
        <TabsTrigger value="insights" className="">
          <ChartSpline className="h-5 w-5 mr-2" />
          Insights
        </TabsTrigger>
      </TabsList>
      <EssayHistory />
      <EssayEvaluation />
    </Tabs>
  );
};

export default SidePanel;
