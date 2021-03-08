import { isViewCircuitAction } from "@/actions/circuit-view";
import { findAndReplaceTesselValue } from "@/components/Tessel/utils";
import {
  circuitFieldTesselWindow,
  isCircuitFieldTesselWindow,
} from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";
import { circuitIdsSelector } from "@/services/circuits/selectors/circuits";

import { createUiLayoutReducer } from "../utils";

export default createUiLayoutReducer((state, action, appState) => {
  if (!isViewCircuitAction(action)) {
    return state;
  }

  const { circuitId, circuitNodeIdPath, newWindow } = action.payload;

  if (circuitIdsSelector(appState).indexOf(circuitId) === -1) {
    return state;
  }

  if (!state.layout) {
    return state;
  }

  const layout = findAndReplaceTesselValue(state.layout, (value) => {
    if (isCircuitFieldTesselWindow(value)) {
      const window = circuitFieldTesselWindow(
        circuitId,
        circuitNodeIdPath ?? []
      );
      if (newWindow) {
        return {
          direction: "row",
          division: 50,
          first: value,
          second: window,
        };
      } else {
        return window;
      }
    }
    return null;
  });

  return {
    ...state,
    layout,
  };
});
