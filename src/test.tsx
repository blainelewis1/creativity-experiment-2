import { useExperiment } from "@hcikit/react";
import { useEffect } from "react";

export default () => {
  let experiment = useExperiment();

  useEffect(() => {
    console.log("logging");
    experiment.log({ type: "test" });
  });

  console.log("rendering");

  return null;
};
