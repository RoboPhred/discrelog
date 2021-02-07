import { concatReducers } from "@/store/utils";

import simStartReducer from "./sim-start";
import simStopReducer from "./sim-stop";

export default concatReducers(simStartReducer, simStopReducer);
