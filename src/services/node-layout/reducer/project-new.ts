import { isNewProjectAction } from "@/actions/project-new";

import { createNodeLayoutReducer } from "../utils";
import { defaultNodeLayoutState } from "../state";

export default createNodeLayoutReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultNodeLayoutState;
});
