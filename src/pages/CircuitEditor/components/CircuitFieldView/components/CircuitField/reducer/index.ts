import { concatReducers } from "@/store/utils";

import selectPinReducer from "./select-pin";
import selectedNodesChangedReducer from "./selected-nodes-changed";

const circuitFieldReducer = concatReducers(
  selectPinReducer,
  selectedNodesChangedReducer
);

export default circuitFieldReducer;
