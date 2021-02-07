import { concatReducers } from "@/store/utils";

import elementGraphInvalidatedReducer from "./element-graph-invalidated";
import nodeInteractReducer from "./node-interact";
import simFastforwardReducer from "./sim-fastforward";
import simPauseReducer from "./sim-pause";
import simStartReducer from "./sim-start";
import simStopReducer from "./sim-stop";
import simTickReducer from "./sim-tick";

const simulatorReducer = concatReducers(
  elementGraphInvalidatedReducer,
  nodeInteractReducer,
  simFastforwardReducer,
  simPauseReducer,
  simStartReducer,
  simStopReducer,
  simTickReducer
);

export default simulatorReducer;
