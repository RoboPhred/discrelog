import { combineSelection } from "@/selection-mode";

import { isSelectWireJointsAction } from "@/actions/select-wire-joints";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectWireJointsAction(action)) {
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
