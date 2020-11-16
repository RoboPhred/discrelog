import { isDetatchWireAction } from "@/actions/wire-detatch";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isDetatchWireAction(action)) {
    return state;
  }

  const { connectionId } = action.payload;

  return {
    ...state,
    selectedConnectionIds: state.selectedConnectionIds.filter(
      (x) => x !== connectionId
    ),
  };
});
