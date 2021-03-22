import { isDetatchConnectionAction } from "@/actions/connection-detatch";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isDetatchConnectionAction(action)) {
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
