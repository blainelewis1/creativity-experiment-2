import React, { useEffect, useState } from "react";

const Portalinator: React.FunctionComponent = () => {
  const [currentPortal, setCurrentPortal] = useState<{
    endTime: number;
    element: React.ReactElement;
  } | null>(null);

  const [increment, setIncrement] = useState(0);

  useEffect(() => {
    //@ts-ignore
    window.portal = (duration, element) => {
      setCurrentPortal({ endTime: Date.now() + duration, element });
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (currentPortal && Date.now() < currentPortal.endTime) {
      interval = setInterval(() => setIncrement((i) => i + 1), 50);
    }
    return () => {
      if (interval !== null) {
        window.clearInterval(interval);
      }
    };
  }, [currentPortal]);

  // return currentPortal?.element ?? null;

  if (currentPortal && Date.now() < currentPortal.endTime) {
    return currentPortal.element;
  }

  return null;
};

export default Portalinator;
