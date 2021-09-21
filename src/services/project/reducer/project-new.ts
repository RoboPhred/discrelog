import { isNewProjectAction } from "@/actions/project-new";

import { createProjectReducer } from "../utils";

export default createProjectReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  return {
    ...state,
    projectName: "New Project",
    projectModified: false,
  };
});
