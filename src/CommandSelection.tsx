import { useExperiment, withGridItem } from "@hcikit/react";
import { useRef } from "react";
import { Menu, MenuComponent, MenuItem, menus } from "@blainelewis1/menus";
import SelectionArea from "./SelectionArea";

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
      <div className={`text-center text-xl text-gray-700`}>{command}</div>
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
