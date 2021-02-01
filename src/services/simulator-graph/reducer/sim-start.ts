import filter from "lodash/filter";
import { v4 as uuidV4 } from "uuid";

import { NodeDefinitionsByType } from "@/nodes";

import { isStartSimAction } from "@/actions/sim-start";

import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { Node, Connection } from "@/services/circuit-graph/types";
import { connectionsByIdSelector } from "@/services/circuit-graph/selectors/connections";
import { nodesByNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";

import { createSimulatorGraphReducer } from "../utils";
import { SimulatorNode } from "../types";
import { SimulatorGraphState } from "../state";

export default createSimulatorGraphReducer((state, action, rootState) => {
  if (!isStartSimAction(action)) {
    return state;
  }

  // This all needs to be rewritten for multiple elements per node and ICs.

  const circuitNodesById = nodesByNodeIdSelector(rootState);
  const rootCircuitNodeIds = nodeIdsByCircuitIdSelector(rootState, "root");
  const circuitConnectionsById = connectionsByIdSelector(rootState);

  const graph = produceCircuitNodes(
    rootCircuitNodeIds,
    circuitNodesById,
    circuitConnectionsById
  );

  return {
    ...state,
    ...graph,
  };
});

type SimulatorGraph = Pick<
  SimulatorGraphState,
  "simulatorNodesById" | "simulatorNodeIdsByCircuitNodeId"
>;

function produceCircuitNodes(
  circuitNodeIds: string[],
  circuitNodesById: Record<string, Node>,
  circuitConnectionsById: Record<string, Connection>
): SimulatorGraph {
  const simulatorNodesById: Record<string, SimulatorNode> = {};
  const simulatorNodeIdsByCircuitNodeId: Record<string, string> = {};
  const circuitNodeIdsBySimulatorNodeId: Record<string, string> = {};

  // Two passes are needed.  First, create the nodes.  Then, wire up the inputs.

  // Create the nodes.
  for (const circuitNodeId of circuitNodeIds) {
    const { nodeType } = circuitNodesById[circuitNodeId];
    const { elementProduction } = NodeDefinitionsByType[nodeType];

    // TODO: Turn production into one or more elements.
    //  Recurse into circuits if this is a circuit node.
    // Maybe track unwired outputs, and wire them up in the connect nodes step.
    // However, we will also have unwired inputs, since one node input can go to multiple element inputs
    // We need to track unwired outputs (one to many element output to circuit-node inputs), and
    //  unwired inputs (one to many circuit node input to element inputs)
    // We then need to take each unwired output and wire it to inputs based on unwired inputs

    if (typeof elementProduction === "string") {
      const simulatorNodeId = uuidV4();
      simulatorNodesById[simulatorNodeId] = {
        elementType: elementProduction,
        inputsByPin: {},
        outputsByPin: {},
      };
      simulatorNodeIdsByCircuitNodeId[circuitNodeId] = simulatorNodeId;
      circuitNodeIdsBySimulatorNodeId[simulatorNodeId] = circuitNodeId;
    } else {
      throw new Error("Unimplemented: Complex element productions");
    }
  }

  // Connect the nodes
  for (const simulatorNodeId of Object.keys(simulatorNodesById)) {
    const { inputsByPin, outputsByPin } = simulatorNodesById[simulatorNodeId];
    const circuitNodeId = circuitNodeIdsBySimulatorNodeId[simulatorNodeId];

    const inputConnections = filter(
      circuitConnectionsById,
      (conn) => conn.inputPin.nodeId === circuitNodeId
    );

    for (const { inputPin, outputPin } of inputConnections) {
      inputsByPin[inputPin.pinId] = {
        simulatorNodeId: simulatorNodeIdsByCircuitNodeId[outputPin.nodeId],
        pinId: outputPin.pinId,
      };
    }

    const outputConnections = filter(
      circuitConnectionsById,
      (conn) => conn.outputPin.nodeId === circuitNodeId
    );

    for (const { inputPin, outputPin } of outputConnections) {
      outputsByPin[outputPin.pinId] = {
        simulatorNodeId: simulatorNodeIdsByCircuitNodeId[inputPin.nodeId],
        pinId: inputPin.pinId,
      };
    }
  }

  return {
    simulatorNodesById,
    simulatorNodeIdsByCircuitNodeId,
  };
}
