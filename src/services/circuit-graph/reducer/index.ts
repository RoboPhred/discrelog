import { concatReducers } from "@/store/utils";

import circuitAddReducer from "./circuit-add";
import circuitDeleteReducer from "./circuit-delete";
import elementAddReducer from "./element-add";
import elementDeleteReducer from "./element-delete";
import elementRenameReducer from "./element-rename";
import projectNewReducer from "./project-new";
import wireConnectFloatingToSegmentReducer from "./wire-connect-floating-to-segment";
import wireConnectJointToSegmentReducer from "./wire-connect-joint-to-floating";
import wireConnectJointToJointReducer from "./wire-connect-joint-to-joint";
import wireConnectJointToPinReducer from "./wire-connect-joint-to-pin";
import wireConnectPinToFloatingReducer from "./wire-connect-pin-to-floating";
import wireConnectPinToPinReducer from "./wire-connect-pin-to-pin";
import wireConnectPinToSegmentReducer from "./wire-connect-pin-to-segment";
import wireHydrateReducer from "./wire-hydrate";
import wireInsertJointReducer from "./wire-insert-joint";
import wireJointDeleteReducer from "./wire-joint-delete";
import wireJointMoveReducer from "./wire-joint-move";

const graphReducer = concatReducers(
  circuitAddReducer,
  circuitDeleteReducer,
  elementAddReducer,
  elementDeleteReducer,
  elementRenameReducer,
  projectNewReducer,
  wireConnectFloatingToSegmentReducer,
  wireConnectJointToSegmentReducer,
  wireConnectJointToJointReducer,
  wireConnectJointToPinReducer,
  wireConnectPinToFloatingReducer,
  wireConnectPinToPinReducer,
  wireConnectPinToSegmentReducer,
  wireHydrateReducer,
  wireInsertJointReducer,
  wireJointDeleteReducer,
  wireJointMoveReducer
);

export default graphReducer;
