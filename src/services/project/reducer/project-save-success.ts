import { isSaveProjectSuccessAction } from "@/actions/project-save";
import { createProjectReducer } from "../utils";

export default createProjectReducer((state, action) => {
  if (!isSaveProjectSuccessAction(action)) {
    return state;
  }

  return {
    ...state,
    projectModified: false,
  };
});
