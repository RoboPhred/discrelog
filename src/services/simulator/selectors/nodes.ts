import { createSimulatorSelector } from "../utils";

export const nodeStatesByIdSelector = createSimulatorSelector(
  s => s.nodeStatesByNodeId
);

export const nodeOutputValuesByNodeIdSelector = createSimulatorSelector(
  s => s.nodeOutputValuesByNodeId
);
