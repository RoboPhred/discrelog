import { isFieldDragStartNewJointAction } from "@/actions/field-drag-start-newjoint";

import { createCircuitEditorUiReducer } from "../utils";

export default createCircuitEditorUiReducer((state, action) => {
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
