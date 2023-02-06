import { CenteredNicePaper, useExperiment, FunctionTask } from "@hcikit/react";
import { Button } from "@mui/material";
import Markdown from "react-markdown";

const BeginScreen: FunctionTask<{ content: string }> = ({ content }) => {
  const experiment = useExperiment();
  return (
    <CenteredNicePaper centerX={true}>
      <div className="prose">
        <Markdown>{content}</Markdown>
      </div>
      <br />
      <Button color="primary" onClick={() => experiment.advance()}>
        Begin
      </Button>
    </CenteredNicePaper>
  );
};

export default BeginScreen;
