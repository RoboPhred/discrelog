import * as React from "react";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";

import Tessel, { TesselValue, TesselWindowItem } from "@/components/Tessel";

import CircuitFieldWindow from "./windows/CircuitFieldWindow";
import CircuitsTreeWindow from "./windows/CircuitsTreeWindow";
import NodeTrayWindow from "./windows/NodeTrayWindow";

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

const CircuitEditorPage: React.FC = () => {
  const [tesselItems, setTesselItems] = React.useState<TesselValue>({
    direction: "row",
    division: {
      firstSize: 200,
    },
    first: {
      direction: "column",
      division: 30,
      first: "circuits-list",
      second: "node-tray",
    },
    second: "circuit-field",
  });

  return (
    <Tessel
      className={cls("circuit-editor", sizing["fill-parent"])}
      rootItem={tesselItems}
      onLayoutChange={setTesselItems}
      renderWindow={renderWindow}
    />
  );
};

export default CircuitEditorPage;
