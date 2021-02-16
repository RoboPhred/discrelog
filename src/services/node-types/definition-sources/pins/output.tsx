import * as React from "react";

import { NodeDefinition } from "../../types";

const pinOutputElementDefinition: NodeDefinition = {
  type: "pin-output",
  visual: {
    hitPath: `M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0`,
    component: () => (
      <path
        className="node-select-highlight--stroke"
        d="M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0 M15,25 h-5"
        stroke="black"
        fill="none"
      />
    ),
  },
  pins: {
    IN: {
      direction: "input",
      x: 10,
      y: 25,
    },
  },
};
export default pinOutputElementDefinition;