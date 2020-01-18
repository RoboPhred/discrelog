import { concatReducers } from "@/store/utils";

import dragContinueReducer from "./drag-continue";
import dragEndReducer from "./drag-end";
import dragStartNodeReducer from "./drag-start-node";
import dragStartSelectReducer from "./drag-start-select";
import selectPinReducer from "./select-pin";
import selectedNodesChangedReducer from "./selected-nodes-changed";

const circuitFieldReducer = concatReducers(
  dragContinueReducer,
  dragEndReducer,
  dragStartNodeReducer,
  dragStartSelectReducer,
  selectPinReducer,
  selectedNodesChangedReducer
);

export default circuitFieldReducer;
