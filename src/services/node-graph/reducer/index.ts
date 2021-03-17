import { concatReducers } from "@/store/utils";

import nodeAddReducer from "./node-add";
import nodeDeleteReducer from "./node-delete";
import nodeRenameReducer from "./node-rename";
import projectNewReducer from "./project-new";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";

const graphReducer = concatReducers(
  nodeAddReducer,
  projectNewReducer,
  nodeDeleteReducer,
  nodeRenameReducer,
  wireAttachReducer,
  wireDetatchReducer
);

export default graphReducer;
