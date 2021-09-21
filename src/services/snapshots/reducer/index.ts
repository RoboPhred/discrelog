import { concatReducers } from "@/store/utils";

import circuitGraphInvalidatedReducer from "./circuit-graph-invalidated";
import snapshotCaptureReducer from "./snapshot-capture";
import snapshotRestoreReducer from "./snapshot-restore";

export default concatReducers(
  circuitGraphInvalidatedReducer,
  snapshotCaptureReducer,
  snapshotRestoreReducer
);
