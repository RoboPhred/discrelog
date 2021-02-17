import { AppServicesState } from "@/services";
import { AppState } from "@/store";
import pick from "lodash/pick";

import { UndoServicesStateKeys, UndoServicesStates } from "./state";

export function captureUndoState(state: AppState): UndoServicesStates {
  return pick(state.services, UndoServicesStateKeys);
}
