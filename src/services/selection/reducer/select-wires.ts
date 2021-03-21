import { combineSelection } from "@/selection-mode";

import { isSelectWiresAction } from "@/actions/select-wires";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectWiresAction(action)) {
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
