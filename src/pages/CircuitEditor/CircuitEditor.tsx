import * as React from "react";

import { Mosaic, MosaicWindow } from "react-mosaic-component";

import CircuitFieldView from "./components/CircuitFieldView";
import ElementTray from "./components/ElementTray";

export interface CircuitEditorProps {
  className?: string;
}

const WindowMap = {
  elements: <ElementTray />,
  "circuit-field": <CircuitFieldView />,
};

const CircuitEditor: React.FC<CircuitEditorProps> = ({ className }) => {
  return (
    <div className={className}>
      <Mosaic<keyof typeof WindowMap>
        renderTile={(id, path) => (
          <MosaicWindow path={path} title={id}>
            {WindowMap[id]}
          </MosaicWindow>
        )}
        initialValue={{
          direction: "row",
          first: "elements",
          second: "circuit-field",
          splitPercentage: 20,
        }}
      ></Mosaic>
    </div>
  );
};

export default CircuitEditor;
