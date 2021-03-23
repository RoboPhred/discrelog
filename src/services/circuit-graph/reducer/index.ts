import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import connectionAttachReducer from "./connection-attach";
import connectionDetatchReducer from "./connection-detatch";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementRenameReducer from "./element-rename";
import projectNewReducer from "./project-new";
import wireCreatePinToPinReducer from "./wire-create-pin-to-pin";

const graphReducer = concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  connectionAttachReducer,
  connectionDetatchReducer,
  elementAddReducer,
  projectNewReducer,
  elementDeleteReducer,
  elementRenameReducer,
  wireCreatePinToPinReducer
);

export default graphReducer;
