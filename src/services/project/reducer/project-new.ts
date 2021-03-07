import { isNewProjectAction } from "@/actions/project-new";

import { deleteAutosave } from "@/services/savedata/api";
import { createProjectReducer } from "../utils";

export default createProjectReducer((state, action) => {
  if (!isNewProjectAction(action)) {
    return state;
  }

  // FIXME: Side effect, move to saga.
  deleteAutosave();

  return {
    ...state,
    projectName: "New Project",
    projectModified: false,
  };
});
