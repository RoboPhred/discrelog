import * as React from "react";
import getBounds from "svg-path-bounds";

import { boundsToRect } from "@/geometry";

import { NodeDefinition } from "../../types";
import { createStaticNodeVisual } from "../../components/static-node";

const hitPath = `M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0`;

const pinOutputElementDefinition: NodeDefinition = {
  type: "pin-output",
  category: "input-output",
  displayName: "Output Pin",
  visual: createStaticNodeVisual(
    boundsToRect(getBounds(hitPath)),
    <g>
      <path d={hitPath} fill="transparent" stroke="none" />
      <path
        className="node-select-highlight--stroke"
        d="M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0 M15,25 h-5"
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <circle
        className="node-select-highlight--fill"
        cx={25}
        cy={25}
        r={3}
        fill="black"
        stroke="none"
      />
    </g>
  ),
  pins: {
    IN: {
      direction: "input",
      x: 10,
      y: 25,
    },
  },
};
export default pinOutputElementDefinition;
