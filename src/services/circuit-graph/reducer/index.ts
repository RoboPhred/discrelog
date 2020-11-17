import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import nodeDeleteReducer from "./node-delete";
import projectNewReducer from "./project-new";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";

const graphReducer = concatReducers(
  elementAddReducer,
  projectNewReducer,
  nodeDeleteReducer,
  wireAttachReducer,
  wireDetatchReducer
);

export default graphReducer;
