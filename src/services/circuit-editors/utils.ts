import first from "lodash/first";

import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";
import { CircuitEditorsServiceState } from "./state";

export const createCircuitEditorsReducer = createServiceReducerCreator(
  "circuitEditors"
);
export const createCircuitEditorsSelector = createServiceSelectorCreator(
  "circuitEditors"
);

export function findActiveEditorId(
  state: CircuitEditorsServiceState
): string | null {
  if (state.activeEditorId) {
    return state.activeEditorId;
  }
  return first(Object.keys(state.circucitEditorsById)) ?? null;
}
