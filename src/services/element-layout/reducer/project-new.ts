import { isNewProjectAction } from "@/actions/project-new";

import { createElementLayoutReducer } from "../utils";
import { defaultElementLayoutServiceState } from "../state";

export default createElementLayoutReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultElementLayoutServiceState;
});
