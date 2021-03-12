import get from "lodash/get";

import { isCircuitFieldTesselWindow } from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";

import { UiLayoutServiceState } from "../state";
import { createUiLayoutSelector } from "../utils";

export const layoutSelector = createUiLayoutSelector((s) => s.layout);

export const circuitIdForTesselPathSelector = createUiLayoutSelector(
  (s: UiLayoutServiceState, tesselPath: string[]) => {
    const item = get(s.layout, tesselPath);
    if (!isCircuitFieldTesselWindow(item)) {
      return null;
    }

    return item.windowProps.circuitId;
  }
);
