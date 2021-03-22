import { combineSelection } from "@/selection-mode";

import { isSelectConnectionsAction } from "@/actions/select-connections";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectConnectionsAction(action)) {
    return state;
  }

  const { connectionIds, mode } = action.payload;

  return {
    ...state,
    selectedElementIds: mode === "set" ? [] : state.selectedElementIds,
    selectedConnectionIds: combineSelection(
      state.selectedConnectionIds,
      connectionIds,
      mode
    ),
    selectedJointIds: mode === "set" ? [] : state.selectedJointIds,
  };
});
