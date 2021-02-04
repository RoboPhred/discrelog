import get from "lodash/get";
import { v4 as uuidV4 } from "uuid";

import { AppState } from "@/store";
import { PRIORITY_PRE, reducerPriority } from "@/store/priorities";

import { isStartSimAction } from "@/actions/sim-start";

import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { Node, Connection, NodePin } from "@/services/node-graph/types";
import { connectionsByIdSelector } from "@/services/node-graph/selectors/connections";
import { nodesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";

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
      circuitConnectionsById,
      rootState
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
  circuitConnectionsById: Record<string, Connection>,
  rootState: AppState
): SimulatorGraph {
  const simulatorNodesById: Record<string, SimulatorNode> = {};
  const simulatorNodeIdsByCircuitNodeId: Record<string, string> = {};

  const simulatorNodePinsByCircuitNodeInput: Record<
    string,
    Record<string, SimulatorNodePin[]>
  > = {};
  function addSimulatorNodePinInputMapping(
    circuitPin: NodePin,
    simulatorPin: SimulatorNodePin
  ) {
    let byPinId = simulatorNodePinsByCircuitNodeInput[circuitPin.nodeId];
    if (byPinId == null) {
      byPinId = simulatorNodePinsByCircuitNodeInput[circuitPin.nodeId] = {};
    }
    let inputs = byPinId[circuitPin.pinId];
    if (inputs == null) {
      inputs = byPinId[circuitPin.pinId] = [];
    }
    inputs.push(simulatorPin);
  }

  const simulatorNodePinByCircuitNodeOutput: Record<
    string,
    Record<string, SimulatorNodePin>
  > = {};
  function addSimulatorNodePinOutputMapping(
    circuitPin: NodePin,
    simulatorPin: SimulatorNodePin
  ) {
    let byPinId = simulatorNodePinByCircuitNodeOutput[circuitPin.nodeId];
    if (byPinId == null) {
      byPinId = simulatorNodePinByCircuitNodeOutput[circuitPin.nodeId] = {};
    }
    byPinId[circuitPin.pinId] = simulatorPin;
  }

  // Two passes are needed.  First, create the nodes.  Then, wire up the inputs.

  // Create the nodes.
  for (const circuitNodeId of circuitNodeIds) {
    const { nodeType } = circuitNodesById[circuitNodeId];

    const def = nodeDefinitionFromTypeSelector(rootState, nodeType);
    if (!def) {
      continue;
    }
    const { elementProduction, pins } = def;

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
        const circuitNodePin = { nodeId: circuitNodeId, pinId };
        const simulatorNodePin = {
          simulatorNodeId,
          pinId,
        };
        if (direction === "input") {
          // Basic elements have a one to one pin mapping
          addSimulatorNodePinInputMapping(circuitNodePin, simulatorNodePin);
        } else {
          addSimulatorNodePinOutputMapping(circuitNodePin, simulatorNodePin);
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

    const simulatorOutputPin = get(simulatorNodePinByCircuitNodeOutput, [
      outputPin.nodeId,
      outputPin.pinId,
    ]);
    if (!simulatorOutputPin) {
      continue;
    }

    const simulatorInputPins = get(simulatorNodePinsByCircuitNodeInput, [
      inputPin.nodeId,
      inputPin.pinId,
    ]);
    if (!simulatorInputPins) {
      continue;
    }

    const outputNode = simulatorNodesById[simulatorOutputPin.simulatorNodeId];
    let outputsByOutputPin: SimulatorNodePin[] =
      outputNode.outputsByPin[simulatorOutputPin.pinId];
    if (outputsByOutputPin == null) {
      outputNode.outputsByPin[
        simulatorOutputPin.pinId
      ] = outputsByOutputPin = [];
    }

    // Wire up the output to all of the inputs
    for (const simulatorInput of simulatorInputPins) {
      outputsByOutputPin.push({
        simulatorNodeId: simulatorInput.simulatorNodeId,
        pinId: simulatorInput.pinId,
      });

      const inputNode = simulatorNodesById[simulatorInput.simulatorNodeId];
      inputNode.inputsByPin[simulatorInput.pinId] = {
        simulatorNodeId: simulatorOutputPin.simulatorNodeId,
        pinId: simulatorOutputPin.pinId,
      };
    }
  }

  return {
    simulatorNodesById,
    simulatorNodeIdsByCircuitNodeId,
  };
}
