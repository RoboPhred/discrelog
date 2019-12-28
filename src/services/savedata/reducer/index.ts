import { reduceReducers } from "@/store/utils";

import autosaveReducer from "./autosave";
import initReducer from "./init";

export default reduceReducers(autosaveReducer, initReducer);
