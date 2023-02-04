import { CenteredNicePaper, useExperiment, FunctionTask } from "@hcikit/react";
import { Button } from "@mui/material";

const BeginScreen: FunctionTask<{ content: string }> = ({ content }) => {
  const experiment = useExperiment();
  return (
    <CenteredNicePaper centerX={true}>
      <div className="prose">{content}</div>
      <br />
      <Button color="primary" onClick={() => experiment.advance()}>
        Begin
      </Button>
    </CenteredNicePaper>
  );
};

export default BeginScreen;
