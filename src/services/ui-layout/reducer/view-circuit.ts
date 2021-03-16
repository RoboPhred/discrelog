import { isViewCircuitAction } from "@/actions/view-circuit";

import { normalizeTesselItem, TesselValue } from "@/components/Tessel";
import { findAndReplaceTesselValue } from "@/components/Tessel/utils";

import {
  circuitFieldTesselWindow,
  isCircuitFieldTesselWindow,
} from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";
import { activeCircuitEditorIdSelector } from "@/services/circuit-editors/selectors/editor";

import { createUiLayoutReducer } from "../utils";

export default createUiLayoutReducer((state, action, appState) => {
  if (!isViewCircuitAction(action)) {
    return state;
  }

  const { newWindowId } = action.payload;

  if (!newWindowId) {
    return state;
  }

  const window = circuitFieldTesselWindow(newWindowId);
  const activeEditorId = activeCircuitEditorIdSelector(appState);

  let layout: TesselValue | null = state.layout;

  if (layout == null) {
    layout = window;
  } else {
    let inserted = false;

    // Try inserting the window alongside the active editor.
    layout = findAndReplaceTesselValue(layout, (value) => {
      const normalized = normalizeTesselItem(value);
      if (
        isCircuitFieldTesselWindow(normalized) &&
        normalized.windowProps.editorId === activeEditorId
      ) {
        inserted = true;
        return {
          direction: "row",
          division: 50,
          first: value,
          second: window,
        };
      }

      return null;
    });

    if (!inserted) {
      layout = {
        direction: "row",
        division: 50,
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
