import React from "react";
import Experiment, {
  ConsentForm,
  InformationScreen,
  DisplayText,
  ProgressBar,
  WizardProgress,
  DevTools,
  withGridItem,
} from "@hcikit/react";

import CommandSelection from "./CommandSelection";
import DivergentTest from "./DivergentTest";
import CreativitySupportIndex from "./CreativitySupportIndex";
import configuration from "./configuration";
import Tutorial from "./Tutorial";

const ProseConsentForm = withGridItem(({ children, ...props }) => {
  return (
    <div className="mx-auto prose max-w-none">
      {/* @ts-ignore */}
      <ConsentForm {...props} />
    </div>
  );
}, "task");

let tasks = {
  ConsentForm: ProseConsentForm,
  InformationScreen,
  DisplayText,
  ProgressBar,
  WizardProgress,
  DevTools,
  CommandSelection,
  DivergentTest,
  CreativitySupportIndex,
  Tutorial,
};

const App: React.FunctionComponent = () => {
  return <Experiment tasks={tasks} configuration={configuration} />;
};

export default App;
