import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { filterTesselValues } from "@/components/Tessel/utils";

import { isCircuitFieldTesselWindow } from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";
import { editorIdsFromCircuitIdSelector } from "@/services/circuit-editors/selectors/editor";

import { createUiLayoutReducer } from "../utils";

export default createUiLayoutReducer((state, action, appState) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  if (!state.layout) {
    return state;
  }

  const { circuitId } = action.payload;

  const removedWindowIds = editorIdsFromCircuitIdSelector(appState, circuitId);

  const layout = filterTesselValues(state.layout, (value) => {
    if (!isCircuitFieldTesselWindow(value)) {
      return true;
    }

    if (removedWindowIds.indexOf(value.windowProps.editorId) !== -1) {
      return false;
    }

    return true;
  });

  return {
    ...state,
    layout,
  };
});
