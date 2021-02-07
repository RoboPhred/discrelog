import { createSimulatorSelector } from "../utils";

export const averageMsecsPerTickSelector = createSimulatorSelector(
  (state) => state.profilerLogicUpdateMsecs
);
