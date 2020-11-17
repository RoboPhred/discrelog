import { isAcceptDialogAction } from "@/actions/dialog-response-accept";

import { defaultDialogState } from "../state";
import { createDialogReducer } from "../utils";

export default createDialogReducer((state, action) => {
  if (!isAcceptDialogAction(action)) {
    return state;
  }

  return defaultDialogState;
});
