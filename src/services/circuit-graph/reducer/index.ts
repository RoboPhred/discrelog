import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementRenameReducer from "./element-rename";
import projectNewReducer from "./project-new";
import wireConnectFloatingToSegmentReducer from "./wire-connect-floating-to-segment";
import wireConnectPinToPinReducer from "./wire-connect-pin-to-pin";
import wireConnectPinToSegmentReducer from "./wire-connect-pin-to-segment";
import wireHydrateReducer from "./wire-hydrate";
import wireInsertJointReducer from "./wire-insert-joint";

const graphReducer = concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  elementAddReducer,
  elementDeleteReducer,
  elementRenameReducer,
  projectNewReducer,
  wireConnectFloatingToSegmentReducer,
  wireConnectPinToPinReducer,
  wireConnectPinToSegmentReducer,
  wireHydrateReducer,
  wireInsertJointReducer
);

export default graphReducer;
