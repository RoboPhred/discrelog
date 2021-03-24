import { isCircuitEditorDragStartWireJointAction } from "@/actions/circuit-editor-drag-start-wire-joint";
import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragStartWireJointAction(action)) {
    return state;
  }

  const { x, y, editorId, jointId, modifierKeys } = action.payload;

  return {
    dragMode: "wire-joint",
    dragStart: { x, y },
    dragStartEditorId: editorId,
    dragJointId: jointId,
    dragModifierKeys: modifierKeys,
    dragEnd: null,
    dragEndEditorId: null,
  };
});
