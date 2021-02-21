import * as React from "react";

import { NodeDefinition } from "../../types";

const hitPath = `M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0`;

const pinInputElementDefinition: NodeDefinition = {
  type: "pin-input",
  displayName: "Input Pin",
  visual: {
    hitPath,
    component: () => (
      <g>
        <path d={hitPath} fill="transparent" stroke="none" />
        <path
          className="node-select-highlight--stroke"
          d="M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0 M35,25 h5"
          stroke="black"
          fill="none"
        />
      </g>
    ),
  },
  pins: {
    OUT: {
      direction: "output",
      x: 40,
      y: 25,
    },
  },
};
export default pinInputElementDefinition;
