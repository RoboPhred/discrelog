import { fpSetByArray } from "@/utils";

import { isViewCircuitAction } from "@/actions/view-circuit";

import { normalizeTesselItem, TesselValue } from "@/components/Tessel";
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

  const {
    circuitId,
    circuitNodeIdPath,
    newWindow,
    tesselPath,
  } = action.payload;

  if (circuitIdsSelector(appState).indexOf(circuitId) === -1) {
    return state;
  }

  if (!state.layout) {
    return state;
  }

  const window = circuitFieldTesselWindow(circuitId, circuitNodeIdPath ?? []);

  let layout: TesselValue | null = state.layout;

  if (tesselPath) {
    layout = fpSetByArray(normalizeTesselItem(layout), tesselPath, window);
  } else {
    let inserted = false;
    layout = findAndReplaceTesselValue(layout, (value) => {
      if (isCircuitFieldTesselWindow(value)) {
        inserted = true;
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

    if (!inserted) {
      layout = {
        direction: "row",
        division: {
          firstSize: 200,
        },
        first: layout,
        second: window,
      };
    }
  }

  return {
    ...state,
    layout,
  };
});
