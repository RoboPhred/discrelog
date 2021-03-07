import * as React from "react";
import getBounds from "svg-path-bounds";

import { boundsToRect } from "@/geometry";

import { NodeDefinition } from "../../types";

const hitPath = `M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0`;

const pinOutputElementDefinition: NodeDefinition = {
  type: "pin-output",
  category: "i/o",
  displayName: "Output Pin",
  visual: {
    hitRect: boundsToRect(getBounds(hitPath)),
    component: () => (
      <g>
        <path d={hitPath} fill="transparent" stroke="none" />
        <path
          className="node-select-highlight--stroke"
          d="M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0 M15,25 h-5"
          stroke="black"
          fill="none"
        />
      </g>
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