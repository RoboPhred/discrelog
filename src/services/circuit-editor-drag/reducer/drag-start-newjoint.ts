import { isCircuitEditorDragStartNewJointAction } from "@/actions/circuit-editor-drag-start-newjoint";
import { circuitIdFromConnectionIdSelector } from "@/services/circuits/selectors/connections";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action, appState) => {
  if (!isCircuitEditorDragStartNewJointAction(action)) {
    return state;
  }

  const {
    connectionId,
    addAfterJointId,
    modifierKeys,
    x,
    y,
    editorId,
  } = action.payload;

  const circuitId = circuitIdFromConnectionIdSelector(appState, connectionId);
  if (!circuitId) {
    return state;
  }

  return {
    ...state,
    dragMode: "new-joint" as const,
    dragStart: {
      x,
      y,
    },
    dragStartEditorId: editorId,
    dragEnd: null,
    dragEndEditorId: null,
    dragNewJointConnectionId: connectionId,
    dragNewJointAfterJointId: addAfterJointId,
    dragModifierKeys: modifierKeys,
  };
});
