import { createCircuitEditorDragSelector } from "../utils";

import { gridJointSnapSelector } from "./snap";

export const dragNewJointPositionSelector = createCircuitEditorDragSelector(
  (state) => {
    const gridSnap = gridJointSnapSelector.local(state);
    if (state.dragMode !== "new-joint") {
      return null;
    }

    const { dragEnd, dragModifierKeys } = state;
    if (!dragEnd || !dragModifierKeys) {
      return null;
    }

    const position = { ...dragEnd };
    if (!dragModifierKeys.ctrlMetaKey) {
      position.x = Math.round(position.x / gridSnap) * gridSnap;
      position.y = Math.round(position.y / gridSnap) * gridSnap;
    }

    return position;
  }
);
