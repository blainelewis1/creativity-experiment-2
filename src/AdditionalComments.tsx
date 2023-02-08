import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { CenteredNicePaper, FunctionTask, useExperiment } from "@hcikit/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonSchema, UISchemaElement, JsonFormsCore } from "@jsonforms/core";
import { Button, TextareaAutosize } from "@mui/material";

const FormTask: FunctionTask<{
  defaultState: any;
  schema: JsonSchema;
  uischema: UISchemaElement | undefined;
}> = () => {
  const [data, setData] = useState("");
  const { advance, log } = useExperiment();

  return (
    <CenteredNicePaper>
      <div className="prose">
        <p>
          Do you have any additional comments or did you encounter any issues?
        </p>
        <textarea
          autoFocus
          className="bg-gray-50 rounded w-full p-2"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <br />
        <Button
          onClick={() => {
            log({ type: "COMMENTS", data });
            advance();
          }}
        >
          Next
        </Button>
      </div>
    </CenteredNicePaper>
  );
};

export default FormTask;
