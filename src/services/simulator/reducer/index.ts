import { concatReducers } from "@/store/utils";

import elementGraphInvalidatedReducer from "./element-graph-invalidated";
import fileNewReducer from "./file-new";
import nodeInteractReducer from "./node-interact";
import simEvolveReducer from "./sim-evolve";
import simFastforwardReducer from "./sim-fastforward";
import simPauseReducer from "./sim-pause";
import simStartReducer from "./sim-start";
import simStopReducer from "./sim-stop";

const simulatorReducer = concatReducers(
  elementGraphInvalidatedReducer,
  fileNewReducer,
  nodeInteractReducer,
  simEvolveReducer,
  simFastforwardReducer,
  simPauseReducer,
  simStartReducer,
  simStopReducer
);

export default simulatorReducer;
