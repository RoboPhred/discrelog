import get from "lodash/get";
import merge from "lodash/merge";
import { v4 as uuidV4 } from "uuid";

import {
  CircuitSimProduction,
  ElementSimProduction,
  normalizeSimProduction,
} from "../../elements/types/element-production";

import {
  SimulatorGraph,
  SimulatorGraphDependencies,
  SimulatorEvolver,
  EvolverIdMappingTreeItem,
  EvolverPin,
} from "./types";

type CircuitProductionResult = SimulatorGraph & {
  inputElementPinsByCircuitPinId: Record<string, EvolverPin[]>;
  outputElementPinsByCircuitPinId: Record<string, EvolverPin>;
};

const EMPTY_PRODUCTION = Object.freeze<CircuitProductionResult>({
  evolversById: {},
  evolverIdsByElementId: {},
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

  const evolversById: Record<string, SimulatorEvolver> = {};
  const evolverIdsByElementId: Record<string, EvolverIdMappingTreeItem> = {};
  const inputElementPinsByCircuitPinId: Record<string, EvolverPin[]> = {};
  const outputElementPinsByCircuitPinId: Record<string, EvolverPin> = {};

  const inputElementIds: string[] = [];
  const outputElementIds: string[] = [];

  // 1. Create new elements
  // 2. Connect elements amongst themselves.
  // 3. Pass input and output mapping to parent.

  const elementInputPinsByPinIdByElementId: Record<
    string,
    Record<string, EvolverPin[]>
  > = {};
  const elementOutputPinsByPinIdByElementId: Record<
    string,
    Record<string, EvolverPin>
  > = {};

  const elementIds = dependencies.elementIdsByCircuitId[circuitId] ?? [];
  for (const elementId of elementIds) {
    const elementType = dependencies.elementTypesByElementId[elementId];
    if (!elementType) {
      continue;
    }

    // If this element is a pin, remember it to calculate circuit inputs and outputs.
    if (elementType === "pin-input") {
      inputElementIds.push(elementId);
      inputElementPinsByCircuitPinId[elementId] = [];
      continue;
    } else if (elementType === "pin-output") {
      outputElementIds.push(elementId);
      continue;
    }

    const productionResult = produceEvolver(elementId, dependencies, path);

    // Merge the produced simulator elements.
    merge(evolversById, productionResult.evolversById);

    // Merge the mapping from circuit element to evolver.
    merge(evolverIdsByElementId, productionResult.evolverIdsByElementId);

    // Remember what these element pins translate to.
    elementInputPinsByPinIdByElementId[elementId] =
      productionResult.inputElementPinsByCircuitPinId;
    elementOutputPinsByPinIdByElementId[elementId] =
      productionResult.outputElementPinsByCircuitPinId;
  }

  const circuitConnectionsById = dependencies.connectionsById;
  for (const connectionId of Object.keys(circuitConnectionsById)) {
    const { inputPin, outputPin } = circuitConnectionsById[connectionId];
    // We are only interested in connections within this circuit.
    // There should not be any cross-circuit connections.
    // It might be ok to skip this step, and rely on not finding the element mapping.

    if (
      elementIds.indexOf(inputPin.elementId) === -1 ||
      elementIds.indexOf(outputPin.elementId) === -1
    ) {
      continue;
    }

    // We need to find the one output, and connect it to all inputs that match.
    // There might be more than one input if the input was on an IC / circuit production.
    const outputSimPin = get(elementOutputPinsByPinIdByElementId, [
      outputPin.elementId,
      outputPin.pinId,
    ]);
    const inputSimPins = get(elementInputPinsByPinIdByElementId, [
      inputPin.elementId,
      inputPin.pinId,
    ]);

    // If the output is one of our input elements, then the inputs
    //  need to be saved for our circuit inputs
    if (inputElementIds.indexOf(outputPin.elementId) !== -1 && inputSimPins) {
      // pin id is the pin-input elementId
      inputElementPinsByCircuitPinId[outputPin.elementId].push(...inputSimPins);
      continue;
    } else if (
      outputElementIds.indexOf(inputPin.elementId) !== -1 &&
      outputSimPin
    ) {
      outputElementPinsByCircuitPinId[inputPin.elementId] = outputSimPin;
      continue;
    }

    if (!outputSimPin || !inputSimPins) {
      continue;
    }

    const outputEvolver = evolversById[outputSimPin.evolverId];
    let outputsByOutputPin = outputEvolver.outputsByPin[outputSimPin.pinId];
    if (outputsByOutputPin == null) {
      outputEvolver.outputsByPin[outputSimPin.pinId] = outputsByOutputPin = [];
    }

    // Connect up the output to all of the inputs
    for (const inputSimPin of inputSimPins) {
      outputsByOutputPin.push({
        evolverId: inputSimPin.evolverId,
        pinId: inputSimPin.pinId,
      });

      const inputNode = evolversById[inputSimPin.evolverId];
      inputNode.inputsByPin[inputSimPin.pinId] = {
        evolverId: outputSimPin.evolverId,
        pinId: outputSimPin.pinId,
      };
    }
  }

  return {
    evolversById,
    evolverIdsByElementId: evolverIdsByElementId,
    inputElementPinsByCircuitPinId,
    outputElementPinsByCircuitPinId,
  };
}

function produceEvolver(
  elementId: string,
  dependencies: SimulatorGraphDependencies,
  path: string[]
): CircuitProductionResult {
  const elementType = dependencies.elementTypesByElementId[elementId];
  if (!elementType) {
    return EMPTY_PRODUCTION;
  }

  const def = dependencies.elementDefsByElementType[elementType];
  if (!def || !def.elementProduction) {
    return EMPTY_PRODUCTION;
  }

  const production = normalizeSimProduction(def.elementProduction);
  switch (production.type) {
    case "element":
      return produceElementNode(elementId, production, dependencies);
    case "circuit":
      return produceCircuitNode(elementId, production, dependencies, path);
    default:
      throw new Error(
        "Unsupported production type " + (production as any).type
      );
  }
}

function produceElementNode(
  elementId: string,
  production: ElementSimProduction,
  {
    elementTypesByElementId,
    elementDefsByElementType,
  }: SimulatorGraphDependencies
): CircuitProductionResult {
  const elementType = elementTypesByElementId[elementId];
  const def = elementDefsByElementType[elementType];
  if (!def) {
    return EMPTY_PRODUCTION;
  }

  const evolversById: Record<string, SimulatorEvolver> = {};
  const evolverIdsByElementId: Record<string, EvolverIdMappingTreeItem> = {};

  const evolverId = uuidV4();
  evolversById[evolverId] = {
    evolverType: production.evolverType,
    // We do not have any internal pins.
    // These will be connected by produceCircuit as
    // it completes is cross-circuit connections.
    inputsByPin: {},
    outputsByPin: {},
  };

  evolverIdsByElementId[elementId] = {
    evolverId,
    subElementIds: {},
  };

  const inputElementPinsByCircuitPinId: Record<string, EvolverPin[]> = {};
  const outputElementPinsByCircuitPinId: Record<string, EvolverPin> = {};

  // We have a one to one pin mapping between element and evolver
  for (const pinId of Object.keys(def.pins)) {
    const { direction } = def.pins[pinId];
    if (direction === "input") {
      inputElementPinsByCircuitPinId[pinId] = [
        {
          pinId,
          evolverId: evolverId,
        },
      ];
    } else if (direction === "output") {
      outputElementPinsByCircuitPinId[pinId] = {
        pinId,
        evolverId: evolverId,
      };
    }
  }

  return {
    evolversById,
    evolverIdsByElementId: evolverIdsByElementId,
    inputElementPinsByCircuitPinId,
    outputElementPinsByCircuitPinId,
  };
}

function produceCircuitNode(
  elementId: string,
  production: CircuitSimProduction,
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
    evolverIdsByElementId: {
      [elementId]: {
        evolverId: null,
        subElementIds: circuitProuction.evolverIdsByElementId,
      },
    },
  };
}
