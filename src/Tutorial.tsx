import { MenuItem, menus } from "@blainelewis1/menus";
import { useExperiment, withGridItem } from "@hcikit/react";
import { useRef, useState } from "react";
import SelectionArea from "./SelectionArea";

import markingMenuVideo from "./tutorial-videos/marking-menu.mp4";
import keyboardShortcutVideo from "./tutorial-videos/keyboard-shortcut.mp4";
import toolPaletteVideo from "./tutorial-videos/tool-palette.mp4";

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

  const selectionsRemaining = 3 - selections.size;
  const Menu = menus[menu];
  const selectionAreaRef = useRef<HTMLDivElement>(null);
  const menuSpecificInstructions = {
    KeyboardShortcutsWithCheatsheet:
      "Keyboard shortcuts are used by pressing the prescribed modifier key (eg. command, ctrl, alt, etc.) and the corresponding keys. In this case there is a cheatsheet showing the shortcuts available.",
    ToolPalette:
      "A tool palette simply requires you to click on the tool you would like to select.",
    MarkingMenu:
      "A marking menu has two modes of invocation. As a beginner you can press the mouse button down and wait for a short delay. After the delay the menu items appear, and you can simply draw a mark towards one of the menus and release to select it. In some cases there is a hierarchy of items and you must draw to the location of the parent item, and then its children will appear. You can then complete the selection as before, by drawing a line to the item and then releasing. Alternatively you can select an item without waiting for the delay, simply by drawing the corresponding mark.",
  };

  const moreInstructions = `To continue to the main experiment select ${selectionsRemaining} unique items from the menu. Selected so far: ${
    Array.from(selections).join(", ") || "none"
  }.`;

  return (
    <div className="flex flex-col h-full max-w-4xl py-8 mx-auto">
      <h1 className="mb-4 text-2xl">Tutorial</h1>
      {/* @ts-ignore */}
      <p className="mb-3">{menuSpecificInstructions[menu] || ""}</p>
      <video
        src={videos[menu] || ""}
        autoPlay
        muted
        controls
        loop
        className="w-2/3 mx-auto mb-8"
      />
      <p className="font-bold mb-4">{moreInstructions}</p>
      <SelectionArea selectionAreaRef={selectionAreaRef}>
        <Menu
          onSelectItem={(label: string | null) => {
            if (label === null) {
              return;
            }

            selections = new Set(selections);
            selections.add(label);

            if (selections.size === 3) {
              advance();
            } else {
              setSelections(selections);
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
