import { concatReducers } from "@/store/utils";

import elementGraphInvalidatedReducer from "./element-graph-invalidated";
import simPauseReducer from "./sim-pause";
import simStartReducer from "./sim-start";
import simStopReducer from "./sim-stop";

const simulatorReducer = concatReducers(
  elementGraphInvalidatedReducer,
  simPauseReducer,
  simStartReducer,
  simStopReducer
);

export default simulatorReducer;
