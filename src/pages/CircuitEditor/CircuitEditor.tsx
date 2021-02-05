import useSelector from "@/hooks/useSelector";
import { averageMsecsPerTickSelector } from "@/services/simulator/selectors/performance";
import * as React from "react";

import { Mosaic, MosaicBranch, MosaicWindow } from "react-mosaic-component";

import CircuitFieldView from "./components/CircuitFieldView";
import CircuitsTree from "./components/CircuitsTree";
import NodeTray from "./components/NodeTray";

export interface CircuitEditorProps {
  className?: string;
}

// TODO: MosaicWindows should be implemented by these components
const CircuitField: React.FC<{ path: MosaicBranch[]; id: string }> = ({
  path,
  id,
}) => {
  const avgMsecsPerTick = useSelector(averageMsecsPerTickSelector);
  const title = `Circuit Field (${avgMsecsPerTick} ms)`;
  return (
    <MosaicWindow path={path} title={title}>
      <CircuitFieldView />
    </MosaicWindow>
  );
};

function wrapInDummyWindow(
  Component: React.ComponentType
): React.FC<{ id: string; path: MosaicBranch[] }> {
  return ({ id, path }) => (
    <MosaicWindow path={path} title={id}>
      <Component />
    </MosaicWindow>
  );
}

const WindowMap = {
  "node-tray": wrapInDummyWindow(NodeTray),
  "circuit-field": CircuitField,
  "circuit-tree": wrapInDummyWindow(CircuitsTree),
};

const CircuitEditor: React.FC<CircuitEditorProps> = ({ className }) => {
  return (
    <div className={className}>
      <Mosaic<keyof typeof WindowMap>
        renderTile={(id, path) => {
          const Component = WindowMap[id];
          return <Component id={id as any} path={path} />;
        }}
        initialValue={{
          direction: "row",
          first: "node-tray",
          second: {
            direction: "row",
            first: "circuit-field",
            second: "circuit-tree",
            splitPercentage: 60,
          },
          splitPercentage: 20,
        }}
      ></Mosaic>
    </div>
  );
};

export default CircuitEditor;
