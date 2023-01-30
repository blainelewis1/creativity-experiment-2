import React from "react";
import {
  getConfigurationAtIndex,
  indexToTaskNumber,
  getTotalTasks,
  getCurrentIndex,
  getLeafIndex,
} from "@hcikit/workflow";

import { useConfiguration } from "@hcikit/react";

const ProgressText: React.FunctionComponent<{ depth?: number }> = ({
  depth = 0,
}) => {
  let configuration = useConfiguration();

  const index = getCurrentIndex(configuration);
  const rightHalf = index.slice(index.length - depth);
  const leftHalf = index.slice(0, index.length - depth);

  configuration = getConfigurationAtIndex(configuration, leftHalf);
  const currentTaskNumber = indexToTaskNumber(
    configuration,
    getLeafIndex(configuration, rightHalf)
  );
  const totalTasks = getTotalTasks(configuration);

  return (
    <div>
      {currentTaskNumber + 1} / {totalTasks}
    </div>
  );
};

export default ProgressText;
