import { isProjectMutationAction } from "@/project-mutation-actions";

import { defaultSnapshotsServiceState } from "../state";
import { createSnapshotsReducer } from "../utils";

export default createSnapshotsReducer((state, action) => {
  if (!isProjectMutationAction(action)) {
    return state;
  }

  return defaultSnapshotsServiceState;
});
