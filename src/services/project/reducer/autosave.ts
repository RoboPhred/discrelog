import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import { reducerPriority, PRIORITY_SAVE } from "@/store/priorities";
import { isProjectMutationAction } from "@/project-mutation-actions";

import { createSave, storeAutosave } from "@/services/savedata/api";

export default reducerPriority(
  PRIORITY_SAVE,
  (state: AppState = defaultAppState, action: AnyAction): AppState => {
    if (!isProjectMutationAction(action)) {
      return state;
    }

    const save = createSave(state);
    storeAutosave(save);

    return state;
  }
);
