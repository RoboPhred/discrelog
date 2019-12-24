import { reduceReducers } from "@/store/utils";

import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import nodeMoveReducer from "./node-move";

const fieldReducer = reduceReducers(
  nodeAddReducer,
  nodeDeleteReducer,
  nodeMoveReducer
);

export default fieldReducer;
