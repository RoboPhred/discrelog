import { circuitIdsSelector } from "@/services/circuits/selectors/circuits";

import { isViewCircuitAction } from "@/actions/view-circuit";

import { createCircuitEditorsReducer, findActiveEditorId } from "../utils";

export default createCircuitEditorsReducer((state, action, appState) => {
  if (!isViewCircuitAction(action)) {
    return state;
  }

  const { circuitId, elementIdPath, newWindowId } = action.payload;

  if (circuitIdsSelector(appState).indexOf(circuitId) === -1) {
    return state;
  }

  let targetWindowId = newWindowId;
  if (!targetWindowId) {
    targetWindowId = findActiveEditorId(state);
  }

  if (!targetWindowId) {
    return state;
  }

  return {
    ...state,
    circucitEditorsById: {
      ...state.circucitEditorsById,
      [targetWindowId]: {
        circuitId,
        elementIdPath: elementIdPath ?? [],
      },
    },
    activeEditorId: targetWindowId,
  };
});
