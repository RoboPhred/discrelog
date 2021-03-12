import * as React from "react";

import { createSelector } from "reselect";
import sortBy from "lodash/sortBy";
import getBounds from "svg-path-bounds";

import { PinDirection } from "@/logic";
import { boundsToRect, Point } from "@/geometry";

import { IntegratedCircuitVisualProps } from "@/nodes/visuals/IntegratedCircuitNode";

import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodePositionsByNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import { circuitNamesByIdSelector } from "@/services/circuits/selectors/circuits";

import {
  NodeDefinition,
  NodeDefinitionSource,
  NodePinDefinition,
} from "../../types";

import { circuitIdToNodeType, getICBorderPath } from "./utils";

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
        const inputPinIds: string[] = [];
        const outputPinIds: string[] = [];
        for (const pinNodeId of pinNodeIds) {
          const type = nodeTypesByNodeId[pinNodeId];
          if (type === "pin-input") {
            pins[pinNodeId] = {
              direction: "input",
              ...circuitPinPosition(inputPinIds.length, "input"),
            };
            inputPinIds.push(pinNodeId);
          } else if (type === "pin-output") {
            pins[pinNodeId] = {
              direction: "output",
              ...circuitPinPosition(outputPinIds.length, "output"),
            };
            outputPinIds.push(pinNodeId);
          }
        }

        const componentProps: IntegratedCircuitVisualProps = {
          circuitId,
          inputPinIds,
          outputPinIds,
        };

        const def: NodeDefinition = {
          type: circuitIdToNodeType(circuitId),
          category: "integrated-circuit",
          displayName: circuitName,
          elementProduction: {
            type: "circuit",
            circuitId,
          },
          visual: {
            hitRect: boundsToRect(
              getBounds(
                getICBorderPath(inputPinIds.length, outputPinIds.length)
              )
            ),
            trayComponent: () => (
              <g stroke="black" strokeWidth={1}>
                <rect x={10} y={10} width={30} height={30} fill="none" />

                <line x1={10} y1={15} x2={5} y2={15} />
                <line x1={40} y1={15} x2={45} y2={15} />

                <line x1={10} y1={35} x2={5} y2={35} />
                <line x1={40} y1={35} x2={45} y2={35} />
              </g>
            ),
            component: "integrated-circuit",
            componentProps,
          },
          pins,
        };
        return def;
      });
  }
);

export default [IntegratedCircuitDefinitionSource];

function circuitPinPosition(pinIndex: number, direction: PinDirection): Point {
  return {
    x: direction === "input" ? 0 : 100,
    y: pinIndex * 50 + 25,
  };
}
