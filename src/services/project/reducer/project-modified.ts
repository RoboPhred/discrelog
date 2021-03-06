import { isProjectMutationAction } from "@/project-mutation-actions";
import { createProjectReducer } from "../utils";

export default createProjectReducer((state, action) => {
  if (!isProjectMutationAction(action)) {
    return state;
  }

  return {
    ...state,
    projectModified: true,
  };
});
