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
  (s) => {
    if (s.activeEditorId) {
      return s.activeEditorId;
    }

    const keys = Object.keys(s.circucitEditorsById);
    if (keys.length > 0) {
      return keys[0];
    }

    return null;
  }
);

export const activeCircuitEditorStateSelector = createCircuitEditorsSelector(
  (s) => (s.activeEditorId ? s.circucitEditorsById[s.activeEditorId] : null)
);

export const activeCircuitIdSelector = createCircuitEditorsSelector((s) => {
  if (!s.activeEditorId) {
    return null;
  }
  const editorState = s.circucitEditorsById[s.activeEditorId];
  if (!editorState) {
    return null;
  }

  return editorState.circuitId;
});

export const editorIdsFromCircuitIdSelector = createCircuitEditorsSelector(
  (s: CircuitEditorsServiceState, circuitId: string) => {
    return Object.keys(s.circucitEditorsById).filter(
      (id) => s.circucitEditorsById[id].circuitId === circuitId
    );
  }
);
