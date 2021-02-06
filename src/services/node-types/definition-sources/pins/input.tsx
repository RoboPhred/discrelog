import * as React from "react";

import { NodeDefinition } from "../../types";

const pinInputElementDefinition: NodeDefinition = {
  type: "pin-input",
  visual: {
    hitPath: `M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0`,
    component: () => (
      <path
        className="node-select-highlight--stroke"
        d="M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0 M35,25 h5"
        stroke="black"
        fill="none"
      />
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
