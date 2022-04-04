import { menus } from "@blainelewis1/menus";
import { useExperiment, withGridItem } from "@hcikit/react";
import { useRef } from "react";
import {
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
  Copy,
} from "styled-icons/fa-solid";
import SelectionArea from "./SelectionArea";

const items = [
  { icon: Save, label: "Save" },
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: AlignLeft, label: "Align Left" },
  { icon: AlignCenter, label: "Align Center" },
  { icon: AlignRight, label: "Align Right" },
  { icon: AlignJustify, label: "Align Justify" },
  { icon: Copy, label: "Copy" },
];

const Tutorial: React.FunctionComponent<{ menu: string }> = ({ menu }) => {
  const { advance } = useExperiment();
  const Menu = menus[menu];
  const selectionAreaRef = useRef<HTMLDivElement>(null);
  const menuSpecificInstructions = {
    Toolbar:
      "The toolbar is always visible across the top of the target area. To select an item you can simply click the corresponding button",
    ContextMenu:
      "Right click anywhere within the target area to open the menu. Once the menu is open you can click any of the items to complete the selection.",
  };

  const moreInstructions =
    'To continue to the main experiment select the "save" item.';

  return (
    <div className="flex flex-col h-full max-w-4xl py-8 mx-auto">
      <h1 className="mb-4 text-2xl">Tutorial</h1>
      {/* @ts-ignore */}
      <p className="mb-3">{menuSpecificInstructions[menu] || ""}</p>
      <p className="font-bold">{moreInstructions}</p>
      <SelectionArea selectionAreaRef={selectionAreaRef}>
        <Menu
          onSelectItem={(item) => {
            if (item === "Save") {
              advance();
            }
          }}
          items={items}
          parent={selectionAreaRef}
        />
      </SelectionArea>
    </div>
  );
};

export default withGridItem(Tutorial, "task");
