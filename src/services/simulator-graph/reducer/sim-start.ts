import { v4 as uuidV4 } from "uuid";
import merge from "lodash/merge";
import get from "lodash/get";

import { AppState } from "@/store";
import { PRIORITY_PRE, reducerPriority } from "@/store/priorities";

import { isStartSimAction } from "@/actions/sim-start";

import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { ROOT_CIRCUIT_ID } from "@/services/circuits/constants";
import { nodeTypeFromNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { connectionsByIdSelector } from "@/services/node-graph/selectors/connections";
import {
  CircuitNodeElementProduction,
  ElementNodeElementProduction,
  NodeElementProduction,
  NodeElementProductionObject,
} from "@/services/node-types/types/element-production";
import { nodeDefinitionFromTypeSelector } from "@/services/node-types/selectors/node-types";
import { nodeDefFromNodeIdSelector } from "@/services/node-graph/selectors/node-def";

import { createSimulatorGraphReducer } from "../utils";
import { SimulatorGraphServiceState } from "../state";
import { SimulatorNode, SimulatorNodePin } from "../types";

// This must run before simulator/reducer/sim-start, as we need to build up the graph before it can
// run the first tick.
// TODO: This makes more sense as a selector, since it transforms existing state.
export default reducerPriority(
  PRIORITY_PRE,
  createSimulatorGraphReducer((state, action, rootState) => {
    if (!isStartSimAction(action)) {
      return state;
    }

    const {
      simulatorNodesById,
      simulatorNodeIdsByCircuitNodeId,
    } = produceCircuit(ROOT_CIRCUIT_ID, rootState);

    return {
      ...state,
      simulatorNodesById,
      simulatorNodeIdsByCircuitNodeId,
    };
  })
);

type CircuitProductionResult = Pick<
  SimulatorGraphServiceState,
  "simulatorNodeIdsByCircuitNodeId" | "simulatorNodesById"
> & {
  inputElementPinsByCircuitPinId: Record<string, SimulatorNodePin[]>;
  outputElementPinsByCircuitPinId: Record<string, SimulatorNodePin>;
};

const EMPTY_PRODUCTION = Object.freeze<CircuitProductionResult>({
  simulatorNodesById: {},
  simulatorNodeIdsByCircuitNodeId: {},
  inputElementPinsByCircuitPinId: {},
  outputElementPinsByCircuitPinId: {},
});

function produceCircuit(
  circuitId: string,
  rootState: AppState,
  topLevel = true
): CircuitProductionResult {
  const simulatorNodesById: Record<string, SimulatorNode> = {};
  const simulatorNodeIdsByCircuitNodeId: Record<string, string> = {};
  const inputElementPinsByCircuitPinId: Record<string, SimulatorNodePin[]> = {};
  const outputElementPinsByCircuitPinId: Record<string, SimulatorNodePin> = {};

  const inputCircuitNodeIds: string[] = [];
  const outputCircuitNodeIds: string[] = [];

  // 1. Create new elements
  // 2. Wire elements amongs themselves.
  // 3. Pass input and output mapping to parent.

  const circuitNodeInputPinsByPinIdByNodeId: Record<
    string,
    Record<string, SimulatorNodePin[]>
  > = {};
  const circuitNodeOutputPinsByPinIdByNodeId: Record<
    string,
    Record<string, SimulatorNodePin>
  > = {};

  const circuitNodeIds = nodeIdsFromCircuitIdSelector(rootState, circuitId);
  for (const circuitNodeId of circuitNodeIds) {
    const nodeType = nodeTypeFromNodeIdSelector(rootState, circuitNodeId);
    if (!nodeType) {
      continue;
    }

    // If this node is a pin, remember it to calculate circuit inputs and outputs.
    if (nodeType === "pin-input") {
      inputCircuitNodeIds.push(circuitNodeId);
      inputElementPinsByCircuitPinId[circuitNodeId] = [];
      continue;
    } else if (nodeType === "pin-output") {
      outputCircuitNodeIds.push(circuitNodeId);
      continue;
    }

    const productionResult = produceNode(circuitNodeId, rootState);

    // Merge the produced simulator nodes.
    merge(simulatorNodesById, productionResult.simulatorNodesById);

    // Merge the mapping from circuit node to simulator node.
    // FIXME: We need to figure out how to map IC nodes.
    if (topLevel) {
      merge(
        simulatorNodeIdsByCircuitNodeId,
        productionResult.simulatorNodeIdsByCircuitNodeId
      );
    }

    // Remember what these circuit node pins translate to.
    circuitNodeInputPinsByPinIdByNodeId[circuitNodeId] =
      productionResult.inputElementPinsByCircuitPinId;
    circuitNodeOutputPinsByPinIdByNodeId[circuitNodeId] =
      productionResult.outputElementPinsByCircuitPinId;
  }

  const circuitConnectionsById = connectionsByIdSelector(rootState);
  for (const connectionId of Object.keys(circuitConnectionsById)) {
    const { inputPin, outputPin } = circuitConnectionsById[connectionId];
    // We are only interested in connections within this circuit.
    // There should not be any cross-circuit connections.
    // It might be ok to skip this step, and rely on not finding the node mapping.

    if (
      circuitNodeIds.indexOf(inputPin.nodeId) === -1 ||
      circuitNodeIds.indexOf(outputPin.nodeId) === -1
    ) {
      continue;
    }

    // We need to find the one output, and connect it to all inputs that match.
    // There might be more than one input if the input was on an IC / circuit production.
    const outputSimPin = get(circuitNodeOutputPinsByPinIdByNodeId, [
      outputPin.nodeId,
      outputPin.pinId,
    ]);
    const inputSimPins = get(circuitNodeInputPinsByPinIdByNodeId, [
      inputPin.nodeId,
      inputPin.pinId,
    ]);

    // If the output is one of our input nodes, then the inputs
    //  need to be saved for our circuit inputs
    if (inputCircuitNodeIds.indexOf(outputPin.nodeId) !== -1 && inputSimPins) {
      // pin id is the pin-input nodeId
      inputElementPinsByCircuitPinId[outputPin.nodeId].push(...inputSimPins);
      continue;
    } else if (
      outputCircuitNodeIds.indexOf(inputPin.nodeId) !== -1 &&
      outputSimPin
    ) {
      outputElementPinsByCircuitPinId[inputPin.nodeId] = outputSimPin;
      continue;
    }

    if (!outputSimPin || !inputSimPins) {
      continue;
    }

    const outputSimNode = simulatorNodesById[outputSimPin.simulatorNodeId];
    let outputsByOutputPin = outputSimNode.outputsByPin[outputSimPin.pinId];
    if (outputsByOutputPin == null) {
      outputSimNode.outputsByPin[outputSimPin.pinId] = outputsByOutputPin = [];
    }

    // Wire up the output to all of the inputs
    for (const inputSimPin of inputSimPins) {
      outputsByOutputPin.push({
        simulatorNodeId: inputSimPin.simulatorNodeId,
        pinId: inputSimPin.pinId,
      });

      const inputNode = simulatorNodesById[inputSimPin.simulatorNodeId];
      inputNode.inputsByPin[inputSimPin.pinId] = {
        simulatorNodeId: outputSimPin.simulatorNodeId,
        pinId: outputSimPin.pinId,
      };
    }
  }

  return {
    simulatorNodesById,
    simulatorNodeIdsByCircuitNodeId,
    inputElementPinsByCircuitPinId,
    outputElementPinsByCircuitPinId,
  };
}

function produceNode(
  circuitNodeId: string,
  rootState: AppState
): CircuitProductionResult {
  const nodeType = nodeTypeFromNodeIdSelector(rootState, circuitNodeId);
  if (!nodeType) {
    return EMPTY_PRODUCTION;
  }

  const nodeDef = nodeDefinitionFromTypeSelector(rootState, nodeType);
  if (!nodeDef || !nodeDef.elementProduction) {
    return EMPTY_PRODUCTION;
  }

  const production = normalizeElementProduction(nodeDef.elementProduction);
  switch (production.type) {
    case "element":
      return produceElementNode(circuitNodeId, production, rootState);
    case "circuit":
      return produceCircuitNode(circuitNodeId, production, rootState);
    default:
      throw new Error(
        "Unsupported production type " + (production as any).type
      );
  }
}

function produceElementNode(
  circuitNodeId: string,
  production: ElementNodeElementProduction,
  rootState: AppState
): CircuitProductionResult {
  const nodeDef = nodeDefFromNodeIdSelector(rootState, circuitNodeId);
  if (!nodeDef) {
    return EMPTY_PRODUCTION;
  }

  const simulatorNodesById: Record<string, SimulatorNode> = {};
  const simulatorNodeIdsByCircuitNodeId: Record<string, string> = {};

  const simulatorNodeId = uuidV4();
  simulatorNodesById[simulatorNodeId] = {
    elementType: production.elementType,
    // We do not have any internal pins.
    // These will be wired by produceCircuit as
    // it completes is cross-circuit connections.
    inputsByPin: {},
    outputsByPin: {},
  };

  simulatorNodeIdsByCircuitNodeId[circuitNodeId] = simulatorNodeId;

  const inputElementPinsByCircuitPinId: Record<string, SimulatorNodePin[]> = {};
  const outputElementPinsByCircuitPinId: Record<string, SimulatorNodePin> = {};

  // We have a one to one pin mapping between node and element
  for (const pinId of Object.keys(nodeDef.pins)) {
    const { direction } = nodeDef.pins[pinId];
    if (direction === "input") {
      inputElementPinsByCircuitPinId[pinId] = [
        {
          pinId,
          simulatorNodeId,
        },
      ];
    } else if (direction === "output") {
      outputElementPinsByCircuitPinId[pinId] = {
        pinId,
        simulatorNodeId,
      };
    }
  }

  return {
    simulatorNodesById,
    simulatorNodeIdsByCircuitNodeId,
    inputElementPinsByCircuitPinId,
    outputElementPinsByCircuitPinId,
  };
}

function produceCircuitNode(
  circuitNodeId: string,
  production: CircuitNodeElementProduction,
  rootState: AppState
): CircuitProductionResult {
  const circuitProuction = produceCircuit(
    production.circuitId,
    rootState,
    false
  );

  return circuitProuction;
}

function normalizeElementProduction(
  elementProduction: NodeElementProduction
): NodeElementProductionObject {
  if (typeof elementProduction === "string") {
    return {
      type: "element",
      elementType: elementProduction,
    };
  }

  return elementProduction;
}
