import { combineSelection } from "@/selection-mode";

import { isSelectElementsAction } from "@/actions/select-elements";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectElementsAction(action)) {
    return state;
  }

  const { elementIds, mode } = action.payload;

  return {
    ...state,
    selectedElementIds: combineSelection(
      state.selectedElementIds,
      elementIds,
      mode
    ),
    selectedConnectionIds: mode === "set" ? [] : state.selectedConnectionIds,
    selectedJointIds: mode === "set" ? [] : state.selectedJointIds,
  };
});
