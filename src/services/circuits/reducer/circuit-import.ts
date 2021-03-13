import { AnyAction } from "redux";

import { AppState, defaultAppState } from "@/store";

import { isImportCircuitAction } from "@/actions/circuit-import";
import { importCircuitsFromSave } from "@/services/savedata/api";
import { asArray } from "@/arrays";

export default function circuitImportReducer(
  state: AppState = defaultAppState,
  action: AnyAction
): AppState {
  if (!isImportCircuitAction(action)) {
    return state;
  }

  const { circuitIds, saveData } = action.payload;

  return importCircuitsFromSave(state, circuitIds, saveData);
}
