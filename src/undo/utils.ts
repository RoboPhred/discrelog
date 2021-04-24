import pick from "lodash/pick";

import { AppState } from "@/store";

import { activeCircuitEditorStateSelector } from "@/services/circuit-editors/selectors/editor";

import { UndoStackState, UndoServicesStateKeys } from "./state";

// TODO: Consider using a difference engine to store the minimal difference between the states.
//  This should let us store far more undo operations as the project gets larger.
// Could use https://www.npmjs.com/package/deep-diff
// Problem with this is it takes up time capturing the undo, which slows down all operations.
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
