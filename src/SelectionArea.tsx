import React from "react";

const SelectionArea: React.FunctionComponent<{
  selectionAreaRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}> = ({ selectionAreaRef, children }) => {
  return (
    <div
      className="flex-1 w-full max-h-full mx-auto border-2 border-gray-400 border-dashed bg-gray-50"
      ref={selectionAreaRef}
    >
      {children}
    </div>
  );
};

export default SelectionArea;
