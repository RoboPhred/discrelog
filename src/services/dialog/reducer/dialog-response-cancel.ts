import { isCancelDialogAction } from "@/actions/dialog-response-cancel";

import { defaultDialogState } from "../state";
import { createDialogReducer } from "../utils";

export default createDialogReducer((state, action) => {
  if (!isCancelDialogAction(action)) {
    return state;
  }

  return defaultDialogState;
});
