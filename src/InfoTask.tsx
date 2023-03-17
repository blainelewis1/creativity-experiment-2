import Markdown from "react-markdown";
import { Info, Close } from "@emotion-icons/material";
import { useState } from "react";

const InfoTask: React.FC<{ content: string }> = ({ content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="z-[101] absolute left-5 bottom-9 rounded shadow bg-white p-2 flex items-center justify-center"
      onClick={() => setOpen((prev) => !prev)}
    >
      {open ? (
        <div className="relative prose p-3">
          <div className="flex items-center">
            <div className="font-bold text-2xl mr-5 flex-1">Instructions</div>
            <Close className="h-5 w-5 cursor-pointer" />
          </div>
          <Markdown>{content}</Markdown>
        </div>
      ) : (
        <Info className="w-5 h-5 block fill-current text-gray-500" />
      )}
    </div>
  );
};

export default InfoTask;
