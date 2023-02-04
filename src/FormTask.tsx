import React, { useState } from "react";
import { JsonForms } from "@jsonforms/react";
import { CenteredNicePaper, FunctionTask, useExperiment } from "@hcikit/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { JsonSchema, UISchemaElement, JsonFormsCore } from "@jsonforms/core";
import { Button } from "@mui/material";

const FormTask: FunctionTask<{
  defaultState: any;
  schema: JsonSchema;
  uischema: UISchemaElement | undefined;
}> = ({ defaultState, schema, uischema }) => {
  const [data, setData] = useState(defaultState);
  const [errors, setErrors] = useState<JsonFormsCore["errors"]>([]);

  const { advance, log } = useExperiment();

  console.log(errors, data);

  return (
    <CenteredNicePaper>
      <div className="w-96">
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={data}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data, errors }) => {
            if ((errors?.length ?? 0) > 0) {
              log({ type: "FormError", errors });
            }

            log({ type: "FormChange", data });
            setErrors(errors);
            setData(data);
          }}
        />
        <Button onClick={() => advance()} disabled={Boolean(errors?.length)}>
          Next
        </Button>
      </div>
    </CenteredNicePaper>
  );
};

export default FormTask;
