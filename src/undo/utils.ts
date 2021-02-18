import pick from "lodash/pick";

import { AppState } from "@/store";

import { UndoServicesStateKeys, UndoServicesStates } from "./state";

export function captureUndoState(state: AppState): UndoServicesStates {
  return pick(state.services, UndoServicesStateKeys);
}
