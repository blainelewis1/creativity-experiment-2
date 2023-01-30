import { useExperiment, withGridItem } from "@hcikit/react";
import { useRef } from "react";
import { MenuComponent, MenuItem, menus } from "@blainelewis1/menus";
import SelectionArea from "./SelectionArea";
import ProgressText from "./ProgressText";
const CommandSelection: React.FunctionComponent<{
  command: string;
  items: Array<MenuItem>;
  menu: string;
}> = ({ command, items, menu }) => {
  const selectionAreaRef = useRef<HTMLDivElement>(null);
  const { advance, log } = useExperiment();

  const Menu = (menus as Record<string, MenuComponent>)[menu];

  return (
    <div className="flex flex-col w-2/3 h-full gap-4 py-8 mx-auto">
      <div className={`text-center  `}>
        <span className="text-xl text-gray-700">{command}</span>
        <span className="text-sm text-gray-400">
          <ProgressText depth={1} />
        </span>
      </div>
      <SelectionArea selectionAreaRef={selectionAreaRef}>
        <Menu
          parent={selectionAreaRef}
          onSelectItem={(item: string | null) => {
            if (item === command) {
              advance();
            } else {
              log({ type: "WRONG_COMMAND", item });
            }
          }}
          items={items}
        />
      </SelectionArea>
    </div>
  );
};

export default withGridItem(CommandSelection, "task");
