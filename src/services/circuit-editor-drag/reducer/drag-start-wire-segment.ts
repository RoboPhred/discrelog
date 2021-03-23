import { isCircuitEditorDragStartWireSegmentAction } from "@/actions/circuit-editor-drag-start-wire-segment";
import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action) => {
  if (!isCircuitEditorDragStartWireSegmentAction(action)) {
    return state;
  }

  const {
    x,
    y,
    editorId,
    modifierKeys,
    wireId,
    wireSegmentId,
  } = action.payload;

  // FIXME WIRE: If holding ctrl, start a new segment.
  return {
    dragMode: "wire-segment-new-joint",
    dragStart: { x, y },
    dragStartEditorId: editorId,
    dragModifierKeys: modifierKeys,
    dragWireId: wireId,
    dragWireSegmentId: wireSegmentId,
    dragEnd: null,
    dragEndEditorId: null,
  };
});
