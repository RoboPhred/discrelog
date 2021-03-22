import { isCircuitEditorDragStartNewJointAction } from "@/actions/circuit-editor-drag-start-newjoint";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
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
