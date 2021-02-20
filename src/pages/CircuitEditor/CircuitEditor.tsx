import * as React from "react";

import { cls } from "@/utils";

import Tessel, { TesselValue, TesselWindowItem } from "@/components/Tessel";

import CircuitFieldWindow from "./windows/CircuitFieldWindow";
import CircuitsTreeWindow from "./windows/CircuitsTreeWindow";
import NodeTrayWindow from "./windows/NodeTrayWindow";

export interface CircuitEditorProps {
  className?: string;
}

const WindowsById: Record<string, React.ComponentType> = {
  "node-tray": NodeTrayWindow,
  "circuit-field": CircuitFieldWindow,
  "circuits-list": CircuitsTreeWindow,
};

function renderWindow(window: TesselWindowItem): React.ReactElement | null {
  const Component = WindowsById[window.windowId];
  if (!Component) {
    return null;
  }
  return <Component {...window.windowProps} />;
}

const CircuitEditor: React.FC<CircuitEditorProps> = ({ className }) => {
  const [tesselItems, setTesselItems] = React.useState<TesselValue>({
    direction: "row",
    divisionPercent: 25,
    first: {
      direction: "column",
      divisionPercent: 30,
      first: "circuits-list",
      second: "node-tray",
    },
    second: "circuit-field",
  });

  return (
    <Tessel
      className={cls("circuit-editor", className)}
      rootItem={tesselItems}
      onLayoutChange={setTesselItems}
      renderWindow={renderWindow}
    />
  );
};

export default CircuitEditor;
