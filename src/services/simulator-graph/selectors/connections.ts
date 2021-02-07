import values from "lodash/values";
import flatMap from "lodash/flatMap";

import { createSimulatorGraphSelector } from "../utils";
import { SimulatorGraphState } from "../state";

/**
 * Gets an array of simulator node ids connected to the outputs of the given node id.
 * WARN: Not react safe.  For reducer use only.
 */
export const outputSimulatorNodeIdsFromSimulatorNodeIdSelector = createSimulatorGraphSelector(
  (state: SimulatorGraphState, simulatorNodeId: string) => {
    const simulatorNode = state.simulatorNodesById[simulatorNodeId];
    if (!simulatorNode) {
      return [];
    }

    return flatMap(values(simulatorNode.outputsByPin), (pins) =>
      pins.map((x) => x.simulatorNodeId)
    );
  }
);

/**
 * Gets a map of node input pins to their output sources given a node id.
 */
export const inputPinsByPinIdFromSimulatorNodeIdSelector = createSimulatorGraphSelector(
  (state: SimulatorGraphState, simulatorNodeId: string) => {
    const simulatorNode = state.simulatorNodesById[simulatorNodeId];
    if (!simulatorNode) {
      return {};
    }

    return simulatorNode.inputsByPin;
  }
);
