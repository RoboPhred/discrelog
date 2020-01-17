import { isSelectWireJointsAction } from "@/actions/select-wire-joints";
import { createSelectionReducer, combineSelection } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isSelectWireJointsAction(action)) {
    return state;
  }

  const { jointIds, mode } = action.payload;

  return {
    ...state,
    selectedNodeIds: mode === "set" ? [] : state.selectedNodeIds,
    selectedWireIds: mode === "set" ? [] : state.selectedWireIds,
    selectedJointIds: combineSelection(state.selectedJointIds, jointIds, mode)
  };
});
