import React from "react";

const SelectionArea: React.FunctionComponent<{
  selectionAreaRef: React.Ref<HTMLDivElement>;
}> = ({ selectionAreaRef, children }) => {
  return (
    <div
      className="flex-1 w-full mx-auto border-2 border-gray-400 border-dashed bg-gray-50"
      ref={selectionAreaRef}
    >
      {children}
    </div>
  );
};

export default SelectionArea;