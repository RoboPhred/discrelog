import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";
import { reducerPriority, PRIORITY_SAVE } from "@/store/priorities";
import { isProjectMutationAction } from "@/project-mutation-actions";

import { createSave, storeAutosave } from "@/services/savedata/api";
import { isTutorialActiveSelector } from "@/services/tutorial/selectors/tutorial";

export default reducerPriority(
  PRIORITY_SAVE,
  (state: AppState = defaultAppState, action: AnyAction): AppState => {
    if (!isProjectMutationAction(action)) {
      return state;
    }

    if (isTutorialActiveSelector(state)) {
      return state;
    }

    if (state.services.project.isLoading) {
      return state;
    }

    // FIXME: Side effect.  Should be a saga.
    const save = createSave(state);
    storeAutosave(save);

    return state;
  }
);
