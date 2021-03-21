import difference from "lodash/difference";

import { isDeleteElementAction } from "@/actions/element-delete";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action) => {
  if (!isDeleteElementAction(action)) {
    return state;
  }

  const { elementIds } = action.payload;

  return {
    ...state,
    selectedElementIds: difference(state.selectedElementIds, elementIds),
    selectedConnectionIds: [], // Might be removing a node attached to a selected wire
  };
});
