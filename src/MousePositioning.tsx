import { useExperiment } from "@hcikit/react";
import { useEffect, useState } from "react";
import CommandSelection from "./CommandSelection";

const MousePositioning: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { advance, log } = useExperiment();

  return (
    <>
      <CommandSelection menu="" command="&nbsp;" items={[]} />
      <div className="top-[400px]  left-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute">
        <div
          style={{ transform: `translate(${x}px, ${y}px)` }}
          onClick={() => {
            advance();
          }}
          className="items-center flex aspect-square p-5  cursor-pointer align-middle rounded text-gray-700 shadow border border-gray-300 bg-gray-300 text-xl"
        >
          Click!
        </div>
      </div>
    </>
  );
};

export default MousePositioning;
