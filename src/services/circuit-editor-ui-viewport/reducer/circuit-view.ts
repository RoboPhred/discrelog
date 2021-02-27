import { isViewCircuitAction } from "@/actions/circuit-view";
import { circuitIdsSelector } from "@/services/circuits/selectors/circuits";

import { createCircuitEditorUiViewportReducer } from "../utils";

export default createCircuitEditorUiViewportReducer(
  (state, action, appState) => {
    if (!isViewCircuitAction(action)) {
      return state;
    }

    const { circuitId, circuitNodeIdPath } = action.payload;

    if (circuitIdsSelector(appState).indexOf(circuitId) === -1) {
      return state;
    }

    return {
      ...state,
      editingCircuitId: circuitId,
      editingCircuitNodeIdPath: circuitNodeIdPath,
    };
  }
);
