import { createSelector } from "reselect";

import { CircuitGraphServiceState } from "../state";
import { createCircuitGraphSelector } from "../utils";
import { ElementConnection, wireSegmentHasInput } from "../types";

const EmptyConnections = Object.freeze([] as ElementConnection[]);
export const connectionsSelector = createCircuitGraphSelector(
  createSelector(
    (state: CircuitGraphServiceState) => state.wiresByWireId,
    (state: CircuitGraphServiceState) => state.wireSegmentsById,
    (wiresById, segmentsById) => {
      const connections: ElementConnection[] = [];

      const wireIds = Object.keys(wiresById);
      for (const wireId of wireIds) {
        const { wireSegmentIds } = wiresById[wireId];
        const inputSegments = wireSegmentIds
          .map((id) => segmentsById[id])
          .filter(wireSegmentHasInput);
        for (const { outputPin, inputPin } of inputSegments) {
          connections.push({
            inputPin,
            outputPin,
          });
        }
      }

      return connections;
    }
  )
);
