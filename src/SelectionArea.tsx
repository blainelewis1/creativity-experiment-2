import React from "react";

const SelectionArea: React.FunctionComponent<{
  selectionAreaRef: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}> = ({ selectionAreaRef, children }) => {
  return (
    <div
      className="w-[800px] h-[600px] box-content relative mx-auto border-2 border-gray-400 border-dashed bg-gray-50"
      ref={selectionAreaRef}
    >
      {children}
    </div>
  );
};

export default SelectionArea;
