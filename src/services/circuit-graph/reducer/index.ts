import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementRenameReducer from "./element-rename";
import projectNewReducer from "./project-new";
import wireCreatePinToPinReducer from "./wire-create-pin-to-pin";
import wireHydrateReducer from "./wire-hydrate";
import wireInsertJointReducer from "./wire-insert-joint";

const graphReducer = concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  elementAddReducer,
  projectNewReducer,
  elementDeleteReducer,
  elementRenameReducer,
  wireCreatePinToPinReducer,
  wireHydrateReducer,
  wireInsertJointReducer
);

export default graphReducer;
