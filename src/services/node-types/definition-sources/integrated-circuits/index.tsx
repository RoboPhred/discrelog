import * as React from "react";
import { createSelector } from "reselect";

import { circuitNamesByIdSelector } from "@/services/circuits/selectors/circuits";
import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";

import {
  NodeDefinition,
  NodeDefinitionSource,
  NodePinDefinition,
} from "../../types";

const IntegratedCircuitDefinitionSource: NodeDefinitionSource = createSelector(
  circuitNamesByIdSelector,
  nodeIdsByCircuitIdSelector,
  nodeTypesByNodeIdSelector,
  (circuitNamesById, nodeIdsByCircuitId, nodeTypesByNodeId) => {
    return Object.keys(circuitNamesById)
      .filter((x) => x !== "root")
      .map((circuitId) => {
        const name = circuitNamesById[circuitId];

        const circuitNodeIds = nodeIdsByCircuitId[circuitId] ?? [];
        const pinNodeIds = circuitNodeIds.filter((circuitNodeId) =>
          nodeTypesByNodeId[circuitNodeId].startsWith("pin-")
        );

        const pins: Record<string, NodePinDefinition> = {};
        let inputY = 15;
        let outputY = 15;
        for (const pinNodeId of pinNodeIds) {
          const type = nodeTypesByNodeId[pinNodeId];
          if (type === "pin-input") {
            pins[pinNodeId] = {
              direction: "input",
              x: 5,
              y: inputY,
            };
            inputY += 10;
          } else if (type === "pin-output") {
            pins[pinNodeId] = {
              direction: "output",
              x: 45,
              y: outputY,
            };
            outputY += 10;
          }
        }

        const component = () => (
          <g>
            <path stroke="black" fill="none" d="M10,10 H40 V40 H10 V10 z" />
            <text y={25}>{name}</text>
          </g>
        );

        const def: NodeDefinition = {
          type: `ic-${circuitId}`,
          elementProduction: {
            type: "circuit",
            circuitId,
          },
          visual: {
            hitPath: "M10,10 H40 V40 H10 V10 z",
            component,
          },
          pins,
        };
        return def;
      });
  }
);

export default [IntegratedCircuitDefinitionSource];
