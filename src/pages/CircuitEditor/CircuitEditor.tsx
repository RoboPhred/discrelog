import * as React from "react";

import { Mosaic } from "react-mosaic-component";

import CircuitFieldWindow from "./windows/CircuitFieldWindow";
import CircuitsTreeWindow from "./windows/CircuitsTreeWindow";
import NodeTrayWindow from "./windows/NodeTrayWindow";

export interface CircuitEditorProps {
  className?: string;
}

const WindowMap = {
  "node-tray": NodeTrayWindow,
  "circuit-field": CircuitFieldWindow,
  "circuit-tree": CircuitsTreeWindow,
};

const CircuitEditor: React.FC<CircuitEditorProps> = ({ className }) => {
  return (
    <div className={className}>
      <Mosaic<keyof typeof WindowMap>
        renderTile={(id, path) => {
          const Component = WindowMap[id];
          return <Component path={path} />;
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
