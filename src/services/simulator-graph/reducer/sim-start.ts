import filter from "lodash/filter";
import { v4 as uuidV4 } from "uuid";

import { NodeDefinitionsByType } from "@/nodes";
import { PRIORITY_PRE, reducerPriority } from "@/store/priorities";

import { isStartSimAction } from "@/actions/sim-start";

import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { Node, Connection } from "@/services/circuit-graph/types";
import { connectionsByIdSelector } from "@/services/circuit-graph/selectors/connections";
import { nodesByNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";

import { createSimulatorGraphReducer } from "../utils";
import { SimulatorNode, SimulatorNodePin } from "../types";
import { SimulatorGraphState } from "../state";

// This must run before simulator/reducer/sim-start, as we need to build up the graph before it can
// run the first tick.
// TODO: This makes more sense as a selector, since it transforms existing state.
export default reducerPriority(
  PRIORITY_PRE,
  createSimulatorGraphReducer((state, action, rootState) => {
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
  })
);

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

  // TODO: These two arrays are a very inefficient means of looking up the data.
  //  Replace them with maps-of-maps (byPinIdByNodeId)
  const ciruitNodeInputPinMappings: {
    circuitNodeId: string;
    circuitNodePinId: string;
    inputs: {
      simulatorNodeId: string;
      simulatorNodePinId: string;
    }[];
  }[] = [];
  const simulatorNodeOutputPinMappings: {
    simulatorNodeId: string;
    simulatorNodePinId: string;
    outputCircuitNodeId: string;
    outputCircuitNodePinId: string;
  }[] = [];

  // Two passes are needed.  First, create the nodes.  Then, wire up the inputs.

  // Create the nodes.
  for (const circuitNodeId of circuitNodeIds) {
    const { nodeType } = circuitNodesById[circuitNodeId];
    const { elementProduction, pins } = NodeDefinitionsByType[nodeType];

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

      for (const pinId of Object.keys(pins)) {
        const { direction } = pins[pinId];
        if (direction === "input") {
          // Basic elements have a one to one pin mapping
          ciruitNodeInputPinMappings.push({
            circuitNodeId,
            circuitNodePinId: pinId,
            inputs: [
              {
                simulatorNodeId,
                simulatorNodePinId: pinId,
              },
            ],
          });
        } else {
          simulatorNodeOutputPinMappings.push({
            simulatorNodeId,
            simulatorNodePinId: pinId,
            outputCircuitNodeId: circuitNodeId,
            outputCircuitNodePinId: pinId,
          });
        }
      }
    } else {
      throw new Error("Unimplemented: Complex element productions");
    }
  }

  // Connect the nodes
  // Scan through each connection in the circuit, and apply it based on our
  // translated node pins.  Keep in mind that input pins can go from one to many.
  for (const connectionId of Object.keys(circuitConnectionsById)) {
    const { inputPin, outputPin } = circuitConnectionsById[connectionId];

    const simulatorOutputPin = simulatorNodeOutputPinMappings.find(
      (x) =>
        x.outputCircuitNodeId === outputPin.nodeId &&
        x.outputCircuitNodePinId === outputPin.pinId
    );
    if (!simulatorOutputPin) {
      continue;
    }

    const simulatorInputPinMapping = ciruitNodeInputPinMappings.find(
      (x) =>
        x.circuitNodeId === inputPin.nodeId &&
        x.circuitNodePinId === inputPin.pinId
    );
    if (!simulatorInputPinMapping) {
      continue;
    }

    const outputNode = simulatorNodesById[simulatorOutputPin.simulatorNodeId];
    let outputsByOutputPin: SimulatorNodePin[] =
      outputNode.outputsByPin[simulatorOutputPin.outputCircuitNodePinId];
    if (outputsByOutputPin == null) {
      outputNode.outputsByPin[
        simulatorOutputPin.outputCircuitNodePinId
      ] = outputsByOutputPin = [];
    }

    // Wire up the output to all of the inputs
    for (const simulatorInput of simulatorInputPinMapping.inputs) {
      outputsByOutputPin.push({
        simulatorNodeId: simulatorInput.simulatorNodeId,
        pinId: simulatorInput.simulatorNodePinId,
      });

      const inputNode = simulatorNodesById[simulatorInput.simulatorNodeId];
      inputNode.inputsByPin[simulatorInput.simulatorNodePinId] = {
        simulatorNodeId: simulatorOutputPin.simulatorNodeId,
        pinId: simulatorOutputPin.simulatorNodePinId,
      };
    }
  }

  return {
    simulatorNodesById,
    simulatorNodeIdsByCircuitNodeId,
  };
}
