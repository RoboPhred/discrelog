import { AppState } from "@/store";

import { CircuitEditorsServiceState } from "../state";
import { createCircuitEditorsSelector } from "../utils";

export const circuitEditorStateFromIdSelector = createCircuitEditorsSelector(
  (s: CircuitEditorsServiceState, editorId: string) =>
    s.circucitEditorsById[editorId]
);

export const circuitIdForEditorIdSelector = (
  state: AppState,
  editorId: string
) => {
  const editorState = circuitEditorStateFromIdSelector(state, editorId);
  if (!editorState) {
    return null;
  }

  return editorState.circuitId;
};

export const activeCircuitEditorIdSelector = createCircuitEditorsSelector(
  (s) => s.activeEditorId
);
export const activeCircuitEditorStateSelector = createCircuitEditorsSelector(
  (s) => (s.activeEditorId ? s.circucitEditorsById[s.activeEditorId] : null)
);

export const editorIdsFromCircuitIdSelector = createCircuitEditorsSelector(
  (s: CircuitEditorsServiceState, circuitId: string) => {
    return Object.keys(s.circucitEditorsById).filter(
      (id) => s.circucitEditorsById[id].circuitId === circuitId
    );
  }
);
