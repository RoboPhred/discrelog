import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { filterTesselValues } from "@/components/Tessel/utils";

import { isCircuitFieldTesselWindow } from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";

import { createUiLayoutReducer } from "../utils";

export default createUiLayoutReducer((state, action) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  if (!state.layout) {
    return state;
  }

  const { circuitId } = action.payload;

  const layout = filterTesselValues(state.layout, (value) => {
    if (!isCircuitFieldTesselWindow(value)) {
      return true;
    }

    if (value.windowProps.circuitId === circuitId) {
      return false;
    }

    return true;
  });

  return {
    ...state,
    layout,
  };
});
