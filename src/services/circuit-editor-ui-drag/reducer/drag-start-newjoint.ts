import { isFieldDragStartNewJointAction } from "@/actions/field-drag-start-newjoint";
import { circuitIdFromConnectionIdSelector } from "@/services/circuits/selectors/connections";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action, appState) => {
  if (!isFieldDragStartNewJointAction(action)) {
    return state;
  }

  const { connectionId, addAfterJointId, modifierKeys, x, y } = action.payload;

  return {
    ...state,
    dragMode: "new-joint" as const,
    dragCircuitId: circuitIdFromConnectionIdSelector(appState, connectionId),
    dragStart: {
      x,
      y,
    },
    dragNewJointConnectionId: connectionId,
    dragNewJointAfterJointId: addAfterJointId,
    dragModifierKeys: modifierKeys,
  };
});
