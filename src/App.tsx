import React from "react";
import Experiment, {
  ConsentForm,
  InformationScreen,
  DisplayText,
  ProgressBar,
  WizardProgress,
  withGridItem,
  ProgressText,
} from "@hcikit/react";
import S3Upload from "./S3Upload";

import CommandSelection from "./CommandSelection";
import DivergentTest from "./DivergentTest";
import CreativitySupportIndex from "./CreativitySupportIndex";
import configuration from "./configuration";
import Tutorial from "./Tutorial";
import Questionnaire from "./Questionnaire";
import NasaTlx from "./NasaTlx";
import DevTools from "./DevTools";
import FormTask from "./FormTask";
import BeginScreen from "./BeginScreen";
import TypingTask from "./TypingTask";
import MousePositioning from "./MousePositioning";
import Portalinator from "./Portalinator";
import RedirectTask from "./RedirectTask";

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
  Questionnaire,
  NasaTlx,
  S3Upload,
  ProgressText,
  FormTask,
  BeginScreen,
  TypingTask,
  MousePositioning,
  RedirectTask,
};

const App: React.FunctionComponent = () => {
  return (
    <>
      <Portalinator />
      <Experiment tasks={tasks} configuration={configuration} />
    </>
  );
};

export default App;
