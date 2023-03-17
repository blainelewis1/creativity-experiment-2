import { useExperiment, withGridItem } from "@hcikit/react";
import React, { useEffect, useRef, useState } from "react";
import CommandSelection from "./CommandSelection";
import { TLDR, Tldraw, TldrawApp } from "@tldraw/tldraw";
import { MenuComponent, MenuItem, menus } from "@blainelewis1/menus";

import {
  ToolPalette,
  KeyboardShortcutsWithCheatsheet,
} from "@blainelewis1/menus";
import InfoTask from "./InfoTask";

const TLDrawTask: React.FC<{
  prompt: string;
  starterDocument?: any;
  timeLimit: number;
  menu: string;
  items: Array<MenuItem>;
  content: string;
}> = ({
  prompt,
  starterDocument,
  timeLimit = 5 * 1000 * 60,
  menu,
  items,
  content,
}) => {
  const startTime = useRef(Date.now());
  const experiment = useExperiment();
  const appRef = useRef<TldrawApp>();
  const document = useRef(starterDocument?.document);

  useEffect(() => {
    const id = setInterval(async () => {
      if (Date.now() > startTime.current + timeLimit) {
        clearInterval(id);

        // @ts-ignore
        const svg = TLDR.getSvgString(
          (await appRef.current?.getSvg(
            Object.keys(appRef.current?.page.shapes)
          )) as SVGElement,
          1
        );

        experiment.log({
          type: "FINISHED_DRAWING",
          document: appRef.current?.document,
          svg,
        });

        experiment.advance();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [experiment, timeLimit]);

  const Menu =
    (menus as Record<string, MenuComponent>)[menu] ||
    KeyboardShortcutsWithCheatsheet;
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="relative w-[1440px] h-[900px] border-2 border-gray-400 border-dashed">
        <InfoTask content={content} />

        <TimerDisplay timeLimit={timeLimit} startTime={startTime} />
        <Tldraw
          darkMode={false}
          log={experiment.log}
          document={document.current}
          Menu={Menu}
          // @ts-ignore
          onChange={(app: TldrawApp, reason) => {
            // TODO: find a way to log these.
            if (reason === "session:DrawSession") return;
            // console.log(app.document, reason);
            //@ts-ignore
            // experiment.log({
            //   type: "TLDRAW_CHANGE",
            //   // document: app.document,
            //   reason,
            // });
          }}
          appRef={appRef}
          menuProps={{
            items,
            position: "left",
          }}
        />
      </div>
    </div>
  );
};

const TimerDisplay: React.FC<{
  timeLimit: number;
  startTime: React.MutableRefObject<number>;
}> = ({ timeLimit, startTime }) => {
  const [, setShouldUpdate] = useState(0);

  useEffect(() => {
    const id = setInterval(async () => {
      setShouldUpdate((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const secondsRemaining = Math.max(
    (timeLimit - (Date.now() - startTime.current)) / 1000,
    0
  );

  return (
    <div className="absolute z-[100] bottom-10 left-[4.25rem]">
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
  );
};
export default withGridItem(TLDrawTask, "task");
