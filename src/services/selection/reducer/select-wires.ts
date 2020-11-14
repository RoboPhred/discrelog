import { isSelectWiresAction } from "@/actions/select-wires";
import { createSelectionReducer, combineSelection } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectWiresAction(action)) {
    return state;
  }

  const { wireIds, mode } = action.payload;

  return {
    ...state,
    selectedNodeIds: mode === "set" ? [] : state.selectedNodeIds,
    selectedWireIds: combineSelection(state.selectedWireIds, wireIds, mode),
    selectedJointIds: mode === "set" ? [] : state.selectedJointIds,
  };
});
