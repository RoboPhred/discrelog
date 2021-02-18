import { createSimulatorControlSelector } from "../utils";

export const isSimActiveSelector = createSimulatorControlSelector(
  (state) => state.mode !== "edit"
);

export const isSimRunningSelector = createSimulatorControlSelector(
  (state) => state.mode === "run"
);

export const isSimPausedSelector = createSimulatorControlSelector(
  (state) => state.mode === "pause"
);

export const ticksPerSecondSelector = createSimulatorControlSelector(
  (state) => state.ticksPerSecond
);
