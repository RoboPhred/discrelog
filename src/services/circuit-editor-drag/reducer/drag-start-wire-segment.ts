import { dotProduct, normalize, pointSubtract } from "@/geometry";

import { isCircuitEditorDragStartWireSegmentAction } from "@/actions/circuit-editor-drag-start-wire-segment";

import {
  endPositionForWireSegmentId,
  startPositionForWireSegmentId,
} from "@/services/circuit-graph/selectors/wire-positions";

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
    const startPos = startPositionForWireSegmentId(rootState, wireSegmentId);
    const endPos = endPositionForWireSegmentId(rootState, wireSegmentId);
    const lineVector = normalize(pointSubtract(endPos, startPos));
    const v = pointSubtract({ x, y }, startPos);
    const segmentInsertLength = dotProduct(v, lineVector);

    return {
      dragMode: "wire",
      dragStart: { x, y },
      dragStartEditorId: editorId,
      dragModifierKeys: modifierKeys,
      dragStartTarget: {
        type: "segment",
        segmentId: wireSegmentId,
        segmentInsertLength,
      },
      dragEnd: null,
      dragEndEditorId: null,
    };
  }

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
