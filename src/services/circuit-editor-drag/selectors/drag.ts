import { createCircuitEditorDragSelector } from "../utils";
import { CircuitEditorDragServiceState } from "../state";

export const dragModeSelector = createCircuitEditorDragSelector(
  (s) => s.dragMode
);

export const isEditorDraggingSelector = createCircuitEditorDragSelector(
  (s: CircuitEditorDragServiceState, editorId: string) => {
    if (s.dragMode == null) {
      return false;
    }

    if (s.dragStartEditorId !== s.dragEndEditorId) {
      return false;
    }

    return s.dragStartEditorId === editorId;
  }
);

export const isDraggingSelector = createCircuitEditorDragSelector(
  (s) => s.dragMode != null
);

export const dragStartSelector = createCircuitEditorDragSelector((s) => {
  if (!s.dragMode) {
    return null;
  }

  return s.dragStart;
});

export const dragEndSelector = createCircuitEditorDragSelector((s) => {
  if (!s.dragMode) {
    return null;
  }

  return s.dragEnd;
});
