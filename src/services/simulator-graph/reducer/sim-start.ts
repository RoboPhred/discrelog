import filter from "lodash/filter";
import { v4 as uuidV4 } from "uuid";

import { NodeDefinitionsByType } from "@/nodes";

import { isStartSimAction } from "@/actions/sim-start";

import { connectionsByIdSelector } from "@/services/circuit-graph/selectors/connections";
import { nodesByNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";

import { createSimulatorGraphReducer } from "../utils";
import { SimulatorNode } from "../types";

export default createSimulatorGraphReducer((state, action, rootState) => {
  if (!isStartSimAction(action)) {
    return state;
  }

  // This all needs to be rewritten for multiple elements per node and ICs.

  const circuitNodesById = nodesByNodeIdSelector(rootState);
  const circuitConnectionsById = connectionsByIdSelector(rootState);

  const simulatorNodesById: Record<string, SimulatorNode> = {};
  const simulatorNodeIdByCircuitNodeId: Record<string, string> = {};
  const circuitNodeIdsBySimulatorNodeId: Record<string, string> = {};

  // Two passes are needed.  First, create the nodes.  Then, wire up the inputs.

  // Create the nodes.
  for (const circuitNodeId of Object.keys(circuitNodesById)) {
    const { nodeType } = circuitNodesById[circuitNodeId];
    const { elementType } = NodeDefinitionsByType[nodeType];

    const simulatorNodeId = uuidV4();
    simulatorNodesById[simulatorNodeId] = {
      elementType,
      inputsByPin: {},
      outputsByPin: {},
    };
    simulatorNodeIdByCircuitNodeId[circuitNodeId] = simulatorNodeId;
    circuitNodeIdsBySimulatorNodeId[simulatorNodeId] = circuitNodeId;
  }

  // Set the pins
  for (const simulatorNodeId of Object.keys(simulatorNodesById)) {
    const { inputsByPin, outputsByPin } = simulatorNodesById[simulatorNodeId];
    const circuitNodeId = circuitNodeIdsBySimulatorNodeId[simulatorNodeId];

    const inputConnections = filter(
      circuitConnectionsById,
      (conn) => conn.inputPin.nodeId === circuitNodeId
    );

    for (const { inputPin, outputPin } of inputConnections) {
      inputsByPin[inputPin.pinId] = {
        simulatorNodeId: simulatorNodeIdByCircuitNodeId[outputPin.nodeId],
        pinId: outputPin.pinId,
      };
    }

    const outputConnections = filter(
      circuitConnectionsById,
      (conn) => conn.outputPin.nodeId === circuitNodeId
    );

    for (const { inputPin, outputPin } of outputConnections) {
      outputsByPin[outputPin.pinId] = {
        simulatorNodeId: simulatorNodeIdByCircuitNodeId[inputPin.nodeId],
        pinId: inputPin.pinId,
      };
    }
  }

  return {
    ...state,
    simulatorNodesById,
    simulatorNodeIdsByCircuitNodeId: simulatorNodeIdByCircuitNodeId,
  };
});
