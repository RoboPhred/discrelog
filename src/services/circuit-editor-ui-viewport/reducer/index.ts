import { concatReducers } from "@/store/utils";

import circuitNewReducer from "./circuit-new";
import viewZoomReducer from "./view-zoom";

export default concatReducers(circuitNewReducer, viewZoomReducer);
