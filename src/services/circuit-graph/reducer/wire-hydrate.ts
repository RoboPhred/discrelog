import { Point } from "@/geometry";

import { isHydrateWireAction } from "@/actions/wire-hydrate";

import { WireSegment } from "../types";
import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isHydrateWireAction(action)) {
    return state;
  }

  const { wireId, wireSegments, wireJoints } = action.payload;

  const newSegments: Record<string, WireSegment> = {};
  for (const segment of wireSegments) {
    const { wireSegmentId, ...wireSegment } = segment;
    newSegments[wireSegmentId] = wireSegment;
  }

  const newJoints: Record<string, Point> = {};
  for (const joint of wireJoints) {
    const { jointId, ...point } = joint;
    newJoints[jointId] = point;
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
    wireJointPositionsByJointId: {
      ...state.wireJointPositionsByJointId,
      ...newJoints,
    },
  };
});
