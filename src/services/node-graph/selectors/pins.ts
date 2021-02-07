import { PinDirection } from "@/logic";
import { circuitIdFromNodeIdSelector } from "@/services/circuits/selectors/nodes";
import { circuitIdToNodeType } from "@/services/node-types/definition-sources/integrated-circuits/utils";
import { AppState } from "@/store";

import { NodePin } from "../types";

import { connectionsSelector } from "./connections";
import { nodeDefFromNodeIdSelector } from "./node-def";
import { nodeIdsFromTypeSelector, nodeTypeFromNodeIdSelector } from "./nodes";

export const pinDirectionFromNodePinSelector = (
  state: AppState,
  nodeId: string,
  pinId: string
) => {
  const def = nodeDefFromNodeIdSelector(state, nodeId);
  if (!def) {
    return null;
  }

  const pinDef = def.pins[pinId];
  if (!pinDef) {
    return null;
  }
  return pinDef.direction;
};

/**
 * Gets a map of node input pins to their output sources given a node id.
 *
 * WARN: Not react safe.  For reducer use only
 */
export const nodeOutputSourcesByPinIdFromNodeIdSelector = (
  state: AppState,
  nodeId: string
) => {
  const connections = connectionsSelector(state);
  const nodeDef = nodeDefFromNodeIdSelector(state, nodeId);

  if (!nodeDef) {
    return {};
  }

  let outputPins: string[] = [];
  outputPins = Object.keys(nodeDef.pins).filter(
    (x) => nodeDef.pins[x].direction === "output"
  );

  const outputConnections = connections.filter(
    (x) => x.outputPin.nodeId === nodeId
  );

  const result: Record<string, NodePin[]> = {};
  for (const pin of outputPins) {
    result[pin] = [];
  }

  for (const connection of outputConnections) {
    const { outputPin, inputPin } = connection;
    result[outputPin.pinId].push(inputPin);
  }

  return result;
};

export const nodePinsFromPinNodeSelector = (
  state: AppState,
  nodeId: string
): NodePin[] => {
  const nodeType = nodeTypeFromNodeIdSelector(state, nodeId);
  let direction: PinDirection;
  if (nodeType === "pin-input") {
    direction = "input";
  } else if (nodeType === "pin-output") {
    direction = "output";
  } else {
    return [];
  }

  const circuitId = circuitIdFromNodeIdSelector(state, nodeId);
  if (!circuitId) {
    return [];
  }

  const icNodeType = circuitIdToNodeType(circuitId);
  const icNodeIds = nodeIdsFromTypeSelector(state, icNodeType);

  return icNodeIds.map((icNodeId) => ({ nodeId: icNodeId, pinId: nodeId }));
};
