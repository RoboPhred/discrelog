import { isAcceptDialogAction } from "@/actions/dialog-response-accept";

import { defaultDialogServiceState } from "../state";
import { createDialogReducer } from "../utils";

export default createDialogReducer((state, action) => {
  if (!isAcceptDialogAction(action)) {
    return state;
  }

  return defaultDialogServiceState;
});
