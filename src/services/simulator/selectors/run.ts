import { createSimulatorSelector } from "../utils";

export const isSimActiveSelector = createSimulatorSelector(
  state => state.mode !== "edit"
);

export const isSimRunningSelector = createSimulatorSelector(
  state => state.mode === "run"
);

export const isSimPausedSelector = createSimulatorSelector(
  state => state.mode === "pause"
);

export const ticksPerSecondSelector = createSimulatorSelector(
  state => state.ticksPerSecond
);
