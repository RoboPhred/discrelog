import { combineReducers } from "@/store/utils";

import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import nodeInteractReducer from "./node-interact";
import simEvolveReducer from "./sim-evolve";
import simFastforwardReducer from "./sim-fastforward";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";
import wireToggleReducer from "./wire-toggle";

const simulatorReducer = combineReducers(
  nodeAddReducer,
  nodeDeleteReducer,
  nodeInteractReducer,
  simEvolveReducer,
  simFastforwardReducer,
  wireAttachReducer,
  wireDetatchReducer,
  wireToggleReducer
);

export default simulatorReducer;
