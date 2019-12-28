import { reduceReducers } from "@/store/utils";

import fileNewReducer from "./file-new";
import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";

const graphReducer = reduceReducers(
  fileNewReducer,
  nodeAddReducer,
  nodeDeleteReducer,
  wireAttachReducer,
  wireDetatchReducer
);

export default graphReducer;
