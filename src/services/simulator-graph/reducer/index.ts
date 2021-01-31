import { concatReducers } from "@/store/utils";

import simStartReducer from "./sim-start";

export default concatReducers(simStartReducer);
