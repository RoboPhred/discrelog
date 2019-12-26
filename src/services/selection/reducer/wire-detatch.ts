import { createSelectionReducer } from "../utils";
import { isDetatchWireAction } from "@/actions/wire-detatch";

export default createSelectionReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  if (state.selectionType !== "wires") {
    return state;
  }

  const { wireId } = action.payload;

  return {
    ...state,
    selectedIds: state.selectedIds.filter(x => x !== wireId)
  };
});
