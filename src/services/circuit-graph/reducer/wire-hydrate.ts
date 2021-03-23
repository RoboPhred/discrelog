import { isHydrateWireAction } from "@/actions/wire-hydrate";

import { WireSegment } from "../types";
import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isHydrateWireAction(action)) {
    return state;
  }

  const { wireId, wireSegments } = action.payload;

  const newSegments: Record<string, WireSegment> = {};
  for (const segment of wireSegments) {
    const { wireSegmentId, ...wireSegment } = segment;
    newSegments[wireSegmentId] = wireSegment;
  }

  return {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        wireSegmentIds: wireSegments.map((x) => x.wireSegmentId),
      },
    },
    wireSegmentsById: {
      ...state.wireSegmentsById,
      ...newSegments,
    },
  };
});
