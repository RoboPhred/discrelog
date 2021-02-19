import { isNewProjectAction } from "@/actions/project-new";

import { createNodeLayoutReducer } from "../utils";
import { defaultNodeLayoutServiceState } from "../state";

export default createNodeLayoutReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultNodeLayoutServiceState;
});
