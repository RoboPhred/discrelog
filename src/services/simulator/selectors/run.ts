import { createSimulatorSelector } from "../utils";

export const isRunningSelector = createSimulatorSelector(
  state => state.mode === "run"
);
export const ticksPerSecondSelector = createSimulatorSelector(
  state => state.ticksPerSecond
);
