import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import circuitNewReducer from "./circuit-new";
import circuitViewReducer from "./circuit-view";
import viewZoomReducer from "./view-zoom";

export default concatReducers(
  circuitDeleteReducer,
  circuitNewReducer,
  circuitViewReducer,
  viewZoomReducer
);
