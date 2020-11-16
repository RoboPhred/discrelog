import { createSimulatorSelector } from "../utils";
import { SimulatorState } from "../state";

// FIXME: Exporting simulator ids when consumer expects circuit ids
export const nodeStatesByIdSelector = createSimulatorSelector(
  (s) => s.nodeStatesByNodeId
);

// FIXME: Uses simulator id when consumer expects circuit id
export const nodeStateFromNodeIdSelector = createSimulatorSelector(
  (s: SimulatorState, nodeId: string) => s.nodeStatesByNodeId[nodeId]
);
