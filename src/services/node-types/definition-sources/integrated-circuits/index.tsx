import { createSelector } from "reselect";
import sortBy from "lodash/sortBy";

import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodePositionsByNodeIdSelector } from "@/services/node-layout/selectors/node-positions";

import {
  NodeDefinition,
  NodeDefinitionSource,
  NodePinDefinition,
} from "../../types";

import {
  circuitPinPosition,
  circuitToNodeVisual,
} from "./IntegratedCircuitVisual";

import { circuitIdToNodeType } from "./utils";
import { circuitNamesByIdSelector } from "@/services/circuits/selectors/circuits";

const IntegratedCircuitDefinitionSource: NodeDefinitionSource = createSelector(
  nodeIdsByCircuitIdSelector,
  nodeTypesByNodeIdSelector,
  nodePositionsByNodeIdSelector,
  circuitNamesByIdSelector,
  (
    nodeIdsByCircuitId,
    nodeTypesByNodeId,
    nodePositionsByNodeId,
    circuitNamesById
  ) => {
    return Object.keys(nodeIdsByCircuitId)
      .filter((x) => x !== ROOT_CIRCUIT_ID)
      .map((circuitId) => {
        const circuitNodeIds = nodeIdsByCircuitId[circuitId] ?? [];
        const circuitName =
          circuitNamesById[circuitId] ?? circuitId.substr(0, 5);

        // Sort by y axis position to get consistent pin locations.
        let pinNodeIds = circuitNodeIds.filter((circuitNodeId) =>
          nodeTypesByNodeId[circuitNodeId].startsWith("pin-")
        );
        pinNodeIds = sortBy(
          pinNodeIds,
          (nodeId) => nodePositionsByNodeId[nodeId].y,
          (nodeId) => nodePositionsByNodeId[nodeId].x
        );

        const pins: Record<string, NodePinDefinition> = {};
        let inputPinCount = 0;
        let outputPinCount = 0;
        for (const pinNodeId of pinNodeIds) {
          const type = nodeTypesByNodeId[pinNodeId];
          if (type === "pin-input") {
            pins[pinNodeId] = {
              direction: "input",
              ...circuitPinPosition(inputPinCount, "input"),
            };
            inputPinCount++;
          } else if (type === "pin-output") {
            pins[pinNodeId] = {
              direction: "output",
              ...circuitPinPosition(outputPinCount, "output"),
            };
            outputPinCount++;
          }
        }

        const def: NodeDefinition = {
          type: circuitIdToNodeType(circuitId),
          displayName: circuitName,
          elementProduction: {
            type: "circuit",
            circuitId,
          },
          visual: circuitToNodeVisual(circuitId, inputPinCount, outputPinCount),
          pins,
        };
        return def;
      });
  }
);

export default [IntegratedCircuitDefinitionSource];
