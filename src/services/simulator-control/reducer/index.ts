import { concatReducers } from "@/store/utils";

import circuitGraphInvalidatedReducer from "./circuit-graph-invalidated";
import simPauseReducer from "./sim-pause";
import simStartReducer from "./sim-start";
import simStepReducer from "./sim-step";
import simStopReducer from "./sim-stop";

const simulatorReducer = concatReducers(
  circuitGraphInvalidatedReducer,
  simPauseReducer,
  simStartReducer,
  simStepReducer,
  simStopReducer
);

export default simulatorReducer;
