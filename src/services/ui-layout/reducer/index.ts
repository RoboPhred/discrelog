import { concatReducers } from "@/store/utils";

import circuitDeleteReducer from "./circuit-delete";
import circuitViewReducer from "./circuit-view";
import layoutRearrangeReducer from "./layout-rearrange";

export default concatReducers(
  circuitDeleteReducer,
  circuitViewReducer,
  layoutRearrangeReducer
);
