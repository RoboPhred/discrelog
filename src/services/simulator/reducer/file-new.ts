import { isNewFileAction } from "@/actions/file-new";

import { createSimulatorReducer } from "../utils";
import { defaultSimulatorState } from "../state";

export default createSimulatorReducer((state, action) => {
  if (!isNewFileAction(action)) {
    return state;
  }

  return defaultSimulatorState;
});
