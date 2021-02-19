import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import circuitEditReducer from "./circuit-edit";
import circuitNewReducer from "./circuit-new";
import viewZoomReducer from "./view-zoom";

export default concatReducers(
  circuitDeleteReducer,
  circuitEditReducer,
  circuitNewReducer,
  viewZoomReducer
);
