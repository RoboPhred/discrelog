import {
  isTesselWindow,
  normalizeTesselItem,
  TesselValue,
} from "@/components/Tessel";
import { walkTesselValues } from "@/components/Tessel/utils";

import { CIRCUIT_FIELD_WINDOW_ID } from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";

import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createUiLayoutReducer = createServiceReducerCreator("uiLayout");
export const createUiLayoutSelector = createServiceSelectorCreator("uiLayout");

export function findDefaultActiveWindow(value: TesselValue | null): string[] {
  let activePath: string[] = [];
  if (!value) {
    return activePath;
  }

  walkTesselValues(value, (item, path) => {
    const normalized = normalizeTesselItem(item);
    if (
      isTesselWindow(normalized) &&
      normalized.windowId === CIRCUIT_FIELD_WINDOW_ID
    ) {
      activePath = path;
      return false;
    }
  });

  return activePath;
}
