import { CircuitGraphServiceState } from "../../state";
import { WireSegment } from "../../types";

export function wireSegmentInsert(
  state: CircuitGraphServiceState,
  wireId: string,
  segmentId: string,
  segment: WireSegment
): CircuitGraphServiceState {
  return {
    ...state,
    wiresByWireId: {
      ...state.wiresByWireId,
      [wireId]: {
        ...state.wiresByWireId[wireId],
        wireSegmentIds: [
          ...state.wiresByWireId[wireId].wireSegmentIds,
          segmentId,
        ],
      },
    },
    wireSegmentsById: {
      ...state.wireSegmentsById,
      [segmentId]: segment,
    },
  };
}
