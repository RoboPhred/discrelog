import { dotProduct, normalize, pointSubtract } from "@/geometry";

import { isCircuitEditorDragStartWireSegmentAction } from "@/actions/circuit-editor-drag-start-wire-segment";

import {
  endPositionByWireSegmentId,
  startPositionByWireSegmentId,
} from "@/services/circuit-layout/selectors/wires";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action, rootState) => {
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

  if (modifierKeys.ctrlMetaKey) {
    const startPos = startPositionByWireSegmentId(rootState, wireSegmentId);
    const endPos = endPositionByWireSegmentId(rootState, wireSegmentId);
    const lineDir = normalize(pointSubtract(endPos, startPos));
    const v = pointSubtract({ x, y }, startPos);
    const segmentPositionFraction = dotProduct(v, lineDir);

    return {
      dragMode: "wire",
      dragStart: { x, y },
      dragStartEditorId: editorId,
      dragModifierKeys: modifierKeys,
      dragStartTarget: {
        type: "segment",
        wireId: wireId,
        segmentId: wireSegmentId,
        segmentPositionFraction,
      },
      dragEnd: null,
      dragEndEditorId: null,
    };
  }

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
