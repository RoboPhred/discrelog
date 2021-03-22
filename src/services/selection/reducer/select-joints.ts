import { combineSelection } from "@/selection-mode";

import { isSelectConnectionJointsAction } from "@/actions/select-connection-joints";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectConnectionJointsAction(action)) {
    return state;
  }

  const { jointIds, mode } = action.payload;

  return {
    ...state,
    selectedElementIds: mode === "set" ? [] : state.selectedElementIds,
    selectedConnectionIds: mode === "set" ? [] : state.selectedConnectionIds,
    selectedJointIds: combineSelection(state.selectedJointIds, jointIds, mode),
  };
});
