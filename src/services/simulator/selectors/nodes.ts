import { createSimulatorSelector } from "../utils";
import { SimulatorState } from "../state";

export const nodeStatesByIdSelector = createSimulatorSelector(
  (s) => s.nodeStatesByNodeId
);

export const nodeStateFromNodeIdSelector = createSimulatorSelector(
  (s: SimulatorState, nodeId: string) => s.nodeStatesByNodeId[nodeId]
);

export const nodeOutputPinValueFromNodeIdAndPinId = createSimulatorSelector(
  (s: SimulatorState, nodeId: string, pinId: string) => {
    return s.nodeOutputValuesByNodeId[nodeId]?.[pinId] || false;
  }
);
