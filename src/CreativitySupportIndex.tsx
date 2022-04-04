import { useExperiment, withGridItem } from "@hcikit/react";
import { Button } from "@material-ui/core";
import { shuffle } from "lodash";
import React, { useState } from "react";
import "./slider.css";

const CreativitySupportIndex: React.FunctionComponent = () => {
  // TODO: I should consider using the actual experiment framework and a generator to do the CSI bits... Like split out a PairedFactor component and an AgreementStatement component, then generate a config that works for it...
  const { log, advance } = useExperiment();
  const [currentIndex, setCurrentIndex] = useState(0);

  const states = [
    <AgreementStatements
      onComplete={(responses) => {
        log({ type: "AgreementResponses", responses });
        setCurrentIndex((prev) => prev + 1);
      }}
    />,
    <PairedFactors
      onComplete={(responses) => {
        log({ type: "PairedFactors", responses });
        advance();
      }}
    />,
  ];

  return <div className="max-w-4xl py-12 mx-auto ">{states[currentIndex]}</div>;
};

const AgreementStatements: React.FunctionComponent<{
  onComplete: (responses: Record<string, number>) => void;
}> = ({ onComplete }) => {
  // TODO: maybe split it into two screens?
  const questions = shuffle([
    // "The system or tool allowed other people to work with me easily.",
    // "It was really easy to share ideas and designs with other people inside this system or tool.",
    "I would be happy to use this system or tool on a regular basis.",
    "I enjoyed using the system or tool.",
    "It was easy for me to explore many different ideas, options, designs, or outcomes, using this system or tool.",
    "The system or tool was helpful in allowing me to track different ideas, outcomes, possibilities.",
    "I was able to be very creative while doing the activity inside this system or tool.",
    "The system or tool allowed me to be very expressive.",
    "My attention was fully tuned to the activity, and I forgot about the system or tool that I was using.",
    "I became so absorbed in the activity that I forgot about the system or tool that I was using.",
    "I was satisfied with what I got out of the system or tool.",
    "What I was able to produce was worth the effort I had to exert to produce it.",
  ]);

  const [responses, setResponses] = useState<
    Record<string, number | undefined>
  >(
    questions.reduce((acc, question) => ({ ...acc, [question]: undefined }), {})
  );

  return (
    <form
      onSubmit={(e) => {
        if (Object.values(responses).every((v) => v !== undefined)) {
          onComplete(responses as Record<string, number>);
        }
        e.preventDefault();
        return false;
      }}
    >
      <p className="mb-4 font-bold">
        Please rate your agreement with the following statements:
      </p>
      <div className="grid gap-10 px-4">
        {questions.map((question) => (
          <div>
            <p className="mb-3 text-lg font-light text-gray-700">{question}</p>
            <div className="flex gap-4 px-8 text-center">
              <span className="text-sm text-gray-700">Highly Disagree</span>
              <input
                className="flex-1 w-full cursor-pointer slider"
                required
                type="range"
                value={responses[question]}
                onChange={(e) => {
                  console.log(e.target);
                  setResponses((prev) => ({
                    ...prev,
                    [question]: e.target.valueAsNumber,
                  }));
                }}
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

// https://stackoverflow.com/a/43241287

const PairedFactors: React.FunctionComponent<{
  onComplete: (
    responses: Array<{
      factors: [string, string];
      response: 0 | 1 | undefined;
    }>
  ) => void;
}> = ({ onComplete }) => {
  const factors = [
    "Be creative and expressive",
    "Become immersed in the activity",
    "Enjoy using the system or tool",
    "Explore many different ideas, outcomes, or possibilities",
    "Produce results that are worth the effort I put in",
    "Work with other people",
  ];

  const comparisons = shuffle(
    factors.flatMap((v, i) => factors.slice(i + 1).map((w) => [v, w]))
  );

  const [currentComparison, setCurrentComparison] = useState(0);
  const [responses, setResponses] = useState<
    Array<{
      factors: [string, string];
      response: 0 | 1 | undefined;
    }>
  >(comparisons.map(([a, b]) => ({ factors: [a, b], response: undefined })));

  return (
    <form
      onSubmit={(e) => {
        if (currentComparison === comparisons.length - 1) {
          onComplete(responses);
        } else {
          setCurrentComparison((prev) => prev + 1);
        }
        e.preventDefault();
        return false;
      }}
    >
      <p className="mb-4 font-bold">
        When doing this task it's most important that I'm able to...
      </p>
      <div className="flex items-center justify-center mx-auto my-10 text-center">
        {responses[currentComparison].factors.map((factor, j) => (
          <label>
            {j === 0 ? factor : ""}
            <input
              type="radio"
              className="mx-3"
              checked={responses[currentComparison].response === j}
              onChange={() =>
                setResponses((prev) =>
                  prev.map((response, i) =>
                    i === currentComparison
                      ? { ...response, response: j as 0 | 1 }
                      : response
                  )
                )
              }
            />
            {j === 1 ? factor : ""}
          </label>
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

export default withGridItem(CreativitySupportIndex, "task");
