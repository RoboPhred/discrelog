import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import fileNewReducer from "./file-new";
import nodeDeleteReducer from "./node-delete";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";

const graphReducer = concatReducers(
  elementAddReducer,
  fileNewReducer,
  nodeDeleteReducer,
  wireAttachReducer,
  wireDetatchReducer
);

export default graphReducer;
