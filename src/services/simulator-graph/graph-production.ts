import get from "lodash/get";
import merge from "lodash/merge";
import { v4 as uuidV4 } from "uuid";

import {
  CircuitNodeElementProduction,
  ElementNodeElementProduction,
  normalizeElementProduction,
} from "../../nodes/types/element-production";

import {
  SimulatorGraph,
  SimulatorGraphDependencies,
  SimulatorNode,
  SimulatorNodeIdMappingTreeItem,
  SimulatorNodePin,
} from "./types";

type CircuitProductionResult = SimulatorGraph & {
  inputElementPinsByCircuitPinId: Record<string, SimulatorNodePin[]>;
  outputElementPinsByCircuitPinId: Record<string, SimulatorNodePin>;
};

const EMPTY_PRODUCTION = Object.freeze<CircuitProductionResult>({
  simulatorNodesById: {},
  simulatorNodeIdsByCircuitNodeId: {},
  inputElementPinsByCircuitPinId: {},
  outputElementPinsByCircuitPinId: {},
});

export function produceCircuitGraph(
  circuitId: string,
  dependencies: SimulatorGraphDependencies,
  path: string[] = []
): CircuitProductionResult {
  if (path.indexOf(circuitId) !== -1) {
    throw new Error(
      `Circuit graph encountered loop on ${path.join(
        " => "
      )} while trying to add circuit ${circuitId}`
    );
  }

  path = [...path, circuitId];

  const simulatorNodesById: Record<string, SimulatorNode> = {};
  const simulatorNodeIdsByCircuitNodeId: Record<
    string,
    SimulatorNodeIdMappingTreeItem
  > = {};
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

  const circuitNodeIds = dependencies.nodeIdsByCircuitId[circuitId] ?? [];
  for (const circuitNodeId of circuitNodeIds) {
    const nodeType = dependencies.nodeTypesByNodeId[circuitNodeId];
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

    const productionResult = produceNode(circuitNodeId, dependencies, path);

    // Merge the produced simulator nodes.
    merge(simulatorNodesById, productionResult.simulatorNodesById);

    // Merge the mapping from circuit node to simulator node.
    merge(
      simulatorNodeIdsByCircuitNodeId,
      productionResult.simulatorNodeIdsByCircuitNodeId
    );

    // Remember what these circuit node pins translate to.
    circuitNodeInputPinsByPinIdByNodeId[circuitNodeId] =
      productionResult.inputElementPinsByCircuitPinId;
    circuitNodeOutputPinsByPinIdByNodeId[circuitNodeId] =
      productionResult.outputElementPinsByCircuitPinId;
  }

  const circuitConnectionsById = dependencies.connectionsById;
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
  dependencies: SimulatorGraphDependencies,
  path: string[]
): CircuitProductionResult {
  const nodeType = dependencies.nodeTypesByNodeId[circuitNodeId];
  if (!nodeType) {
    return EMPTY_PRODUCTION;
  }

  const nodeDef = dependencies.nodeDefsByType[nodeType];
  if (!nodeDef || !nodeDef.elementProduction) {
    return EMPTY_PRODUCTION;
  }

  const production = normalizeElementProduction(nodeDef.elementProduction);
  switch (production.type) {
    case "element":
      return produceElementNode(circuitNodeId, production, dependencies);
    case "circuit":
      return produceCircuitNode(circuitNodeId, production, dependencies, path);
    default:
      throw new Error(
        "Unsupported production type " + (production as any).type
      );
  }
}

function produceElementNode(
  circuitNodeId: string,
  production: ElementNodeElementProduction,
  { nodeTypesByNodeId, nodeDefsByType }: SimulatorGraphDependencies
): CircuitProductionResult {
  const nodeType = nodeTypesByNodeId[circuitNodeId];
  const nodeDef = nodeDefsByType[nodeType];
  if (!nodeDef) {
    return EMPTY_PRODUCTION;
  }

  const simulatorNodesById: Record<string, SimulatorNode> = {};
  const simulatorNodeIdsByCircuitNodeId: Record<
    string,
    SimulatorNodeIdMappingTreeItem
  > = {};

  const simulatorNodeId = uuidV4();
  simulatorNodesById[simulatorNodeId] = {
    elementType: production.elementType,
    // We do not have any internal pins.
    // These will be wired by produceCircuit as
    // it completes is cross-circuit connections.
    inputsByPin: {},
    outputsByPin: {},
  };

  simulatorNodeIdsByCircuitNodeId[circuitNodeId] = {
    simulatorNodeId,
    subCircuitIds: {},
  };

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
  dependencies: SimulatorGraphDependencies,
  path: string[]
): CircuitProductionResult {
  const circuitProuction = produceCircuitGraph(
    production.circuitId,
    dependencies,
    path
  );

  return {
    ...circuitProuction,
    simulatorNodeIdsByCircuitNodeId: {
      [circuitNodeId]: {
        simulatorNodeId: null,
        subCircuitIds: circuitProuction.simulatorNodeIdsByCircuitNodeId,
      },
    },
  };
}
