import { useExperiment } from "@hcikit/react";
import { useEffect, useRef, useState } from "react";
import CommandSelection from "./CommandSelection";
import { Tldraw, TldrawApp } from "@tldraw/tldraw";
import { MenuComponent, MenuItem, menus } from "@blainelewis1/menus";

import {
  ToolPalette,
  KeyboardShortcutsWithCheatsheet,
} from "@blainelewis1/menus";

// import { Redo, Undo } from "emotion-icons/material";
import { ColorFill } from "emotion-icons/boxicons-solid";

import {
  CursorArrowIcon,
  EraserIcon,
  Pencil1Icon,
  SquareIcon,
  ArrowTopRightIcon,
  CircleIcon,
  VercelLogoIcon,
  TrashIcon,
  CopyIcon,
  RotateCounterClockwiseIcon, // TODO: this shoul;d probably be clockwise...
  // TODO: handle colour icons?
  // line dash icons are in tldraw itself
  // size icons are in tldraw itself too.
} from "@radix-ui/react-icons";

import {
  Redo,
  Undo,
  ColorFill as ColorNoFill,
} from "emotion-icons/boxicons-regular";

const TLDrawTask: React.FC<{
  prompt: string;
  starterDocument?: any;
  timeLimit: number;
  menu: string;
}> = ({ prompt, starterDocument, timeLimit = 5 * 1000 * 60, menu }) => {
  const startTime = useRef(Date.now());
  const [, setShouldUpdate] = useState(0);
  const experiment = useExperiment();
  const appRef = useRef<TldrawApp>();

  useEffect(() => {
    const id = setInterval(() => {
      setShouldUpdate((prev) => prev + 1);

      if (Date.now() > startTime.current + timeLimit) {
        experiment.log({
          type: "FINISHED_DRAWING",
          document: appRef.current?.document,
        });
        experiment.advance();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [experiment, timeLimit]);

  const secondsRemaining = Math.max(
    (timeLimit - (Date.now() - startTime.current)) / 1000,
    0
  );

  const Menu =
    (menus as Record<string, MenuComponent>)[menu] ||
    KeyboardShortcutsWithCheatsheet;

  return (
    <>
      <div className="fixed z-[100] bottom-10 left-10">
        Time remaining:{" "}
        <span className="font-mono font-medium">
          <span>{Math.trunc(secondsRemaining / 60)}</span>:
          <span>
            {Math.trunc(secondsRemaining % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        </span>
      </div>
      <Tldraw
        document={starterDocument?.document}
        Menu={Menu}
        // @ts-ignore
        onChange={(app: TldrawApp, reason) => {
          // TODO: find a way to log these.
          console.log(app.document, reason);
        }}
        appRef={appRef}
        menuProps={{
          items: [
            {
              icon: CursorArrowIcon,
              label: "select",
              angle: Math.PI,
              shortcut: "1",
            },
            { icon: Pencil1Icon, label: "draw", angle: 0, shortcut: "2" },

            { icon: EraserIcon, label: "erase", angle: 0, shortcut: "3" },

            { icon: SquareIcon, label: "rectangle", angle: 0, shortcut: "4" },
            // TODO: Line icon doesnt exit
            // { icon: ArrowTopRightIcon, label: "line", angle: 0, shortcut: "5" },
            { icon: CircleIcon, label: "ellipse", angle: 0, shortcut: "5" },
            {
              icon: VercelLogoIcon,
              label: "triangle",
              angle: 0,
              shortcut: "6",
            },

            { icon: Undo, label: "undo", angle: Math.PI, shortcut: "mod+z" },
            { icon: Redo, label: "redo", angle: 0, shortcut: "mod+y" },

            {
              icon: TrashIcon,
              label: "delete",
              angle: 0,
              shortcut: "backspace",
            },

            {
              icon: CopyIcon,
              label: "duplicate",
              angle: 0,
              shortcut: "mod+d",
            },

            {
              icon: RotateCounterClockwiseIcon,
              label: "rotate",
              angle: 0,
              shortcut: "mod+e",
            },

            {
              icon: ColorFill,
              label: "fill",
              angle: 0,
              shortcut: "mod+f",
            },

            {
              icon: ColorNoFill,
              label: "nofill",
              angle: 0,
              shortcut: "mod+shift+f",
            },
          ],
        }}
      />
    </>
  );
};

export default TLDrawTask;
