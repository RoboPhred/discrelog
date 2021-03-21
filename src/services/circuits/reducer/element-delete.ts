import { isDeleteElementAction } from "@/actions/element-delete";
import mapValues from "lodash/mapValues";

import { createCircuitsReducer } from "../utils";

export default createCircuitsReducer((state, action) => {
  if (!isDeleteElementAction(action)) {
    return state;
  }

  const { elementIds: deletedElementIds } = action.payload;

  return {
    ...state,
    elementIdsByCircuitId: mapValues(
      state.elementIdsByCircuitId,
      (elementIds) =>
        elementIds.filter(
          (elementId) => deletedElementIds.indexOf(elementId) === -1
        )
    ),
  };
});
