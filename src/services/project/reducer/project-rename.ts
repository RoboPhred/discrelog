import { isRenameProjectAction } from "@/actions/project-rename";

import { createProjectReducer } from "../utils";

export default createProjectReducer((state, action) => {
  if (!isRenameProjectAction(action)) {
    return state;
  }

  let { projectName } = action.payload;
  projectName = projectName.trim();

  if (projectName === "") {
    return state;
  }

  return {
    ...state,
    projectName,
  };
});
