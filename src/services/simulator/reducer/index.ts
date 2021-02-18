import { concatReducers } from "@/store/utils";

import elementGraphInvalidatedReducer from "./element-graph-invalidated";
import nodeInteractReducer from "./node-interact";
import simFastforwardReducer from "./sim-fastforward";
import simStartReducer from "./sim-start";
import simTickReducer from "./sim-tick";

const simulatorReducer = concatReducers(
  elementGraphInvalidatedReducer,
  nodeInteractReducer,
  simFastforwardReducer,
  simStartReducer,
  simTickReducer
);

export default simulatorReducer;
