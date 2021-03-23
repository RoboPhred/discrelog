import { AppState } from "@/store";

import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { elementPinFromPointSelector } from "@/services/circuit-layout/selectors/element-pin-positions";

export const dragDropTargetPinSelector = (state: AppState) => {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "connection") {
    return null;
  }

  const { dragEnd, dragStartEditorId } = dragState;
  if (!dragEnd) {
    return null;
  }

  const circuitId = circuitIdForEditorIdSelector(state, dragStartEditorId);
  if (!circuitId) {
    return null;
  }

  return elementPinFromPointSelector(state, dragEnd, circuitId);
};
