import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementRenameReducer from "./element-rename";
import projectNewReducer from "./project-new";
import wireAttachReducer from "./wire-attach";
import wireDetatchReducer from "./wire-detatch";

const graphReducer = concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  elementAddReducer,
  projectNewReducer,
  elementDeleteReducer,
  elementRenameReducer,
  wireAttachReducer,
  wireDetatchReducer
);

export default graphReducer;
