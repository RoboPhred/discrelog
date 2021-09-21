import { combineExtraniousSelection, combineSelection } from "@/selection-mode";

import { isSelectWireJointsAction } from "@/actions/select-wire-joints";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectWireJointsAction(action)) {
    return state;
  }

  const { jointIds, mode } = action.payload;

  return {
    ...state,
    selectedElementIds: combineExtraniousSelection(
      state.selectedElementIds,
      mode
    ),
    selectedWireJointIds: combineSelection(
      state.selectedWireJointIds,
      jointIds,
      mode
    ),
    selectedWireSegmentIds: combineExtraniousSelection(
      state.selectedWireSegmentIds,
      mode
    ),
  };
});
