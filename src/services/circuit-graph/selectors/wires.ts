import { createSelector } from "reselect";
import values from "lodash/values";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";
import { elementPinEquals, wireSegmentHasInput } from "../types";

export const wiresByWireIdSelector = createCircuitGraphSelector(
  (state) => state.wiresByWireId
);
export const wireIdsSelector = createSelector(
  wiresByWireIdSelector,
  (wiresByWireId) => Object.keys(wiresByWireId)
);

export const wireSegmentsByWireSegmentIdSelector = createCircuitGraphSelector(
  (state) => state.wireSegmentsById
);

export const wireSegmentsSelector = createCircuitGraphSelector(
  createSelector(
    wireSegmentsByWireSegmentIdSelector.local,
    (segmentsBySegmentId) => values(segmentsBySegmentId)
  )
);

const EmptyWireSegmentIds = Object.freeze([] as string[]);
export const wireSegmentIdsByWireIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireId: string) => {
    const wire = s.wiresByWireId[wireId];
    if (!wire) {
      return EmptyWireSegmentIds;
    }
    return wire.wireSegmentIds;
  }
);

export const wireSegmentByWireSegmentIdSelector = createCircuitGraphSelector(
  (s: CircuitGraphServiceState, wireSegmentId: string) => {
    return s.wireSegmentsById[wireSegmentId] ?? null;
  }
);

export const pinIsWiredSelector = createCircuitGraphSelector(
  (state: CircuitGraphServiceState, elementId: string, pinId: string) => {
    const segments = wireSegmentsSelector.local(state);

    for (const { inputPin } of segments.filter(wireSegmentHasInput)) {
      if (elementPinEquals(inputPin, { elementId, pinId })) {
        return true;
      }
    }

    return false;
  }
);
