import { isNewProjectAction } from "@/actions/project-new";

import { createNodeGraphReducer } from "../utils";
import { defaultNodeGraphState } from "../state";

export default createNodeGraphReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return defaultNodeGraphState;
});
