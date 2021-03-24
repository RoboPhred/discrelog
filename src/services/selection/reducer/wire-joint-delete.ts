import difference from "lodash/difference";

import { isWireJointDeleteAction } from "@/actions/wire-joint-delete";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isWireJointDeleteAction(action)) {
    return state;
  }

  const { jointIds } = action.payload;

  return {
    ...state,
    selectedJointIds: difference(state.selectedJointIds, jointIds),
  };
});
