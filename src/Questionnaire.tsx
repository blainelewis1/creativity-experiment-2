import { useState } from "react";
import { Button } from "@mui/material";
import Slider from "./components/Slider";
import { useExperiment } from "@hcikit/react";

const Questionnaire: React.FunctionComponent<{
  questions: Array<{ label: string; key: string }>;
  title: string;
}> = ({ questions, title }) => {
  const { log, advance } = useExperiment();

  const [responses, setResponses] = useState<
    Record<string, number | undefined>
  >(() =>
    questions.reduce((acc, { key }) => ({ ...acc, [key]: undefined }), {})
  );

  return (
    <form
      onSubmit={(e) => {
        if (Object.values(responses).every((v) => v !== undefined)) {
          log({ type: "QuestionnaireResponses", responses });
          advance();
        }
        e.preventDefault();
        return false;
      }}
      className="max-w-4xl py-12 mx-auto"
    >
      <h1 className="mb-4 font-sans text-2xl font-bold">
        {title || "Questionnaire"}
      </h1>
      <p className="mb-4 font-bold">
        Please rate your agreement with the following statements:
      </p>
      <div className="grid gap-10 px-4">
        {questions.map(({ key, label }) => (
          <div>
            <p className="mb-3 text-lg font-light text-gray-700">{label}</p>
            <div className="flex gap-4 px-8 text-center">
              <span className="text-sm text-gray-700">Highly Disagree</span>
              <Slider
                min="0"
                max="100"
                required
                onChange={(e) => {
                  setResponses((prev) => ({
                    ...prev,
                    [key]: e.target.valueAsNumber,
                  }));
                }}
                value={responses[key]}
              />
              <span className="text-sm text-gray-700">Highly Agree</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto my-10 text-center">
        <Button type="submit" variant="contained" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
};

export default Questionnaire;
