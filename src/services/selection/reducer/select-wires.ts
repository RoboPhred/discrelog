import { isSelectWiresAction } from "@/actions/select-wires";
import { createSelectionReducer, combineSelection } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectWiresAction(action)) {
    return state;
  }

  const { wireIds, mode } = action.payload;

  return {
    ...state,
    selectionType: "wires",
    selectedIds: combineSelection(state.selectedIds, wireIds, mode)
  };
});
