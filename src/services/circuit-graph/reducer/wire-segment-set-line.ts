import { isWireSegmentSetLineAction } from "@/actions/wire-segment-set-line";
import { isInputWireSegment, isOutputWireSegment } from "../types";
import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireSegmentSetLineAction(action)) {
    return state;
  }

  const { wireSegmentId, lineId } = action.payload;

  const segment = state.wireSegmentsById[wireSegmentId];
  if (!segment) {
    return state;
  }

  if (!isInputWireSegment(segment) && !isOutputWireSegment(segment)) {
    return state;
  }

  return {
    ...state,
    wireSegmentsById: {
      ...state.wireSegmentsById,
      [wireSegmentId]: {
        ...segment,
        lineId,
      },
    },
  };
});
