import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { wireId } = action.payload;

  return {
    ...state,
    selectedWireIds: state.selectedWireIds.filter(x => x !== wireId)
  };
});
