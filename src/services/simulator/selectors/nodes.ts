import { createSimulatorSelector } from "../utils";
import { SimulatorState } from "../state";

export const nodeStatesByIdSelector = createSimulatorSelector(
  s => s.nodeStatesByNodeId
);

export const nodeStateSelector = createSimulatorSelector(
  (s: SimulatorState, nodeId: string) => s.nodeStatesByNodeId[nodeId]
);

export const nodeOutputValuesByNodeIdSelector = createSimulatorSelector(
  s => s.nodeOutputValuesByNodeId
);
