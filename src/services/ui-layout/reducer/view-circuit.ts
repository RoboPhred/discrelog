import get from "lodash/get";

import { fpSetByArray } from "@/utils";

import { isViewCircuitAction } from "@/actions/view-circuit";

import { normalizeTesselItem, TesselValue } from "@/components/Tessel";

import { circuitFieldTesselWindow } from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";

import { circuitIdsSelector } from "@/services/circuits/selectors/circuits";

import { createUiLayoutReducer, findDefaultActiveWindow } from "../utils";

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

  let activeCircuitEditorPath = state.activeCircuitEditorPath;
  if (!get(layout, activeCircuitEditorPath)) {
    activeCircuitEditorPath = findDefaultActiveWindow(layout);
  }

  if (tesselPath) {
    // We want to open at an explicit path
    if (!get(layout, tesselPath)) {
      // Path does not exist, do nothing.
      return state;
    }
    layout = fpSetByArray(normalizeTesselItem(layout), tesselPath, window);
    activeCircuitEditorPath = tesselPath;
  } else if (newWindow || activeCircuitEditorPath.length === 0) {
    // We want to open in a new window, or
    // we want to open in the existing window but there is none.

    if (activeCircuitEditorPath.length > 0) {
      // We have an active window, insert to the side of it.
      layout = fpSetByArray(
        normalizeTesselItem(layout),
        activeCircuitEditorPath,
        (value: TesselValue) => {
          return {
            direction: "row",
            division: 50,
            first: value,
            second: window,
          };
        }
      );
    } else {
      // No active window, create a new one directly
      layout = {
        direction: "row",
        division: {
          firstSize: 200,
        },
        first: layout,
        second: window,
      };
      activeCircuitEditorPath = ["second"];
    }
  } else {
    // Target the existing window.
    layout = fpSetByArray(
      normalizeTesselItem(layout),
      activeCircuitEditorPath,
      window
    );
  }

  return {
    ...state,
    layout,
    activeCircuitEditorPath,
  };
});
