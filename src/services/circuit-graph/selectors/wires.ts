import { createSelector } from "reselect";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";

export const wiresByWireIdSelector = createCircuitGraphSelector(
  (state) => state.wiresByWireId
);
export const wireIdsSelector = createSelector(
  wiresByWireIdSelector,
  (wiresByWireId) => Object.keys(wiresByWireId)
);

const EmptyWireSegmentIds = Object.freeze<string[]>([]);
export const wireSegmentIdsByWireId = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    return s.wireSegmentsById[wireId] ?? EmptyWireSegmentIds;
  }
);

export const wireSegmentByWireSegmentId = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireSegmentId: string) => {
    return s.wireSegmentsById[wireSegmentId] ?? null;
  }
);
