import { combineExtraniousSelection, combineSelection } from "@/selection-mode";

import { isSelectWireSegmentsAction } from "@/actions/select-wire-segments";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectWireSegmentsAction(action)) {
    return state;
  }

  const { segmentIds, mode } = action.payload;

  return {
    ...state,
    selectedElementIds: combineExtraniousSelection(
      state.selectedElementIds,
      mode
    ),
    selectedWireJointIds: combineExtraniousSelection(
      state.selectedWireJointIds,
      mode
    ),
    selectedWireSegmentIds: combineSelection(
      state.selectedWireSegmentIds,
      segmentIds,
      mode
    ),
  };
});
