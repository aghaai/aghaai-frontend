import React from "react";
import EssayInputSide from "./essay-input-side";
import SidePanel from "./side-panel";

const EvaluationModule = () => {
  return (
    <div className="">
      <div className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <EssayInputSide />
        </div>
        <div className="w-full lg:col-span-1">
          <SidePanel />
        </div>
      </div>
    </div>
  );
};

export default EvaluationModule;
