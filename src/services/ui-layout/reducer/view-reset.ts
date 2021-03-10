import { isResetViewAction } from "@/actions/view-reset";
import { defaultUiLayoutServiceState } from "../state";
import { createUiLayoutReducer } from "../utils";

export default createUiLayoutReducer((state, action) => {
  if (!isResetViewAction(action)) {
    return state;
  }

  return defaultUiLayoutServiceState;
});
