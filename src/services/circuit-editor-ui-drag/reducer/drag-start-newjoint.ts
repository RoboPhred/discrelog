import { isFieldDragStartNewJointAction } from "@/actions/field-drag-start-newjoint";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action) => {
  if (!isFieldDragStartNewJointAction(action)) {
    return state;
  }

  const { connectionId, addAfterJointId, modifierKeys, x, y } = action.payload;

  return {
    ...state,
    dragMode: "new-joint" as const,
    dragStart: {
      x,
      y,
    },
    dragNewJointConnectionId: connectionId,
    dragNewJointAfterJointId: addAfterJointId,
    dragModifierKeys: modifierKeys,
  };
});
