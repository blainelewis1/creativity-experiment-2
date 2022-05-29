import { useExperiment, withGridItem } from "@hcikit/react";
import { Button } from "@material-ui/core";
import React, { useRef, useState } from "react";
import Slider from "./components/Slider";

const NasaTlx: React.FunctionComponent = () => {
  const { log, advance } = useExperiment();

  const questionsRef = useRef([
    {
      scale: ["Very Low", "Very High"],
      question: "How mentally demanding was the task?",
      title: "Mental Demand",
    },
    {
      scale: ["Very Low", "Very High"],
      question: "How physically demanding was the task?",
      title: "Physical Demand",
    },
    {
      scale: ["Very Low", "Very High"],
      question: "How hurried or rushed was the pace of the task?",
      title: "Temporal Demand",
    },
    {
      scale: ["Perfect", "Failure"],
      question:
        "How successful were you in accomplishing what you were asked to do?",
      title: "Performance",
    },
    {
      scale: ["Very Low", "Very High"],
      question:
        "How hard did you have to work to accomplish your level of performance?",
      title: "Effort",
    },
    {
      scale: ["Very Low", "Very High"],
      question:
        "How insecure, discouraged, irritated, stressed, and annoyed were you?",
      title: "Frustration",
    },
  ]);

  const [responses, setResponses] = useState<
    Record<string, number | undefined>
  >(() =>
    questionsRef.current.reduce(
      (acc, { title }) => ({ ...acc, [title]: undefined }),
      {}
    )
  );

  return (
    <div className="max-w-4xl py-12 mx-auto">
      <form
        onSubmit={(e) => {
          if (Object.values(responses).every((v) => v !== undefined)) {
            log({ type: "NasaTlx", responses });
            advance();
          }

          e.preventDefault();
          return false;
        }}
      >
        <div className="grid gap-10 px-4">
          {questionsRef.current.map(({ title, question, scale }) => (
            <div>
              {/* TODO: Style this */}
              <p>{title}</p>
              <p className="mb-3 text-lg font-light text-gray-700">
                {question}
              </p>
              <div className="flex gap-4 px-8 text-center">
                <span className="text-sm text-gray-700">{scale[0]}</span>
                {/* TODO: restyle the slider as well. */}
                <Slider
                  min="1"
                  max="21"
                  required
                  onChange={(e) => {
                    setResponses((prev) => ({
                      ...prev,
                      [title]: e.target.valueAsNumber,
                    }));
                  }}
                  value={responses[title]}
                />
                <span className="text-sm text-gray-700">{scale[1]}</span>
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
    </div>
  );
};

export default withGridItem(NasaTlx, "task");
