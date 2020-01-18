import { concatReducers } from "@/store/utils";

import fileNewReducer from "./file-new";
import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import nodeInteractReducer from "./node-interact";
import simEvolveReducer from "./sim-evolve";
import simFastforwardReducer from "./sim-fastforward";
import simStartReducer from "./sim-start";
import simStopReducer from "./sim-stop";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";

const simulatorReducer = concatReducers(
  fileNewReducer,
  nodeAddReducer,
  nodeDeleteReducer,
  nodeInteractReducer,
  simEvolveReducer,
  simFastforwardReducer,
  simStartReducer,
  simStopReducer,
  wireAttachReducer,
  wireDetatchReducer
);

export default simulatorReducer;
