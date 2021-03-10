import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import layoutRearrangeReducer from "./layout-rearrange";
import viewCircuitReducer from "./view-circuit";
import viewResetReducer from "./view-reset";

export default concatReducers(
  circuitDeleteReducer,
  layoutRearrangeReducer,
  viewCircuitReducer,
  viewResetReducer
);
