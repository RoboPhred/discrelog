import { values } from "lodash";
import createCachedSelector from "re-reselect";

import { AppState } from "@/store";
import { ElementDefinitionsByType } from "@/elements";

import { NodePin } from "@/services/circuit-graph/types";

import { elementTypeFromSimulatorNodeId } from "./nodes";

/**
 * Gets an array of wires leaving the given node id.
 * WARN: Not react safe.  For reducer use only.
 */
export const outputConnectionsFromSimulatorNodeIdSelector = (
  state: AppState,
  simNodeId: string
) =>
  values(state.services.circuitGraph.connectionsById).filter(
    (x) => x.outputPin.nodeId === simNodeId
  );

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const inputElementsByPinIdFromSimulatorNodeIdSelector = createCachedSelector(
  (s: AppState) => values(s.services.circuitGraph.connectionsById),
  (_: any, nodeId: string) => nodeId,
  elementTypeFromSimulatorNodeId,
  (connections, nodeId, elementType) => {
    if (!elementType) {
      return {};
    }

    const def = ElementDefinitionsByType[elementType];
    if (!def) {
      return {};
    }

    const inputConnections = connections.filter(
      (x) => x.inputPin.nodeId === nodeId
    );

    const result: Record<string, NodePin | null> = {};
    for (const pin of def.inputPins) {
      result[pin] = null;
    }

    for (const connection of inputConnections) {
      const { outputPin, inputPin } = connection;
      result[inputPin.pinId] = outputPin;
    }

    return result;
  }
)((_: any, nodeId: string) => nodeId);
