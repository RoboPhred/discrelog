import { concatReducers } from "@/store/utils";

import simStartReducer from "./sim-start";
import simStepReducer from "./sim-step";
import simStopReducer from "./sim-stop";

export default concatReducers(simStartReducer, simStepReducer, simStopReducer);
