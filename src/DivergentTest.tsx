import { useExperiment, withGridItem } from "@hcikit/react";
import { Button } from "@mui/material";
import { pickBy } from "lodash";
import { useEffect, useRef, useState } from "react";

const DivergentTest: React.FunctionComponent<{
  question: string;
  timeLimit: number;
}> = ({ question, timeLimit = 60 * 3 * 1000 }) => {
  // TODO: could be nice if this was a multi-step piece as well, with one step being the judging and one step being the question
  const { log, advance } = useExperiment();
  const [values, setValues] = useState<Array<string>>([]);
  const [, setShouldUpdate] = useState(0);
  const [locked, setLocked] = useState(false);
  const [topTwo, setTopTwo] = useState<Array<boolean>>([]);
  const [message, setMessage] = useState("");
  const startTime = useRef(Date.now());

  useEffect(() => {
    log({ type: "DIVERGENT_CHANGE", values });
  }, [values, log]);

  useEffect(() => {
    setTimeout(() => {
      setLocked(true);
    }, timeLimit);

    // This is on purpose, the time limit has already started, you can't just change it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setShouldUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const secondsRemaining = Math.max(
    (timeLimit - (Date.now() - startTime.current)) / 1000,
    0
  );

  return (
    <form
      className="max-w-3xl py-8 mx-auto"
      onSubmit={(e) => {
        const selectedTwo = Object.keys(pickBy(topTwo, (v) => v));
        if (selectedTwo.length === Math.min(values.length, 2)) {
          log({ type: "DivergentTest", values, topTwo });
          advance();
        } else if (selectedTwo.length > 2) {
          setMessage("You may only choose 2 of your responses.");
        } else {
          setMessage("You must choose 2 of your responses.");
        }

        e.preventDefault();
        return false;
      }}
    >
      <p className="mb-4 font-bold font-large">
        {locked ? "Now select your top two most creative responses." : question}
      </p>
      <p className="mb-4 font-bold font-large">{message}</p>{" "}
      {locked ? (
        <>
          <div
            className="grid items-center gap-2"
            style={{ gridTemplateColumns: "min-content auto" }}
          >
            {values.map((value, i) => (
              <label className="contents">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setTopTwo((prev) => {
                      let newVal = [...prev];
                      newVal[i] = e.target.checked;
                      return newVal;
                    });
                  }}
                  checked={topTwo[i]}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
          <div className="my-8 text-center">
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </div>
        </>
      ) : (
        <>
          <Inputs
            values={values}
            onChange={(newValues) => setValues(newValues)}
          />
          <div className="py-6">
            Time remaining:{" "}
            <span className="font-mono font-medium">
              <span>{Math.trunc(secondsRemaining / 60)}</span>:
              <span>
                {Math.trunc(secondsRemaining % 60)
                  .toString()
                  .padStart(2, "0")}
              </span>
            </span>
          </div>
        </>
      )}
    </form>
  );
};

const Inputs: React.FunctionComponent<{
  values: Array<string>;
  onChange: (newValues: Array<string>) => void;
}> = ({ values, onChange }) => {
  values = [...values, ""];
  return (
    <div className="flex flex-col gap-2">
      {values.map((value, i) => (
        <input
          key={i}
          className="px-4 py-2 border border-gray-400 rounded"
          type="text"
          value={value}
          tabIndex={i + 1}
          placeholder="Enter a response..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // @ts-ignore
              document.querySelector(`input[tabindex="${i + 2}"]`)?.focus();
            }
          }}
          onChange={(e) =>
            onChange(
              values
                .map((value, j) => (j === i ? e.target.value : value))
                .filter(Boolean)
            )
          }
        />
      ))}
    </div>
  );
};

export default withGridItem(DivergentTest, "task");
