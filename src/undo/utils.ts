import pick from "lodash/pick";

import { AppState } from "@/store";

import { activeCircuitEditorStateSelector } from "@/services/circuit-editors/selectors/editor";

import { UndoStackState, UndoServicesStateKeys } from "./state";

export function captureUndoState(state: AppState): UndoStackState {
  let viewCircuitId: string | null = null;

  const activeEditor = activeCircuitEditorStateSelector(state);
  if (activeEditor) {
    viewCircuitId = activeEditor.circuitId;
  }

  return {
    serviceStates: pick(state.services, UndoServicesStateKeys),
    viewCircuitId,
  };
}
