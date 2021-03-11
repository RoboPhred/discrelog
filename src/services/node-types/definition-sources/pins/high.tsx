import * as React from "react";
import getBounds from "svg-path-bounds";

import { boundsToRect } from "@/geometry";

import { NodeDefinition } from "../../types";
import { createStaticNodeVisual } from "../../components/static-node";

const hitPath = `M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0`;

const pinHighElementDefinition: NodeDefinition = {
  type: "pin-high",
  category: "i/o",
  elementProduction: "pin-high",
  displayName: "High Pin",
  visual: createStaticNodeVisual(
    boundsToRect(getBounds(hitPath)),
    <g>
      <path d={hitPath} fill="transparent" stroke="none" />
      <path
        className="node-select-highlight--stroke"
        d="M15,25 a 10,10 0 1,0 20 0 a 10,10 0 1,0 -20,0 M35,25 h5"
        stroke="black"
        strokeWidth={2}
        fill="none"
      />
      <path
        className="node-select-highlight--stroke"
        d="M25,20 v10 M20,25 h10"
        fill="none"
        stroke="black"
        strokeWidth={2}
      />
    </g>
  ),
  pins: {
    OUT: {
      direction: "output",
      x: 40,
      y: 25,
    },
  },
};
export default pinHighElementDefinition;
