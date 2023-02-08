import { MenuItem, menus } from "@blainelewis1/menus";
import { useExperiment, withGridItem } from "@hcikit/react";
import { useRef, useState } from "react";
import SelectionArea from "./SelectionArea";
import Markdown from "react-markdown";

import markingMenuVideo from "./tutorial-videos/marking-menu.mp4";
import keyboardShortcutVideo from "./tutorial-videos/keyboard-shortcut.mp4";
import toolPaletteVideo from "./tutorial-videos/tool-palette.mp4";
import { Button } from "@mui/material";

const videos: Record<string, string> = {
  KeyboardShortcutsWithCheatsheet: keyboardShortcutVideo,
  ToolPalette: toolPaletteVideo,
  MarkingMenu: markingMenuVideo,
};

const Tutorial: React.FunctionComponent<{
  menu: string;
  tutorialSelections?: number;
  items: Array<MenuItem>;
}> = ({ menu, tutorialSelections = 3, items }) => {
  const { advance } = useExperiment();
  let [selections, setSelections] = useState(new Set<string>());
  let [selectionTypes, setSelectionTypes] = useState(new Set<string>());

  const selectionsRemaining = 3 - selections.size;
  const Menu = menus[menu];
  const selectionAreaRef = useRef<HTMLDivElement>(null);
  const menuSpecificInstructions: Record<string, string> = {
    KeyboardShortcutsWithCheatsheet:
      "Keyboard shortcuts are used by pressing the prescribed modifier key (eg. command, ctrl, alt, etc.) and the corresponding keys. In this case there is a cheatsheet showing the shortcuts available.",
    ToolPalette:
      "A tool palette simply requires you to click on the tool you would like to select.",
    MarkingMenu: `A marking menu has two modes of invocation:
- As a beginner:
  1. Press the mouse button down and wait for a short delay. 
  2. After the delay, the menu items appear and you can simply draw a mark towards one of the items and release the mouse button to select it.
  3. In some cases there is a hierarchy of items and you must draw to the location of the parent item, and then its children will appear. 
  4. You can then complete the selection as before, by drawing a line to the item and then releasing.
- Alternatively you can select an item without waiting for the delay, simply by drawing the corresponding mark.`,
  };

  return (
    <div className="flex flex-col h-full max-w-4xl py-8 mx-auto">
      <div className="prose">
        <h1>Tutorial</h1>
        {/* @ts-ignore */}
        <Markdown>{menuSpecificInstructions[menu] || ""}</Markdown>
        <video
          src={videos[menu] || ""}
          autoPlay
          muted
          controls
          loop
          className="mx-auto mb-8"
        />
        <p className="mb-4">
          To continue to the main experiment select 3 unique items from the
          menu. Selected so far: {Array.from(selections).join(", ") || "none"}{" "}
          <span className="font-bold ">
            ({Math.max(0, selectionsRemaining)} remaining).
          </span>
        </p>
        {menu === "MarkingMenu" ? (
          <p className="mb-4">
            You must also select an item at least once after waiting for it to
            appear, and once before it appears:{" "}
            {Array.from(selectionTypes).join(", ") || "none"}.
          </p>
        ) : null}
      </div>
      <SelectionArea selectionAreaRef={selectionAreaRef}>
        <Menu
          //@ts-ignore
          onSelectItem={(label: string | null, mode) => {
            selectionTypes = new Set(selectionTypes);
            selectionTypes.add(mode);
            setSelectionTypes(selectionTypes);

            if (label === null) {
              return;
            }

            selections = new Set(selections);
            selections.add(label);

            setSelections(selections);
          }}
          items={items}
          parent={selectionAreaRef}
        />
      </SelectionArea>
      <div className="mt-4 text-center">
        <Button
          disabled={
            !(
              selections.size >= 3 &&
              (menu !== "MarkingMenu" || selectionTypes.size === 2)
            )
          }
          onClick={() => advance()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default withGridItem(Tutorial, "task");
