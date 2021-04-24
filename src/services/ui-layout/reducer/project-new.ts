import { isNewProjectAction } from "@/actions/project-new";
import { defaultUiLayoutServiceState } from "../state";
import { createUiLayoutReducer } from "../utils";

export default createUiLayoutReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultUiLayoutServiceState;
});
