import { isSelectJointsAction } from "@/actions/select-joints";
import { combineExtraniousSelection, combineSelection } from "@/selection-mode";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectJointsAction(action)) {
    return state;
  }

  const { jointIds, mode } = action.payload;

  return {
    ...state,
    selectedElementIds: combineExtraniousSelection(
      state.selectedElementIds,
      mode
    ),
    selectedJointIds: combineSelection(state.selectedJointIds, jointIds, mode),
  };
});
