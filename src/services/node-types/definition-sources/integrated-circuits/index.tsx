import { AppState } from "@/store";
import { createShapePathNode } from "../../components/ShapePathNode";
import { NodeDefinition, NodeDefinitionSource } from "../../types";

import * as React from "react";

const IntegratedCircuitDefinitionSource: NodeDefinitionSource = (
  state: AppState
) => {
  const circuitNamesById = state.services.circuits.circuitNamesByCircuitId;
  return Object.keys(circuitNamesById)
    .filter((x) => x !== "root")
    .map((circuitId) => {
      const name = circuitNamesById[circuitId];
      const nodeId = nameToId(name);
      const def: NodeDefinition = {
        type: `ic-${nodeId}`,
        visual: {
          hitPath: "M10,10 H40 V40 H10 V10 z",
          component: () => (
            <g>
              <path stroke="black" fill="none" d="M10,10 H40 V40 H10 V10 z" />
              <text y={25}>{name}</text>
            </g>
          ),
        },
        pins: {},
      };
      return def;
    });
};

export default [IntegratedCircuitDefinitionSource];

function nameToId(name: string) {
  return name.replace(/[\w]/g, "-").toLowerCase();
}
