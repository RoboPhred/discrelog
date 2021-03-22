import { concatReducers } from "@/store/utils";

import circuitGraphInvalidatedReducer from "./circuit-graph-invalidated";
import elementInteractReducer from "./element-interact";
import simStartReducer from "./sim-start";
import simStepReducer from "./sim-step";
import simStopReducer from "./sim-stop";
import simTickReducer from "./sim-tick";

const simulatorReducer = concatReducers(
  circuitGraphInvalidatedReducer,
  elementInteractReducer,
  simStartReducer,
  simStepReducer,
  simStopReducer,
  simTickReducer
);

export default simulatorReducer;
