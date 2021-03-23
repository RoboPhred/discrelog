import pick from "lodash/pick";
import findKey from "lodash/findKey";
import includes from "lodash/includes";
import mapValues from "lodash/mapValues";

import { CircuitGraphServiceState } from "../../state";

import wireDelete from "./wire-delete";

export default function wireSegmentDelete(
  state: CircuitGraphServiceState,
  removedWireSegmentId: string
): CircuitGraphServiceState {
  const removedSegment = state.wireSegmentsById[removedWireSegmentId];
  if (!removedSegment) {
    return state;
  }

  const wireId = findKey(state.wiresByWireId, (wire) =>
    includes(wire.wireSegmentIds, removedWireSegmentId)
  );
  if (!wireId) {
    return state;
  }

  if (
    removedSegment.type === "bridge" ||
    removedSegment.type === "input-output"
  ) {
    // Remove the whole wire.
    // Maybe in the future we can split bridge segments in to two wires.
    return wireDelete(state, wireId);
  }

  // At this point, the segment is a connection from an element to the rest of the wire.

  return {
    ...state,
    wireSegmentsById: pick(
      state.wireSegmentsById,
      Object.keys(state.wireSegmentsById).filter(
        (x) => x !== removedWireSegmentId
      )
    ),
    wiresByWireId: mapValues(state.wiresByWireId, (wire) => ({
      ...wire,
      wireSegmentIds: wire.wireSegmentIds.filter(
        (x) => x !== removedWireSegmentId
      ),
    })),
  };
}
