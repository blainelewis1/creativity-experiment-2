import React, { useEffect, useState } from "react";
import { IconButton, Slider, Card } from "@mui/material";
import FastForward from "@mui/icons-material/FastForward.js";
import SkipNext from "@mui/icons-material/SkipNext.js";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious.js";
import SkipPrevious from "@mui/icons-material/SkipPrevious.js";
import FastRewind from "@mui/icons-material/FastRewind.js";

import {
  taskNumberToIndex,
  indexToTaskNumber,
  getPropsFor,
  getLeafIndex,
  getTotalTasks,
  getCurrentIndex,
} from "@hcikit/workflow";

import styled from "@emotion/styled";
import { useConfiguration, useExperiment } from "@hcikit/react";

// TODO: making all of material ui icons a peer dependency instead of a dependency seems silly when they're probably just svgs abnd not dependent on the rest of material ui.

const StyledCard = styled(Card)`
  display: inline-block;
  position: fixed;
`;
const Controls = styled.div`
  display: flex;
`;
const StyledSlider = styled(Slider)`
  margin-left: 10px;
  margin-right: 10px;
`;

/**
 * TODO:
 * move to the bottom right or somewhere instead.
 * find a better way to represent labels, maybe a way to expand it?
 * add other things like a reset session or soemthing
 */

export const DevTools: React.FunctionComponent<{
  showInProduction: boolean;
}> = ({ showInProduction = false }) => {
  const configuration = useConfiguration();
  const experiment = useExperiment();

  const [isDragging, setIsDragging] = useState(false);
  const [relativePosition, setRelativePosition] = useState({ x: 0, y: 0 });

  const [position, setPosition] = useState({ bottom: 0, right: 0 });

  // TODO: I broke dragging
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (isDragging) {
        // TODO: use bottom right instead.
        setPosition({
          bottom: e.pageY - relativePosition.y,
          right: e.pageX - relativePosition.x,
        });
      }
    }

    function handleMouseUp() {
      setIsDragging(false);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
    // TODO: I've done something wrong here. Like quite wrong.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: set the marks to the top level sections
  // TODO: you should be able to use it in production but need an extra prop or something.

  if (process.env.NODE_ENV === "production" && !showInProduction) {
    return null;
  }

  let topLevelTasks: Array<{ value: number; label: string | undefined }> = [];

  if (configuration.children) {
    topLevelTasks = configuration.children.map((_: unknown, i: number) => ({
      value: indexToTaskNumber(configuration, getLeafIndex(configuration, [i])),
      label: getPropsFor(configuration, [i]).task,
    }));
  }

  // return null;
  return (
    <StyledCard
      className="p-4"
      onMouseDown={(e: React.MouseEvent) => {
        // setIsDragging(true);
        // setRelativePosition({
        //   x: e.pageX - position.left,
        //   y: e.pageY - position.top,
        // });
      }}
      style={{ ...position, zIndex: 1000 }}
    >
      <Controls>
        <IconButton
          onClick={() => {
            let currentIndex = getCurrentIndex(configuration);
            let newIndex = currentIndex.slice(
              0,
              currentIndex.length > 1 ? currentIndex.length - 1 : 1
            );

            newIndex[newIndex.length - 1] = newIndex[newIndex.length - 1] - 1;
            experiment.advance(getLeafIndex(configuration, newIndex));
          }}
        >
          <SkipPrevious />
        </IconButton>
        <IconButton
          onClick={() =>
            experiment.advance(
              taskNumberToIndex(
                configuration,
                indexToTaskNumber(
                  configuration,
                  getCurrentIndex(configuration)
                ) - 1
              )
            )
          }
        >
          <FastRewind />
        </IconButton>
        <IconButton onClick={() => experiment.advance()}>
          <FastForward />
          {/* <div className="cursor-pointer" onClick={() => experiment.advance()}>
            Next &gt;
          </div> */}
        </IconButton>
        <IconButton
          onClick={() => {
            let currentIndex = getCurrentIndex(configuration);
            let newIndex = currentIndex.slice(
              0,
              currentIndex.length > 1 ? currentIndex.length - 1 : 1
            );

            newIndex[newIndex.length - 1] = newIndex[newIndex.length - 1] + 1;
            experiment.advance(getLeafIndex(configuration, newIndex));
          }}
        >
          <SkipNext />
        </IconButton>
      </Controls>
      <StyledSlider
        step={1}
        valueLabelDisplay="auto"
        value={indexToTaskNumber(configuration, getCurrentIndex(configuration))}
        marks={topLevelTasks}
        min={0}
        max={getTotalTasks(configuration)}
        onChange={(_: Event, value: number | Array<number>) => {
          experiment.advance(taskNumberToIndex(configuration, value as number));
        }}
      />
    </StyledCard>
  );
};

export default DevTools;
