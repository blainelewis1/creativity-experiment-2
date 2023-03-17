import { useExperiment } from "@hcikit/react";
import { useEffect, useState } from "react";
import CommandSelection from "./CommandSelection";

const TypingTask: React.FC<{ prompt: string }> = ({ prompt }) => {
  const { advance, log } = useExperiment();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    function handleKey({ key }: KeyboardEvent) {
      log({ key, type: "KEY_PRESSED" });

      if (key === prompt[index]) {
        setIndex((index) => index + 1);
        log({ key, type: "CORRECT_KEY" });

        if (index + 1 === prompt.length) {
          advance();
        }
      } else {
        log({ key, type: "INCORRECT_KEY" });
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [prompt, log, advance, index]);

  return (
    <>
      <CommandSelection menu="" command="&nbsp;" items={[]} />
      <div className="text-center w-full absolute py-8 text-xl">
        <div>
          <span className="text-gray-400">{prompt.slice(0, index)}</span>
          <span className="text-gray-200">
            {prompt.slice(index, prompt.length)}
          </span>
        </div>
      </div>
      <div className="absolute thin text-gray-500 top-[400px] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        Type command to begin...
      </div>
    </>
  );
};

export default TypingTask;
