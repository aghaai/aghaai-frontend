import React from "react";
import EssayInputSide from "./essay-input-side";
import SidePanel from "./side-panel";

const EvaluationModule = () => {
  return (
    <React.Fragment>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2">
          <EssayInputSide />
        </div>
        <div className="col-span-1">
          <SidePanel />
        </div>
      </div>
    </React.Fragment>
  );
};

export default EvaluationModule;
