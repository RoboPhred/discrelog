import pick from "lodash/pick";
import get from "lodash/get";

import { AppState } from "@/store";

import { isCircuitFieldTesselWindow } from "@/pages/CircuitEditorPage/windows/CircuitFieldWindow/tessel-window";

import { UndoStackState, UndoServicesStateKeys } from "./state";

export function captureUndoState(state: AppState): UndoStackState {
  let viewCircuitId: string | null = null;

  const { layout, activeCircuitEditorPath } = state.services.uiLayout;
  const circuitEditorWindow = get(layout, activeCircuitEditorPath);
  if (isCircuitFieldTesselWindow(circuitEditorWindow)) {
    viewCircuitId = circuitEditorWindow.windowProps.circuitId;
  }

  return {
    serviceStates: pick(state.services, UndoServicesStateKeys),
    viewCircuitId,
  };
}
