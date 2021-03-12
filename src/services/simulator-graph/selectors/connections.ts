import values from "lodash/values";
import flatMap from "lodash/flatMap";

import { AppState } from "@/store";

import { rootNodeGraphSelector } from "./graph";
import { SimulatorNodePin } from "../types";

const EmptyPinArray = Object.freeze([] as string[]);
const EmptyPinInputs = Object.freeze({} as Record<string, SimulatorNodePin>);

/**
 * Gets an array of simulator node ids connected to the outputs of the given node id.
 * WARN: Not react safe.  For reducer use only.
 */
export const outputSimulatorNodeIdsFromSimulatorNodeIdSelector = (
  state: AppState,
  simulatorNodeId: string
) => {
  const { simulatorNodesById } = rootNodeGraphSelector(state);

  const simulatorNode = simulatorNodesById[simulatorNodeId];
  if (!simulatorNode) {
    return EmptyPinArray;
  }

  return flatMap(values(simulatorNode.outputsByPin), (pins) =>
    pins.map((x) => x.simulatorNodeId)
  );
};

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const inputPinsByPinIdFromSimulatorNodeIdSelector = (
  state: AppState,
  simulatorNodeId: string
) => {
  const { simulatorNodesById } = rootNodeGraphSelector(state);
  const simulatorNode = simulatorNodesById[simulatorNodeId];
  if (!simulatorNode) {
    return EmptyPinInputs;
  }

  return simulatorNode.inputsByPin;
};
