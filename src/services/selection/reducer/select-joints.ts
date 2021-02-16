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
    selectedNodeIds: mode === "set" ? [] : state.selectedNodeIds,
    selectedConnectionIds: mode === "set" ? [] : state.selectedConnectionIds,
    selectedJointIds: combineSelection(state.selectedJointIds, jointIds, mode),
  };
});
